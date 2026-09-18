/** "Nomsa Dlamini" -> "Nomsa". Host screens greet and label people by first name only. */
export const firstName = (fullName: string): string => fullName.trim().split(' ')[0] ?? '';
