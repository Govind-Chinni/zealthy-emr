import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { userId, provider, datetime, repeatSchedule, endsOn } =
      await request.json()

    if (!userId || !provider || !datetime) {
      return NextResponse.json(
        { error: 'userId, provider and datetime are required' },
        { status: 400 }
      )
    }

    const appointment = await prisma.appointment.create({
      data: {
        userId: parseInt(userId),
        provider,
        datetime: new Date(datetime),
        repeatSchedule: repeatSchedule ?? 'none',
        endsOn: endsOn ? new Date(endsOn) : null,
      },
    })

    return NextResponse.json(appointment, { status: 201 })
  } catch (error) {
    console.error('[POST /api/appointments]', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}