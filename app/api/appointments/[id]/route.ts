import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { provider, datetime, repeatSchedule, endsOn } = await request.json()

    const appointment = await prisma.appointment.update({
      where: { id: parseInt(id) },
      data: {
        ...(provider && { provider }),
        ...(datetime && { datetime: new Date(datetime) }),
        ...(repeatSchedule !== undefined && { repeatSchedule }),
        endsOn: endsOn !== undefined
          ? endsOn ? new Date(endsOn) : null
          : undefined,
      },
    })

    return NextResponse.json(appointment)
  } catch (error) {
    console.error('[PUT /api/appointments/:id]', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await prisma.appointment.delete({ where: { id: parseInt(id) } })
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('[DELETE /api/appointments/:id]', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}