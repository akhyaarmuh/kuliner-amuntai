import Joi from 'joi';

const registerUserValidation = Joi.object().keys({
  full_name: Joi.string()
    .required()
    .trim()
    .min(2)
    .max(75)
    .pattern(/^[a-zA-Z\s.]*$/)
    .messages({
      'any.required': 'Nama lengkap harus dikirim',
      'string.empty': 'Nama lengkap tidak boleh kosong',
      'string.min': 'Nama lengkap harus memiliki setidaknya 2 karakter',
      'string.max': 'Nama lengkap tidak boleh lebih dari 75 karakter',
      'string.pattern.base': 'Nama lengkap hanya boleh terdiri dari huruf (2 - 75)',
    }),

  email: Joi.string().required().trim().email().lowercase().min(6).max(128).messages({
    'any.required': 'Email harus dikirim',
    'string.empty': 'Email tidak boleh kosong',
    'string.min': 'Email harus memiliki setidaknya 6 karakter',
    'string.max': 'Email tidak boleh lebih dari 128 karakter',
    'string.email': 'Masukan email yang benar',
  }),

  password: Joi.string()
    .required()
    .trim()
    .min(7)
    .max(20)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&_]*$/)
    .messages({
      'any.required': 'Katasandi harus dikirim',
      'string.empty': 'Katasandi tidak boleh kosong',
      'string.min': 'Katasandi harus memiliki setidaknya 7 karakter',
      'string.max': 'Katasandi tidak boleh lebih dari 20 karakter',
      'string.pattern.base':
        'Katasandi harus memiliki setidaknya huruf besar, huruf kecil dan angka (7 - 20)',
    }),
});

const loginUserValidation = Joi.object().keys({
  email: Joi.string().empty().required().trim().email().lowercase().messages({
    'any.required': 'Email harus dikirim',
    'string.empty': 'Email tidak boleh kosong',
    'string.email': 'Masukan email yang benar',
  }),

  password: Joi.string().empty().required().trim().messages({
    'any.required': 'Katasandi harus dikirim',
    'string.empty': 'Katasandi tidak boleh kosong',
  }),
});

const getUserValidation = Joi.number().positive().min(1).required();

const updateUserValidation = Joi.object().keys({
  full_name: Joi.string()
    .optional()
    .trim()
    .min(2)
    .max(75)
    .pattern(/^[a-zA-Z\s.]*$/)
    .messages({
      'any.required': 'Nama lengkap harus dikirim',
      'string.empty': 'Nama lengkap tidak boleh kosong',
      'string.min': 'Nama lengkap harus memiliki setidaknya 2 karakter',
      'string.max': 'Nama lengkap tidak boleh lebih dari 75 karakter',
      'string.pattern.base': 'Nama lengkap hanya boleh terdiri dari huruf (2 - 75)',
    }),

  password: Joi.string()
    .optional()
    .trim()
    .min(7)
    .max(20)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&_]*$/)
    .messages({
      'string.empty': 'Katasandi tidak boleh kosong',
      'string.min': 'Katasandi harus memiliki setidaknya 7 karakter',
      'string.max': 'Katasandi tidak boleh lebih dari 20 karakter',
      'string.pattern.base':
        'Katasandi harus memiliki setidaknya huruf besar, huruf kecil dan angka (7 - 20)',
    }),
});

export {
  registerUserValidation,
  loginUserValidation,
  getUserValidation,
  updateUserValidation,
};
