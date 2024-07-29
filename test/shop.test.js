import supertest from 'supertest';
import { web } from '../src/application/web';
import { logger } from '../src/application/logger';
import {
  createRefreshTokenTest,
  createShopTest,
  createUserTest,
  removeUserTest,
} from './test.util';

describe('POST /api/shops', () => {
  beforeEach(async () => {
    await createUserTest();
  });

  afterEach(async () => {
    await removeUserTest();
  });

  it('should success create a new shop', async () => {
    const refreshToken = await createRefreshTokenTest();

    const result = await supertest(web)
      .post('/api/shops')
      .set('Cookie', `refresh-token=${refreshToken}`)
      .send({
        shop: { name: 'test', no_hp: '085161713161' },
        address: {
          country: 'test',
          province: 'test',
          city: 'test',
          street: 'test',
          postal_code: '76112',
        },
      });

    expect(result.status).toBe(201);
    expect(result.body.data.id).toBeDefined();
    expect(result.body.data.name).toBe('test');
    expect(result.body.data.no_hp).toBe('085161713161');
    expect(result.body.data.address.country).toBe('test');
    expect(result.body.data.address.province).toBe('test');
    expect(result.body.data.address.city).toBe('test');
    expect(result.body.data.address.street).toBe('test');
    expect(result.body.data.address.postal_code).toBe('76112');
  });

  it('should reject create shop if request invalid', async () => {
    const refreshToken = await createRefreshTokenTest();

    const result = await supertest(web)
      .post('/api/shops')
      .set('Cookie', `refresh-token=${refreshToken}`)
      .send({ shop: { name: '', no_hp: '' } });

    logger.error(result.body.data);

    expect(result.status).toBe(422);
    expect(result.body.errorMessage).toBeDefined();
    expect(result.body.data).toBeDefined();
  });
});

describe('GET api/shops/:id', () => {
  beforeEach(async () => {
    await createUserTest();
  });

  afterEach(async () => {
    await removeUserTest();
  });

  it('should success get shop', async () => {
    const shop = await createShopTest();
    const refreshToken = await createRefreshTokenTest();

    const result = await supertest(web)
      .get(`/api/shops/${shop.id}`)
      .set('Cookie', `refresh-token=${refreshToken}`);

    expect(result.status).toBe(200);
    expect(result.body.data.name).toBe('test');
    expect(result.body.data.no_hp).toBe('085161713161');
    expect(result.body.data.address.country).toBe('test');
    expect(result.body.data.address.province).toBe('test');
    expect(result.body.data.address.city).toBe('test');
    expect(result.body.data.address.street).toBe('test');
    expect(result.body.data.address.postal_code).toBe('76112');
  });

  it('should reject get shop if not found', async () => {
    await createShopTest();
    const refreshToken = await createRefreshTokenTest();

    const result = await supertest(web)
      .get(`/api/shops/1`)
      .set('Cookie', `refresh-token=${refreshToken}`);

    logger.error(result.body.errorMessage);

    expect(result.status).toBe(404);
    expect(result.body.errorMessage).toBeDefined();
  });
});
