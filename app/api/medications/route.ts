import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const [medications, dosages] = await Promise.all([
      prisma.medication.findMany({ orderBy: { name: 'asc' } }),
      prisma.dosage.findMany({ orderBy: { value: 'asc' } }),
    ])
    return NextResponse.json({ medications, dosages })
  } catch (error) {
    console.error('[GET /api/medications]', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}