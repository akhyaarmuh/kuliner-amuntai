import bcrypt from 'bcrypt';
import supertest from 'supertest';
import { web } from '../src/application/web.js';
import { prisma } from '../src/application/database.js';

// user utils
export const removeUserTest = async () => {
  await prisma.user.deleteMany({ where: { email: 'akhyaarmuh@gmail.com' } });
};

export const createRefreshTokenTest = async () => {
  let result = await supertest(web).post('/api/users/login').send({
    email: 'akhyaarmuh@gmail.com',
    password: 'Aa12345',
  });

  return result.get('Set-Cookie')[0].split(';')[0].split('=')[1];
};

export const createUserTest = async () => {
  await prisma.user.create({
    data: {
      full_name: 'Akhyaar Muhammad',
      email: 'akhyaarmuh@gmail.com',
      password: await bcrypt.hash('Aa12345', 10),
    },
  });
};

export const getUserTest = async () => {
  return prisma.user.findFirst({
    where: { email: 'akhyaarmuh@gmail.com' },
  });
};

export const disableUserTest = async () => {
  await prisma.user.update({
    where: { email: 'akhyaarmuh@gmail.com' },
    data: { status: false },
  });
};

// shop utils

export const createShopTest = async () => {
  const user = await prisma.user.findUnique({ where: { email: 'akhyaarmuh@gmail.com' } });

  return prisma.shop.create({
    data: {
      name: 'test',
      no_hp: '085161713161',
      user_id: user.id,
      address: {
        create: {
          country: 'test',
          province: 'test',
          city: 'test',
          street: 'test',
          postal_code: '76112',
        },
      },
    },
    select: { id: true },
  });
};
