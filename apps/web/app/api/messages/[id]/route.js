import { NextResponse } from 'next/server';
import { auth } from '../../../lib/auth.js';
import { Message, MessageRecipient, MessageAttachment, User, Ministry } from '../../../../models/index.js';

// GET - Detail d'un message
export async function GET(request, { params }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorise' }, { status: 401 });
    }

    const { id } = await params;

    const message = await Message.findByPk(id, {
      include: [
        {
          model: User,
          as: 'sender',
          attributes: ['id', 'name', 'email', 'image', 'ministryId'],
          include: [
            {
              model: Ministry,
              as: 'ministry',
              attributes: ['id', 'code', 'name', 'shortName'],
            },
          ],
        },
        {
          model: MessageRecipient,
          as: 'recipients',
          include: [
            {
              model: User,
              as: 'recipient',
              attributes: ['id', 'name', 'email', 'image', 'ministryId'],
              include: [
                {
                  model: Ministry,
                  as: 'ministry',
                  attributes: ['id', 'code', 'name', 'shortName'],
                },
              ],
            },
          ],
        },
        {
          model: MessageAttachment,
          as: 'attachments',
        },
      ],
    });

    if (!message) {
      return NextResponse.json({ error: 'Message non trouve' }, { status: 404 });
    }

    // Verifier que l'utilisateur a acces au message
    const isRecipient = message.recipients.some(r => r.recipientId === session.user.id);
    const isSender = message.senderId === session.user.id;

    if (!isRecipient && !isSender) {
      return NextResponse.json({ error: 'Acces refuse' }, { status: 403 });
    }

    // Marquer comme lu si c'est un destinataire
    if (isRecipient) {
      await MessageRecipient.update(
        { readAt: new Date() },
        {
          where: {
            messageId: id,
            recipientId: session.user.id,
            readAt: null,
          },
        }
      );
    }

    return NextResponse.json({
      success: true,
      message: {
        ...message.toJSON(),
        isRecipient,
        isSender,
      },
    });
  } catch (error) {
    console.error('Error fetching message:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la recuperation du message', details: error.message },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer un message
export async function DELETE(request, { params }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorise' }, { status: 401 });
    }

    const { id } = await params;

    const message = await Message.findByPk(id, {
      include: [{ model: MessageRecipient, as: 'recipients' }],
    });

    if (!message) {
      return NextResponse.json({ error: 'Message non trouve' }, { status: 404 });
    }

    // Si c'est l'expediteur, marquer le message comme supprime
    if (message.senderId === session.user.id) {
      await Message.update(
        { isDeleted: true, deletedAt: new Date() },
        { where: { id } }
      );
    } else {
      // Si c'est un destinataire, marquer seulement la reception comme supprimee
      const recipient = message.recipients.find(r => r.recipientId === session.user.id);
      if (recipient) {
        await MessageRecipient.update(
          { isDeleted: true, deletedAt: new Date() },
          { where: { id: recipient.id } }
        );
      } else {
        return NextResponse.json({ error: 'Acces refuse' }, { status: 403 });
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Message supprime avec succes',
    });
  } catch (error) {
    console.error('Error deleting message:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression du message', details: error.message },
      { status: 500 }
    );
  }
}
