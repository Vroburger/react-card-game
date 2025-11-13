import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// POST: Add or update a card in a user's collection
export async function POST(request: Request) {
  const { userId, cardId, quantity } = await request.json();

  if (!userId || !cardId) {
    return NextResponse.json({ error: 'userId and cardId are required' }, { status: 400 });
  }

  try {
    const existing = await prisma.userCard.findFirst({
      where: { userId, cardId },
    });

    if (existing) {
      if (quantity <= 0) {
        // 🗑 Delete the card if quantity is zero or less
        await prisma.userCard.delete({
          where: { id: existing.id },
        });
        return NextResponse.json({ message: 'Card removed from collection' });
      } else {
        // ✏️ Set the quantity instead of adding to it
        const updated = await prisma.userCard.update({
          where: { id: existing.id },
          data: { quantity },
        });
        return NextResponse.json(updated);
      }
    } else {
      // ➕ Create a new record if user doesn’t already own it
      const created = await prisma.userCard.create({
        data: { userId, cardId, quantity: quantity || 1 },
      });
      return NextResponse.json(created);
    }
  } catch (error) {
    console.error('Error updating user cards:', error);
    return NextResponse.json({ error: 'Could not update user cards' }, { status: 500 });
  }
}

// GET: Fetch all cards owned by a specific user
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const userId = parseInt(searchParams.get('userId') || '')

  if (!userId) {
    return NextResponse.json({ error: 'userId is required' }, { status: 400 })
  }

  try {
    const userCards = await prisma.userCard.findMany({
      where: { userId },
      include: { card: true },
    })

    return NextResponse.json(userCards)
  } catch (error) {
    console.error('Error fetching user cards:', error)
    return NextResponse.json({ error: 'Could not fetch user cards' }, { status: 500 })
  }
}
