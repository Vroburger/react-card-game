import { NextResponse } from "next/server";
import { Cards } from "@/data/cards";

export async function GET() {
  // Cards is a Record<number, CardDefinition>
  // Convert to array:
  const cardArray = Object.values(Cards);

  return NextResponse.json(cardArray);
}
