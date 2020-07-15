export class MyError extends Error {
  constructor(public status: number) {
    super();
  }
}
