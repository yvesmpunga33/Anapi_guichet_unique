import { NextResponse } from 'next/server';
import { auth } from '../../../../lib/auth.js';
import { MessageRecipient } from '../../../../../models/index.js';

// POST - Marquer un message comme lu
export async function POST(request, { params }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorise' }, { status: 401 });
    }

    const { id } = await params;

    const [updatedCount] = await MessageRecipient.update(
      { readAt: new Date() },
      {
        where: {
          messageId: id,
          recipientId: session.user.id,
          readAt: null,
        },
      }
    );

    return NextResponse.json({
      success: true,
      updated: updatedCount > 0,
    });
  } catch (error) {
    console.error('Error marking message as read:', error);
    return NextResponse.json(
      { error: 'Erreur lors du marquage du message', details: error.message },
      { status: 500 }
    );
  }
}

// DELETE - Marquer un message comme non lu
export async function DELETE(request, { params }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorise' }, { status: 401 });
    }

    const { id } = await params;

    const [updatedCount] = await MessageRecipient.update(
      { readAt: null },
      {
        where: {
          messageId: id,
          recipientId: session.user.id,
        },
      }
    );

    return NextResponse.json({
      success: true,
      updated: updatedCount > 0,
    });
  } catch (error) {
    console.error('Error marking message as unread:', error);
    return NextResponse.json(
      { error: 'Erreur lors du marquage du message', details: error.message },
      { status: 500 }
    );
  }
}
