import { NextResponse } from 'next/server';
import { auth } from '../../../lib/auth.js';
import { Message, MessageRecipient, User } from '../../../../models/index.js';

// GET - Nombre de messages non lus
export async function GET(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorise' }, { status: 401 });
    }

    // Compter les messages non lus
    const unreadCount = await MessageRecipient.count({
      where: {
        recipientId: session.user.id,
        readAt: null,
        isDeleted: false,
      },
      include: [
        {
          model: Message,
          as: 'message',
          where: { isDeleted: false },
          required: true,
        },
      ],
    });

    // Compter les messages urgents non lus
    const urgentCount = await MessageRecipient.count({
      where: {
        recipientId: session.user.id,
        readAt: null,
        isDeleted: false,
      },
      include: [
        {
          model: Message,
          as: 'message',
          where: { isDeleted: false, priority: 'URGENT' },
          required: true,
        },
      ],
    });

    // Recuperer les 5 derniers messages non lus pour l'apercu
    const recentUnread = await MessageRecipient.findAll({
      where: {
        recipientId: session.user.id,
        readAt: null,
        isDeleted: false,
      },
      include: [
        {
          model: Message,
          as: 'message',
          where: { isDeleted: false },
          include: [
            {
              model: User,
              as: 'sender',
              attributes: ['id', 'name', 'email', 'image'],
            },
          ],
        },
      ],
      order: [[{ model: Message, as: 'message' }, 'createdAt', 'DESC']],
      limit: 5,
    });

    const preview = recentUnread.map(r => ({
      id: r.message.id,
      subject: r.message.subject,
      priority: r.message.priority,
      sender: r.message.sender,
      createdAt: r.message.createdAt,
    }));

    return NextResponse.json({
      success: true,
      unreadCount,
      urgentCount,
      preview,
    });
  } catch (error) {
    console.error('Error fetching unread count:', error);
    return NextResponse.json(
      { error: 'Erreur lors du comptage des messages', details: error.message },
      { status: 500 }
    );
  }
}
