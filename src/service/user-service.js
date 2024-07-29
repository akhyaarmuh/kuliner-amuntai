import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { validate } from '../validation/index.js';
import { prisma } from '../application/database.js';
import { ResponseError } from '../error/response-error.js';
import { accessToken, refreshToken } from '../secret.js';
import {
  registerUserValidation,
  loginUserValidation,
  getUserValidation,
  updateUserValidation,
} from '../validation/user-validation.js';

const register = async (request) => {
  const user = validate(registerUserValidation, request);

  const countUser = await prisma.user.count({ where: { email: user.email } });

  if (countUser) throw new ResponseError(400, 'Email sudah terdaftar');

  user.password = await bcrypt.hash(user.password, 10);

  return prisma.user.create({
    data: user,
    select: { id: true, full_name: true, email: true },
  });
};

const login = async (_request) => {
  const request = validate(loginUserValidation, _request);

  const user = await prisma.user.findUnique({
    where: { email: request.email },
    select: { id: true, full_name: true, email: true, password: true, status: true },
  });

  if (!user) throw new ResponseError(401, 'Email atau katasandi salah');

  const isValidPassword = await bcrypt.compare(request.password, user.password);
  if (!isValidPassword) throw new ResponseError(401, 'Email atau katasandi salah');

  if (!user.status)
    throw new ResponseError(401, 'Akun anda terblokir, silakan hubungi admin');

  const payload = {
    id: user.id,
    email: user.email,
  };

  const refresh_token = jwt.sign(payload, refreshToken, {
    expiresIn: '15d',
  });

  await prisma.user.update({
    where: {
      email: user.email,
    },
    data: {
      refresh_token: refresh_token,
    },
  });

  const access_token = jwt.sign(payload, accessToken, {
    expiresIn: '30s',
  });

  return { access_token, refresh_token };
};

const get = async (user) => {
  const idUser = validate(getUserValidation, user.id);

  const currentUser = await prisma.user.findUnique({
    where: { id: idUser },
    select: { id: true, full_name: true, email: true },
  });

  if (!currentUser) throw new ResponseError(404, 'User tidak ditemukan');

  return currentUser;
};

const update = async (user, _request) => {
  const request = validate(updateUserValidation, _request);

  const count = await prisma.user.count({ where: { id: user.id } });

  if (!count) throw new ResponseError(404, 'User tidak ditemukan');

  const data = {};
  if (request.full_name) data.full_name = request.full_name;
  if (request.password) data.password = await bcrypt.hash(request.password, 10);

  return prisma.user.update({
    where: { id: user.id },
    data: data,
    select: {
      id: true,
      email: true,
      full_name: true,
    },
  });
};

export default {
  register,
  login,
  get,
  update,
};
