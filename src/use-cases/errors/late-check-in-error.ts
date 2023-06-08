export class LateCheckInError extends Error {
  constructor() {
    super('Late Check in')
    this.name = 'LateCheckInError'
  }
}
