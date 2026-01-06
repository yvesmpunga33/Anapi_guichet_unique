import { NextResponse } from 'next/server';
import { auth } from '../../../../lib/auth.js';
import {
  StakeholderDialogue,
  DialogueParticipant,
  User,
} from '../../../../../models/index.js';

// GET /api/business-climate/dialogues/[id] - Get a single dialogue
export async function GET(request, { params }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { id } = await params;

    const dialogue = await StakeholderDialogue.findByPk(id, {
      include: [
        { model: User, as: 'organizer', attributes: ['id', 'name', 'email'] },
        {
          model: DialogueParticipant,
          as: 'participants',
          attributes: ['id', 'name', 'organization', 'role', 'email', 'phone', 'participantType', 'invitationStatus', 'attended'],
        },
      ],
    });

    if (!dialogue) {
      return NextResponse.json({ error: 'Dialogue non trouvé' }, { status: 404 });
    }

    return NextResponse.json(dialogue);
  } catch (error) {
    console.error('Error fetching dialogue:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération du dialogue', details: error.message },
      { status: 500 }
    );
  }
}

// PUT /api/business-climate/dialogues/[id] - Update a dialogue
export async function PUT(request, { params }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    const dialogue = await StakeholderDialogue.findByPk(id);
    if (!dialogue) {
      return NextResponse.json({ error: 'Dialogue non trouvé' }, { status: 404 });
    }

    const {
      title,
      description,
      eventType,
      status,
      sector,
      mainTopic,
      objectives,
      agenda,
      venue,
      venueAddress,
      isOnline,
      onlineLink,
      scheduledDate,
      startTime,
      endTime,
      expectedParticipants,
      actualParticipants,
      minutes,
      decisions,
      actionItems,
      recommendations,
      notes,
    } = body;

    await dialogue.update({
      title: title || dialogue.title,
      description: description !== undefined ? description : dialogue.description,
      eventType: eventType || dialogue.eventType,
      status: status || dialogue.status,
      sector: sector !== undefined ? sector : dialogue.sector,
      mainTopic: mainTopic !== undefined ? mainTopic : dialogue.mainTopic,
      objectives: objectives || dialogue.objectives,
      agenda: agenda || dialogue.agenda,
      venue: venue !== undefined ? venue : dialogue.venue,
      venueAddress: venueAddress !== undefined ? venueAddress : dialogue.venueAddress,
      isOnline: isOnline !== undefined ? isOnline : dialogue.isOnline,
      onlineLink: onlineLink !== undefined ? onlineLink : dialogue.onlineLink,
      scheduledDate: scheduledDate ? new Date(scheduledDate) : dialogue.scheduledDate,
      startTime: startTime !== undefined ? startTime : dialogue.startTime,
      endTime: endTime !== undefined ? endTime : dialogue.endTime,
      expectedParticipants: expectedParticipants !== undefined ? expectedParticipants : dialogue.expectedParticipants,
      actualParticipants: actualParticipants !== undefined ? actualParticipants : dialogue.actualParticipants,
      minutes: minutes !== undefined ? minutes : dialogue.minutes,
      decisions: decisions || dialogue.decisions,
      actionItems: actionItems || dialogue.actionItems,
      recommendations: recommendations || dialogue.recommendations,
      notes: notes !== undefined ? notes : dialogue.notes,
    });

    return NextResponse.json(dialogue);
  } catch (error) {
    console.error('Error updating dialogue:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour du dialogue', details: error.message },
      { status: 500 }
    );
  }
}

// DELETE /api/business-climate/dialogues/[id] - Delete a dialogue
export async function DELETE(request, { params }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { id } = await params;

    const dialogue = await StakeholderDialogue.findByPk(id);
    if (!dialogue) {
      return NextResponse.json({ error: 'Dialogue non trouvé' }, { status: 404 });
    }

    // Delete associated participants first
    await DialogueParticipant.destroy({ where: { dialogueId: id } });

    await dialogue.destroy();

    return NextResponse.json({ message: 'Dialogue supprimé avec succès' });
  } catch (error) {
    console.error('Error deleting dialogue:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression du dialogue', details: error.message },
      { status: 500 }
    );
  }
}
