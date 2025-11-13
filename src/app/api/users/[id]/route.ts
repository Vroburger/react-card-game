import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Get user by ID along with their owned cards
export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params // - await is required in Next.js 15+

  try {
    const userId = parseInt(id)
    if (isNaN(userId)) {
      return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        cards: {
          include: { card: true },
        },
      },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json(user, { status: 200 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 })
  }
}

// Add or update a card in user's collection
export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params

  try {
    const userId = parseInt(id)
    if (isNaN(userId)) {
      return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 })
    }

    const body = await request.json()
    const { cardId, quantity } = body

    if (!cardId || quantity == null) {
      return NextResponse.json({ error: 'cardId and quantity are required' }, { status: 400 })
    }

    // Check if this user already owns the card
    const existing = await prisma.userCard.findFirst({
      where: { userId, cardId },
    })

    // 🧠 If quantity is 0 → delete card instead of updating
    if (quantity === 0) {
      if (existing) {
        await prisma.userCard.delete({ where: { id: existing.id } })
      }
    } else if (existing) {
      // Set new quantity (idempotent)
      await prisma.userCard.update({
        where: { id: existing.id },
        data: { quantity },
      })
    } else {
      // Create new record
      await prisma.userCard.create({
        data: {
          userId,
          cardId,
          quantity,
        },
      })
    }

    // Return updated user with cards
    const updatedUser = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        cards: {
          include: { card: true },
        },
      },
    })

    return NextResponse.json(updatedUser, { status: 200 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to update user cards' }, { status: 500 })
  }
}


// Remove a card from user's collection
export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params

  try {
    const userId = parseInt(id)
    if (isNaN(userId)) {
      return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 })
    }

    const body = await request.json()
    const { cardId } = body

    if (!cardId) {
      return NextResponse.json({ error: 'cardId is required' }, { status: 400 })
    }

    // Check if that user-card link exists
    const existing = await prisma.userCard.findFirst({
      where: { userId, cardId },
    })

    if (!existing) {
      return NextResponse.json(
        { error: 'This card is not in the user’s collection' },
        { status: 404 }
      )
    }

    // Delete it
    await prisma.userCard.delete({
      where: { id: existing.id },
    })

    // Return updated user
    const updatedUser = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        cards: {
          include: { card: true },
        },
      },
    })

    return NextResponse.json(updatedUser, { status: 200 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to delete user card' }, { status: 500 })
  }
}
