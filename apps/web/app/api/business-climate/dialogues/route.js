import { NextResponse } from 'next/server';
import { auth } from '../../../lib/auth.js';
import {
  StakeholderDialogue,
  DialogueParticipant,
  User,
} from '../../../../models/index.js';
import { Op } from 'sequelize';

// GET /api/business-climate/dialogues - List all dialogues
export async function GET(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 20;
    const status = searchParams.get('status');
    const eventType = searchParams.get('eventType');
    const thematicArea = searchParams.get('thematicArea');
    const upcoming = searchParams.get('upcoming') === 'true';
    const search = searchParams.get('search');

    const where = {};

    if (status) where.status = status;
    if (eventType) where.eventType = eventType;
    if (thematicArea) where.thematicArea = thematicArea;

    if (upcoming) {
      where.scheduledDate = { [Op.gte]: new Date() };
      where.status = { [Op.in]: ['PLANNED', 'CONFIRMED'] };
    }

    if (search) {
      where[Op.or] = [
        { reference: { [Op.iLike]: `%${search}%` } },
        { title: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } },
      ];
    }

    const { count, rows } = await StakeholderDialogue.findAndCountAll({
      where,
      include: [
        { model: User, as: 'organizer', attributes: ['id', 'name', 'email'] },
        {
          model: DialogueParticipant,
          as: 'participants',
          attributes: ['id', 'name', 'organization', 'role'],
          separate: true,
          limit: 5,
        },
      ],
      order: [['scheduledDate', upcoming ? 'ASC' : 'DESC']],
      limit,
      offset: (page - 1) * limit,
    });

    return NextResponse.json({
      data: rows,
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching dialogues:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des dialogues', details: error.message },
      { status: 500 }
    );
  }
}

// POST /api/business-climate/dialogues - Create a new dialogue event
export async function POST(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const body = await request.json();
    const {
      title,
      description,
      eventType,
      thematicArea,
      eventDate,
      endDate,
      location,
      isVirtual,
      virtualPlatform,
      virtualLink,
      objectives,
      expectedOutcomes,
      agenda,
      targetParticipants,
      maxParticipants,
      isPublic,
      registrationDeadline,
      participants,
    } = body;

    // Generate reference
    const year = new Date().getFullYear();
    const count = await StakeholderDialogue.count({
      where: {
        createdAt: {
          [Op.gte]: new Date(year, 0, 1),
          [Op.lt]: new Date(year + 1, 0, 1),
        },
      },
    });
    const reference = `DLG-${year}-${String(count + 1).padStart(4, '0')}`;

    const dialogue = await StakeholderDialogue.create({
      reference,
      title,
      description,
      eventType,
      sector: thematicArea,
      mainTopic: title,
      status: 'PLANNED',
      scheduledDate: eventDate ? new Date(eventDate) : new Date(),
      venue: location,
      isOnline: isVirtual || false,
      onlineLink: virtualLink,
      objectives: objectives || [],
      agenda: agenda || [],
      expectedParticipants: maxParticipants ? parseInt(maxParticipants) : 0,
      organizerId: session.user.id,
      createdById: session.user.id,
    });

    // Add participants if provided
    if (participants && Array.isArray(participants)) {
      for (const participant of participants) {
        await DialogueParticipant.create({
          dialogueId: dialogue.id,
          name: participant.name,
          organization: participant.organization,
          participantType: participant.type || 'OTHER',
          role: participant.role || 'PARTICIPANT',
          email: participant.email,
          phone: participant.phone,
        });
      }
    }

    return NextResponse.json(dialogue, { status: 201 });
  } catch (error) {
    console.error('Error creating dialogue:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création du dialogue', details: error.message },
      { status: 500 }
    );
  }
}
