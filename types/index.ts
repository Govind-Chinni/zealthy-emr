export interface User {
  id: number
  name: string
  email: string
  createdAt: string
  appointments: Appointment[]
  prescriptions: Prescription[]
}

export interface Appointment {
  id: number
  userId: number
  provider: string
  datetime: string
  repeatSchedule: 'none' | 'weekly' | 'monthly'
  endsOn: string | null
  createdAt: string
}

export interface Prescription {
  id: number
  userId: number
  medication: string
  dosage: string
  quantity: number
  refillOn: string
  refillSchedule: string
  createdAt: string
}

export interface AppointmentOccurrence extends Appointment {
  occurrenceDate: Date
}

export interface PatientSummary {
  id: number
  name: string
  email: string
  createdAt: string
  _count: {
    appointments: number
    prescriptions: number
  }
}