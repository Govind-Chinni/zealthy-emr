import {
  addWeeks,
  addMonths,
  isAfter,
  isBefore,
  isEqual,
  parseISO,
} from 'date-fns'
import { Appointment, AppointmentOccurrence } from '@/types'

export function expandRecurring(
  appointments: Appointment[],
  from: Date,
  to: Date
): AppointmentOccurrence[] {
  const occurrences: AppointmentOccurrence[] = []

  for (const appt of appointments) {
    const base = parseISO(appt.datetime)
    const hardStop = appt.endsOn
      ? isBefore(parseISO(appt.endsOn), to)
        ? parseISO(appt.endsOn)
        : to
      : to

    if (appt.repeatSchedule === 'none') {
      if (
        (isAfter(base, from) || isEqual(base, from)) &&
        (isBefore(base, to) || isEqual(base, to))
      ) {
        occurrences.push({ ...appt, occurrenceDate: base })
      }
      continue
    }

    let cursor = base

    while (isBefore(cursor, hardStop) || isEqual(cursor, hardStop)) {
      if (isAfter(cursor, from) || isEqual(cursor, from)) {
        occurrences.push({ ...appt, occurrenceDate: new Date(cursor) })
      }
      if (appt.repeatSchedule === 'weekly') {
        cursor = addWeeks(cursor, 1)
      } else if (appt.repeatSchedule === 'monthly') {
        cursor = addMonths(cursor, 1)
      } else {
        break
      }
    }
  }

  return occurrences.sort(
    (a, b) => a.occurrenceDate.getTime() - b.occurrenceDate.getTime()
  )
}

export function upcomingRefills<T extends { refillOn: string }>(
  prescriptions: T[],
  from: Date,
  to: Date
): T[] {
  return prescriptions.filter((rx) => {
    const refill = parseISO(rx.refillOn)
    return (
      (isAfter(refill, from) || isEqual(refill, from)) &&
      (isBefore(refill, to) || isEqual(refill, to))
    )
  })
}