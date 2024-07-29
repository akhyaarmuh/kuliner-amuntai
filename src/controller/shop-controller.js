import shopService from '../service/shop-service.js';

const create = async (req, res, next) => {
  try {
    const result = await shopService.create(req.user, req.body);

    res.status(201).json({ data: result });
  } catch (error) {
    next(error);
  }
};

const get = async (req, res, next) => {
  const id = req.params.id;

  try {
    const result = await shopService.get(req.user, id);

    res.json({ data: result });
  } catch (error) {
    next(error);
  }
};

export default { create, get };
