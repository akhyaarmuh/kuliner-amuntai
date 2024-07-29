import Joi from 'joi';

const shopSchema = Joi.object({
  name: Joi.string()
    .required()
    .trim()
    .min(2)
    .max(25)
    .pattern(/^[a-zA-Z0-9\s.-]*$/)
    .messages({
      'any.required': 'Nama harus dikirim',
      'string.empty': 'Nama tidak boleh kosong',
      'string.min': 'Nama harus memiliki setidaknya 2 karakter',
      'string.max': 'Nama tidak boleh lebih dari 25 karakter',
      'string.pattern.base': 'Nama hanya boleh terdiri dari huruf dan angka (2 - 25)',
    }),
  no_hp: Joi.string()
    .required()
    .trim()
    .min(9)
    .max(14)
    .pattern(/^0[1-9][0-9]{6,11}$/)
    .messages({
      'any.required': 'No. handphone wajib diisi',
      'string.empty': 'No. handphone tidak boleh kosong',
      'string.min': 'No. handphone harus memiliki setidaknya 9 karakter',
      'string.max': 'No. handphone tidak boleh lebih dari 14 karakter',
      'string.pattern.base': 'No. handphone hanya boleh terdiri dari angka (8 - 13)',
    }),
});

const addressSchema = Joi.object({
  country: Joi.string()
    .required()
    .trim()
    .min(2)
    .max(50)
    .pattern(/^[a-zA-Z\s.-]*$/)
    .messages({
      'any.required': 'Negara harus dikirim',
      'string.empty': 'Negara tidak boleh kosong',
      'string.min': 'Negara harus memiliki setidaknya 2 karakter',
      'string.max': 'Negara tidak boleh lebih dari 50 karakter',
      'string.pattern.base': 'Negara hanya boleh terdiri dari huruf dan angka (2 - 50)',
    }),
  province: Joi.string()
    .required()
    .trim()
    .min(2)
    .max(50)
    .pattern(/^[a-zA-Z\s.-]*$/)
    .messages({
      'any.required': 'Provinsi harus dikirim',
      'string.empty': 'Provinsi tidak boleh kosong',
      'string.min': 'Provinsi harus memiliki setidaknya 2 karakter',
      'string.max': 'Provinsi tidak boleh lebih dari 50 karakter',
      'string.pattern.base': 'Provinsi hanya boleh terdiri dari huruf dan angka (2 - 50)',
    }),
  city: Joi.string()
    .required()
    .trim()
    .min(2)
    .max(50)
    .pattern(/^[a-zA-Z\s.-]*$/)
    .messages({
      'any.required': 'Kota harus dikirim',
      'string.empty': 'Kota tidak boleh kosong',
      'string.min': 'Kota harus memiliki setidaknya 2 karakter',
      'string.max': 'Kota tidak boleh lebih dari 50 karakter',
      'string.pattern.base': 'Kota hanya boleh terdiri dari huruf dan angka (2 - 50)',
    }),
  street: Joi.string()
    .required()
    .trim()
    .min(2)
    .max(100)
    .pattern(/^[a-zA-Z\s.-|]*$/)
    .messages({
      'any.required': 'Jalan harus dikirim',
      'string.empty': 'Jalan tidak boleh kosong',
      'string.min': 'Jalan harus memiliki setidaknya 2 karakter',
      'string.max': 'Jalan tidak boleh lebih dari 100 karakter',
      'string.pattern.base': 'Jalan hanya boleh terdiri dari huruf dan angka (2 - 100)',
    }),
  postal_code: Joi.string()
    .required()
    .empty('')
    .trim()
    .pattern(/^[0-9]{5}$/)
    .messages({
      'any.required': 'Kode pos wajib diisi',
      'string.empty': 'Kode pos tidak boleh kosong',
      'string.pattern.base': 'Kode pos hanya boleh terdiri dari angka (5)',
    }),
});

const createShopValidation = Joi.object().keys({
  shop: shopSchema.required(),
  address: addressSchema.required(),
});

const getShopValidation = Joi.number().positive().min(1).required();

export { createShopValidation, getShopValidation };
