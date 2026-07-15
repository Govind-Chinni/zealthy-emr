import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { medication, dosage, quantity, refillOn, refillSchedule } =
      await request.json()

    const prescription = await prisma.prescription.update({
      where: { id: parseInt(id) },
      data: {
        ...(medication && { medication }),
        ...(dosage && { dosage }),
        ...(quantity !== undefined && { quantity: parseInt(quantity) }),
        ...(refillOn && { refillOn: new Date(refillOn) }),
        ...(refillSchedule && { refillSchedule }),
      },
    })

    return NextResponse.json(prescription)
  } catch (error) {
    console.error('[PUT /api/prescriptions/:id]', error)
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
    await prisma.prescription.delete({ where: { id: parseInt(id) } })
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('[DELETE /api/prescriptions/:id]', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}