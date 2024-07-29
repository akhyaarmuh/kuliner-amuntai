import { ResponseError } from '../error/response-error.js';

export const createResponse = (data) => {
  const errors = {};

  data.forEach(({ context, message }) => {
    errors[context.label] = message;
  });

  return errors;
};

const validate = (schemaValidation, request) => {
  const { value, error } = schemaValidation.validate(request, {
    abortEarly: false,
    allowUnknown: false,
  });

  if (error) {
    throw new ResponseError(422, 'Invalid request body', createResponse(error.details));
  } else {
    return value;
  }
};

export { validate };
