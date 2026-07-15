import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashPassword } from '@/lib/auth'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        appointments: { orderBy: { datetime: 'asc' } },
        prescriptions: { orderBy: { refillOn: 'asc' } },
      },
    })

    if (!user) {
      return NextResponse.json({ error: 'Patient not found' }, { status: 404 })
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error('[GET /api/patients/:id]', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { name, email, password } = await request.json()

    const data: Record<string, string> = {}
    if (name) data.name = name
    if (email) data.email = email
    if (password) data.passwordHash = await hashPassword(password)

    const user = await prisma.user.update({
      where: { id: parseInt(id) },
      data,
      select: { id: true, name: true, email: true, createdAt: true },
    })

    return NextResponse.json(user)
  } catch (error) {
    console.error('[PUT /api/patients/:id]', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}