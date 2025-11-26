import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { Cards } from "@/data/cards"

export async function POST(request: Request) {
  const { userId, cardId, quantity } = await request.json()

  if (!userId || !cardId) {
    return NextResponse.json({ error: "userId and cardId are required" }, { status: 400 })
  }

  // Check if cardId exists in cards.ts
  const cardDef = Cards[cardId as keyof typeof Cards]
  if (!cardDef) {
    return NextResponse.json({ error: "Invalid cardId — card does not exist" }, { status: 400 })
  }

  try {
    const existing = await prisma.userCard.findFirst({
      where: { userId, cardId },
    })

    if (existing) {
      if (quantity <= 0) {
        await prisma.userCard.delete({ where: { id: existing.id } })
        return NextResponse.json({ message: "Card removed from collection" })
      }

      const updated = await prisma.userCard.update({
        where: { id: existing.id },
        data: { quantity },
      })

      return NextResponse.json(updated)
    }

    // Create if not existing
    const created = await prisma.userCard.create({
      data: { userId, cardId, quantity: quantity || 1 },
    })

    return NextResponse.json(created)
  } catch (error) {
    console.error("Error updating user cards:", error)
    return NextResponse.json({ error: "Could not update user cards" }, { status: 500 })
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const userId = parseInt(searchParams.get("userId") || "")

  if (!userId) {
    return NextResponse.json({ error: "userId is required" }, { status: 400 })
  }

  try {
    const userCards = await prisma.userCard.findMany({
      where: { userId },
    })

    // Attach card definitions from cards.ts
    const enriched = userCards.map((uc) => ({
      ...uc,
      card: Cards[uc.cardId as keyof typeof Cards] || null,
    }))

    return NextResponse.json(enriched)
  } catch (error) {
    console.error("Error fetching user cards:", error)
    return NextResponse.json({ error: "Could not fetch user cards" }, { status: 500 })
  }
}
