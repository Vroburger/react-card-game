import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// POST: create a new user
export async function POST(request: Request) {
  const { username, email, password } = await request.json()

  if (!username || !email || !password) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  try {
    const user = await prisma.user.create({
      data: {
        username,
        email,
        password, // in production, hash this!
      },
    })

    return NextResponse.json(user)
  } catch (error) {
    console.error('Error creating user:', error)
    return NextResponse.json({ error: 'Could not create user' }, { status: 500 })
  }
}

// GET: list all users
export async function GET() {
  try {
    const users = await prisma.user.findMany()
    return NextResponse.json(users)
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json({ error: 'Could not fetch users' }, { status: 500 })
  }
}
