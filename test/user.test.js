import supertest from 'supertest';
import bcrypt from 'bcrypt';
import { web } from '../src/application/web.js';
import { logger } from '../src/application/logger.js';
import {
  createUserTest,
  removeUserTest,
  disableUserTest,
  getUserTest,
  createRefreshTokenTest,
} from './test.util.js';

describe('POST /api/users', () => {
  afterEach(async () => {
    await removeUserTest();
  });

  it('should create new user', async () => {
    let result = await supertest(web).post('/api/users').send({
      full_name: 'Akhyaar Muhammad',
      email: 'akhyaarmuh@gmail.com',
      password: 'Aa12345',
    });

    expect(result.status).toBe(201);
    expect(result.body.data.id).toBeDefined();
    expect(result.body.data.full_name).toBe('Akhyaar Muhammad');
    expect(result.body.data.email).toBe('akhyaarmuh@gmail.com');
    expect(result.body.data.password).toBeUndefined();

    result = await getUserTest();
    expect(await bcrypt.compare('Aa12345', result.password)).toBe(true);
    expect(result.refresh_token).toBeNull();
  });

  it('should reject create user if invalid request', async () => {
    const result = await supertest(web).post('/api/users').send({
      full_name: '',
      email: '',
      password: '',
    });

    logger.error(result.body.data);

    expect(result.status).toBe(422);
    expect(result.body.errorMessage).toBeDefined();
    expect(result.body.data).toBeDefined();
  });

  it('should reject if email is registered', async () => {
    await createUserTest();

    const result = await supertest(web).post('/api/users').send({
      full_name: 'Akhyaar Muhammad',
      email: 'akhyaarmuh@gmail.com',
      password: 'Aa12345',
    });

    logger.error(result.body.errorMessage);

    expect(result.status).toBe(400);
    expect(result.body.errorMessage).toBeDefined();
  });
});

describe('POST /api/users/login', () => {
  beforeEach(async () => {
    await createUserTest();
  });

  afterEach(async () => {
    await removeUserTest();
  });

  it('should success to login', async () => {
    const result = await supertest(web).post('/api/users/login').send({
      email: 'akhyaarmuh@gmail.com',
      password: 'Aa12345',
    });

    expect(result.status).toBe(200);
    expect(result.get('Set-Cookie').toString()).toContain('refresh-token=');
    expect(result.body.accessToken).toBeDefined();
  });

  it('should reject login if request invalid', async () => {
    const result = await supertest(web).post('/api/users/login').send({
      email: '',
      password: '',
    });

    logger.error(result.body.data);

    expect(result.status).toBe(422);
    expect(result.body.errorMessage).toBeDefined();
    expect(result.body.data).toBeDefined();
  });

  it('should reject login if password wrong', async () => {
    const result = await supertest(web).post('/api/users/login').send({
      email: 'akhyaarmuh@gmail.com',
      password: 'Salah77',
    });

    logger.error(result.body.errorMessage);

    expect(result.status).toBe(401);
    expect(result.body.errorMessage).toBeDefined();
  });

  it('should reject login if email not registered', async () => {
    const result = await supertest(web).post('/api/users/login').send({
      email: 'salahemail@gmail.com',
      password: 'Salah77',
    });

    logger.error(result.body.errorMessage);

    expect(result.status).toBe(401);
    expect(result.body.errorMessage).toBeDefined();
  });
});

describe('GET /api/users/current', () => {
  beforeEach(async () => {
    await createUserTest();
  });

  afterEach(async () => {
    await removeUserTest();
  });

  it('should success to get current user', async () => {
    const refreshToken = await createRefreshTokenTest();

    const result = await supertest(web)
      .get('/api/users/current')
      .set('Cookie', `refresh-token=${refreshToken}`);

    expect(result.status).toBe(200);
    expect(result.body.data.id).toBeDefined();
    expect(result.body.data.email).toBe('akhyaarmuh@gmail.com');
    expect(result.body.data.full_name).toBe('Akhyaar Muhammad');
  });

  // auth test
  it('should reject if not send refresh-token cookie', async () => {
    const result = await supertest(web).get('/api/users/current');

    logger.error(result.body.errorMessage);

    expect(result.status).toBe(401);
    expect(result.body.errorMessage).toBeDefined();
  });

  it('should reject if refresh-token not found', async () => {
    const result = await supertest(web)
      .get('/api/users/current')
      .set('Cookie', `refresh-token=tokenpalsu`);

    logger.error(result.body.errorMessage);

    expect(result.status).toBe(403);
    expect(result.get('Set-Cookie').toString()).toContain('refresh-token=');
    expect(result.body.errorMessage).toBeDefined();
  });

  it('should reject if status user disabled', async () => {
    const refreshToken = await createRefreshTokenTest();

    await disableUserTest();

    const result = await supertest(web)
      .get('/api/users/current')
      .set('Cookie', `refresh-token=${refreshToken}`);

    logger.error(result.body.errorMessage);

    expect(result.status).toBe(403);
    expect(result.get('Set-Cookie').toString()).toContain('refresh-token=');
    expect(result.body.errorMessage).toBeDefined();
  });
});

describe('PATCH /api/users/current', () => {
  beforeEach(async () => {
    await createUserTest();
  });

  afterEach(async () => {
    await removeUserTest();
  });

  it('should success to update current user', async () => {
    const refreshToken = await createRefreshTokenTest();

    let result = await supertest(web)
      .patch('/api/users/current')
      .set('Cookie', `refresh-token=${refreshToken}`)
      .send({
        full_name: 'Nuur Azizah',
        password: 'Updated77',
      });

    expect(result.status).toBe(200);
    expect(result.body.data.id).toBeDefined();
    expect(result.body.data.email).toBe('akhyaarmuh@gmail.com');
    expect(result.body.data.full_name).toBe('Nuur Azizah');

    result = await getUserTest();
    expect(await bcrypt.compare('Updated77', result.password)).toBe(true);
  });

  it('should success to update current user without request password', async () => {
    const refreshToken = await createRefreshTokenTest();

    let result = await supertest(web)
      .patch('/api/users/current')
      .set('Cookie', `refresh-token=${refreshToken}`)
      .send({
        full_name: 'Nuur Azizah',
      });

    expect(result.status).toBe(200);
    expect(result.body.data.id).toBeDefined();
    expect(result.body.data.email).toBe('akhyaarmuh@gmail.com');
    expect(result.body.data.full_name).toBe('Nuur Azizah');

    result = await getUserTest();
    expect(await bcrypt.compare('Aa12345', result.password)).toBe(true);
  });

  it('should success to update current user without request full name', async () => {
    const refreshToken = await createRefreshTokenTest();

    let result = await supertest(web)
      .patch('/api/users/current')
      .set('Cookie', `refresh-token=${refreshToken}`)
      .send({
        password: 'Update99',
      });

    expect(result.status).toBe(200);
    expect(result.body.data.id).toBeDefined();
    expect(result.body.data.email).toBe('akhyaarmuh@gmail.com');
    expect(result.body.data.full_name).toBe('Akhyaar Muhammad');

    result = await getUserTest();
    expect(await bcrypt.compare('Update99', result.password)).toBe(true);
  });

  it('should reject to update current user with invalid request', async () => {
    const refreshToken = await createRefreshTokenTest();

    const result = await supertest(web)
      .patch('/api/users/current')
      .set('Cookie', `refresh-token=${refreshToken}`)
      .send({
        full_name: 'Nuur Azizah',
        password: '',
      });

    logger.error(result.body.data);

    expect(result.status).toBe(422);
    expect(result.body.errorMessage).toBeDefined();
  });
});
