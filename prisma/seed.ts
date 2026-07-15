import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import * as dotenv from 'dotenv'
dotenv.config()

const prisma = new PrismaClient()

const medications = [
  'Diovan','Lexapro','Metformin','Ozempic','Prozac','Seroquel','Tegretol'
]

const dosages = [
  '1mg','2mg','3mg','5mg','10mg','25mg','50mg','100mg','250mg','500mg','1000mg'
]

const users = [
  {
    id: 1,
    name: 'Mark Johnson',
    email: 'mark@some-email-provider.net',
    password: 'Password123!',
    appointments: [
      {
        id: 1,
        provider: 'Dr Kim West',
        datetime: '2026-04-16T16:30:00.000-07:00',
        repeatSchedule: 'weekly',
        endsOn: null,
      },
      {
        id: 2,
        provider: 'Dr Lin James',
        datetime: '2026-04-19T18:30:00.000-07:00',
        repeatSchedule: 'monthly',
        endsOn: null,
      },
    ],
    prescriptions: [
      {
        id: 1,
        medication: 'Lexapro',
        dosage: '5mg',
        quantity: 2,
        refillOn: '2026-04-05',
        refillSchedule: 'monthly',
      },
      {
        id: 2,
        medication: 'Ozempic',
        dosage: '1mg',
        quantity: 1,
        refillOn: '2026-04-10',
        refillSchedule: 'monthly',
      },
    ],
  },
  {
    id: 2,
    name: 'Lisa Smith',
    email: 'lisa@some-email-provider.net',
    password: 'Password123!',
    appointments: [
      {
        id: 3,
        provider: 'Dr Sally Field',
        datetime: '2026-04-22T18:15:00.000-07:00',
        repeatSchedule: 'monthly',
        endsOn: null,
      },
      {
        id: 4,
        provider: 'Dr Lin James',
        datetime: '2026-04-25T20:00:00.000-07:00',
        repeatSchedule: 'weekly',
        endsOn: null,
      },
    ],
    prescriptions: [
      {
        id: 3,
        medication: 'Metformin',
        dosage: '500mg',
        quantity: 2,
        refillOn: '2026-04-15',
        refillSchedule: 'monthly',
      },
      {
        id: 4,
        medication: 'Diovan',
        dosage: '100mg',
        quantity: 1,
        refillOn: '2026-04-25',
        refillSchedule: 'monthly',
      },
    ],
  },
]

async function main() {
  console.log(' Seeding database...')

  for (const name of medications) {
    await prisma.medication.upsert({
      where: { name },
      update: {},
      create: { name },
    })
  }
  console.log('Medications seeded....')

  for (const value of dosages) {
    await prisma.dosage.upsert({
      where: { value },
      update: {},
      create: { value },
    })
  }
  console.log('Dosages seeded....')

  for (const userData of users) {
    const passwordHash = await bcrypt.hash(userData.password, 10)

    const user = await prisma.user.upsert({
      where: { email: userData.email },
      update: { name: userData.name, passwordHash },
      create: {
        id: userData.id,
        name: userData.name,
        email: userData.email,
        passwordHash,
      },
    })

    for (const appt of userData.appointments) {
      await prisma.appointment.upsert({
        where: { id: appt.id },
        update: {},
        create: {
          id: appt.id,
          userId: user.id,
          provider: appt.provider,
          datetime: new Date(appt.datetime),
          repeatSchedule: appt.repeatSchedule,
          endsOn: appt.endsOn,
        },
      })
    }

    for (const rx of userData.prescriptions) {
      await prisma.prescription.upsert({
        where: { id: rx.id },
        update: {},
        create: {
          id: rx.id,
          userId: user.id,
          medication: rx.medication,
          dosage: rx.dosage,
          quantity: rx.quantity,
          refillOn: new Date(rx.refillOn),
          refillSchedule: rx.refillSchedule,
        },
      })
    }

    console.log(` Seeded: ${user.name}`)
  }

  // Reset auto-increment sequences after inserting explicit IDs.
  // Without this, the next INSERT tries id=1 and hits a unique constraint.
  await prisma.$executeRawUnsafe(
    `SELECT setval(pg_get_serial_sequence('"User"', 'id'), COALESCE((SELECT MAX(id) FROM "User"), 1))`
  )
  await prisma.$executeRawUnsafe(
    `SELECT setval(pg_get_serial_sequence('"Appointment"', 'id'), COALESCE((SELECT MAX(id) FROM "Appointment"), 1))`
  )
  await prisma.$executeRawUnsafe(
    `SELECT setval(pg_get_serial_sequence('"Prescription"', 'id'), COALESCE((SELECT MAX(id) FROM "Prescription"), 1))`
  )

  console.log('✅ Sequences reset')

  console.log(' Done!.....')
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(async () => { await prisma.$disconnect() })