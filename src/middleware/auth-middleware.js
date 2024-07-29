import jwt from 'jsonwebtoken';
import { refreshToken } from '../secret.js';
import { prisma } from '../application/database.js';

const authMiddleware = async (req, res, next) => {
  const refresh_token = req.cookies['refresh-token'];
  if (!refresh_token) {
    return res.status(401).json({ errorMessage: `Refresh-token tidak tersedia` });
  }

  const user = await prisma.user.findFirst({
    where: {
      refresh_token,
    },
  });

  if (!user) {
    return res
      .status(403)
      .clearCookie('refresh-token')
      .json({ errorMessage: `Refresh-token tidak tersedia` });
  }

  if (!user.status) {
    return res
      .status(403)
      .clearCookie('refresh-token')
      .json({ errorMessage: `Akun anda terblokir` });
  }

  jwt.verify(refresh_token, refreshToken, (err, _decoded) => {
    if (err) {
      return res
        .status(403)
        .clearCookie('refresh-token')
        .json({ errorMessage: `Refresh-token tidak valid` });
    }

    req.user = {
      id: user.id,
      full_name: user.full_name,
      email: user.email,
    };

    next();
  });
};

export { authMiddleware };
