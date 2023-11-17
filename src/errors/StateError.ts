export class StateError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'StateError';
  }
}
