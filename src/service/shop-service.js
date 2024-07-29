import { validate } from '../validation/index.js';
import { prisma } from '../application/database.js';
import { ResponseError } from '../error/response-error.js';
import {
  createShopValidation,
  getShopValidation,
} from '../validation/shop-validation.js';

const create = async (user, _request) => {
  const request = validate(createShopValidation, _request);

  return prisma.shop.create({
    data: { ...request.shop, user_id: user.id, address: { create: request.address } },
    select: { id: true, name: true, no_hp: true, address: true },
  });
};

const get = async (user, _id) => {
  const id = validate(getShopValidation, _id);

  const shop = await prisma.shop.findFirst({
    where: { user_id: user.id, id: id },
    select: {
      name: true,
      no_hp: true,
      address: true,
    },
  });

  if (!shop) throw new ResponseError(404, 'Outlet tidak ditemukan');

  return shop;
};

export default {
  create,
  get,
};
