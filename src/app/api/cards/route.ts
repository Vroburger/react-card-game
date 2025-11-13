import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// POST: Create a new card
export async function POST(request: Request) {
  const { name, description, attack, defense, type, rarity } = await request.json()

  if (!name) {
    return NextResponse.json({ error: 'Name is required' }, { status: 400 })
  }

  try {
    const card = await prisma.card.create({
      data: { name, description, attack, defense, type, rarity },
    })

    return NextResponse.json(card)
  } catch (error) {
    console.error('Error creating card:', error)
    return NextResponse.json({ error: 'Could not create card' }, { status: 500 })
  }
}

// GET: Fetch all cards
export async function GET() {
  try {
    const cards = await prisma.card.findMany({
      orderBy: { id: 'asc' },
    })
    return NextResponse.json(cards, { status: 200 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to fetch cards' }, { status: 500 })
  }
}

