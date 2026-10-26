// An indefinite timeout is stored as a date in the year 9999, so the database
// treats it like any other active timeout and an admin can still lift it.
export const INDEFINITE_TIMEOUT = new Date('9999-12-31T23:59:59Z')

export const isIndefinite = (until: Date | string) => new Date(until).getUTCFullYear() >= 9999

export const describeTimeout = (until: Date | string) =>
  isIndefinite(until) ? 'indefinitely' : `until ${new Date(until).toLocaleString()}`
