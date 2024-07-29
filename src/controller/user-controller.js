import userService from '../service/user-service.js';

const register = async (req, res, next) => {
  try {
    const result = await userService.register(req.body);

    res.status(201).json({ data: result });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const result = await userService.login(req.body);

    res
      .cookie('refresh-token', result.refresh_token, {
        httpOnly: true,
        maxAge: 15 * 24 * 60 * 60 * 1000,
      })
      .status(200)
      .json({ accessToken: result.access_token });
  } catch (error) {
    next(error);
  }
};

const get = async (req, res, next) => {
  try {
    const result = await userService.get(req.user);

    res.json({ data: result });
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const result = await userService.update(req.user, req.body);

    res.status(200).json({ data: result });
  } catch (error) {
    next(error);
  }
};

export default { register, login, get, update };
