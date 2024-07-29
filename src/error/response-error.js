class ResponseError extends Error {
  constructor(status, message, data) {
    super(message);
    this.data = data;
    this.status = status;
  }
}

export { ResponseError };
