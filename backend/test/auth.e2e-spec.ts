import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { AppModule } from '../src/app.module'
import { PrismaService } from '../src/prisma/prisma.service'

describe('Auth (e2e)', () => {
  let app: INestApplication
  let prismaService: PrismaService

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleFixture.createNestApplication()
    prismaService = app.get<PrismaService>(PrismaService)
    
    await app.init()
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(async () => {
    // Clean database before each test
    await prismaService.user.deleteMany()
  })

  describe('/auth/register (POST)', () => {
    it('should register a new user', () => {
      const registerDto = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
        phone: '+919876543210',
      }

      return request(app.getHttpServer())
        .post('/auth/register')
        .send(registerDto)
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('user')
          expect(res.body).toHaveProperty('token')
          expect(res.body.user.email).toBe(registerDto.email)
          expect(res.body.user.name).toBe(registerDto.name)
        })
    })

    it('should return 400 for invalid email', () => {
      const registerDto = {
        email: 'invalid-email',
        password: 'password123',
        name: 'Test User',
        phone: '+919876543210',
      }

      return request(app.getHttpServer())
        .post('/auth/register')
        .send(registerDto)
        .expect(400)
    })

    it('should return 400 for weak password', () => {
      const registerDto = {
        email: 'test@example.com',
        password: '123',
        name: 'Test User',
        phone: '+919876543210',
      }

      return request(app.getHttpServer())
        .post('/auth/register')
        .send(registerDto)
        .expect(400)
    })

    it('should return 409 for existing user', async () => {
      const registerDto = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
        phone: '+919876543210',
      }

      // First registration
      await request(app.getHttpServer())
        .post('/auth/register')
        .send(registerDto)
        .expect(201)

      // Second registration with same email
      return request(app.getHttpServer())
        .post('/auth/register')
        .send(registerDto)
        .expect(409)
    })
  })

  describe('/auth/login (POST)', () => {
    beforeEach(async () => {
      // Create a test user
      const registerDto = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
        phone: '+919876543210',
      }

      await request(app.getHttpServer())
        .post('/auth/register')
        .send(registerDto)
        .expect(201)
    })

    it('should login with valid credentials', () => {
      const loginDto = {
        email: 'test@example.com',
        password: 'password123',
      }

      return request(app.getHttpServer())
        .post('/auth/login')
        .send(loginDto)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('user')
          expect(res.body).toHaveProperty('token')
          expect(res.body.user.email).toBe(loginDto.email)
        })
    })

    it('should return 401 for invalid credentials', () => {
      const loginDto = {
        email: 'test@example.com',
        password: 'wrongpassword',
      }

      return request(app.getHttpServer())
        .post('/auth/login')
        .send(loginDto)
        .expect(401)
    })

    it('should return 401 for non-existent user', () => {
      const loginDto = {
        email: 'nonexistent@example.com',
        password: 'password123',
      }

      return request(app.getHttpServer())
        .post('/auth/login')
        .send(loginDto)
        .expect(401)
    })
  })

  describe('/auth/verify-otp (POST)', () => {
    it('should verify OTP successfully', () => {
      const verifyOtpDto = {
        email: 'test@example.com',
        otp: '123456',
      }

      return request(app.getHttpServer())
        .post('/auth/verify-otp')
        .send(verifyOtpDto)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('message', 'OTP verified successfully')
        })
    })

    it('should return 400 for invalid OTP', () => {
      const verifyOtpDto = {
        email: 'test@example.com',
        otp: '000000',
      }

      return request(app.getHttpServer())
        .post('/auth/verify-otp')
        .send(verifyOtpDto)
        .expect(400)
    })
  })
})
