import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { Cards } from '@/data/cards'

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params

  try {
    const userId = parseInt(id)
    if (isNaN(userId))
      return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 })

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { collection: true },
    })

    if (!user)
      return NextResponse.json({ error: 'User not found' }, { status: 404 })

    const enriched = {
      ...user,
      collection: user.collection.map((uc: any) => ({
        ...uc,
        card: Cards[uc.cardId] ?? null,
      })),
    }

    return NextResponse.json(enriched)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 })
  }
}

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params

  try {
    const userId = parseInt(id)
    if (isNaN(userId))
      return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 })

    const { cardId, quantity } = await request.json()

    if (typeof cardId !== 'number' || typeof quantity !== 'number') {
      return NextResponse.json(
        { error: 'cardId and quantity must be numbers' },
        { status: 400 },
      )
    }

    if (!cardId || quantity == null)
      return NextResponse.json(
        { error: 'cardId and quantity required' },
        { status: 400 }
      )

    const existing = await prisma.userCard.findFirst({
      where: { userId, cardId },
    })

    if (quantity === 0) {
      if (existing)
        await prisma.userCard.delete({ where: { id: existing.id } })
    } else if (existing) {
      await prisma.userCard.update({
        where: { id: existing.id },
        data: { quantity },
      })
    } else {
      await prisma.userCard.create({
        data: { userId, cardId, quantity },
      })
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { collection: true },
    })

    const enriched = {
      ...user,
      collection: user!.collection.map((uc: any) => ({
        ...uc,
        card: Cards[uc.cardId] ?? null,
      })),
    }

    return NextResponse.json(enriched)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to update user cards' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params

  try {
    const userId = parseInt(id)
    if (isNaN(userId))
      return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 })

    const { cardId } = await request.json()

    if (!cardId)
      return NextResponse.json({ error: 'cardId is required' }, { status: 400 })

    const existing = await prisma.userCard.findFirst({
      where: { userId, cardId },
    })

    if (!existing)
      return NextResponse.json(
        { error: 'This card is not in the user’s collection' },
        { status: 404 }
      )

    await prisma.userCard.delete({
      where: { id: existing.id },
    })

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { collection: true },
    })

    const enriched = {
      ...user!,
      collection: user!.collection.map((uc: any) => ({
        ...uc,
        card: Cards[uc.cardId] ?? null,
      })),
    }

    return NextResponse.json(enriched)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to delete user card' }, { status: 500 })
  }
}
