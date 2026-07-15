import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const {
      userId, medication, dosage,
      quantity, refillOn, refillSchedule,
    } = await request.json()

    if (!userId || !medication || !dosage || !quantity || !refillOn || !refillSchedule) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    const prescription = await prisma.prescription.create({
      data: {
        userId: parseInt(userId),
        medication,
        dosage,
        quantity: parseInt(quantity),
        refillOn: new Date(refillOn),
        refillSchedule,
      },
    })

    return NextResponse.json(prescription, { status: 201 })
  } catch (error) {
    console.error('[POST /api/prescriptions]', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}