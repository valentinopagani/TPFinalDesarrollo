import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Users (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    // use small bcrypt cost for tests
    process.env.BCRYPT_COST = '4';

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('POST /users/register should create first user as admin', async () => {
    const email = `e2e+${Date.now()}@example.com`;
    const res = await request(app.getHttpServer())
      .post('/users/register')
      .send({ email, password: 'password123' })
      .expect(201);

    expect(res.body).toHaveProperty('id');
    expect(res.body.email).toBe(email);
    expect(res.body.role).toBe('admin');
  });
});
