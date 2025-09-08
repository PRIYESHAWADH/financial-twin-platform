import { Test, TestingModule } from '@nestjs/testing'
import { JwtService } from '@nestjs/jwt'
import { AuthService } from './auth.service'
import { UserService } from '../user/user.service'
import { PrismaService } from '../../common/services/prisma.service'

describe('AuthService', () => {
  let service: AuthService
  let userService: UserService
  let jwtService: JwtService
  let prismaService: PrismaService

      const mockUser = {
        id: '1',
        email: 'test@example.com',
        password: 'hashedPassword',
        firstName: 'Test',
        lastName: 'User',
        phone: '+919876543210',
        pan: 'ABCDE1234F',
        role: 'USER' as any,
        isVerified: false,
        address: '123 Main St',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001',
        lastLoginAt: new Date(),
        dateOfBirth: new Date('1990-01-01'),
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

  const mockJwtToken = 'mock-jwt-token'

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: {
            findByEmail: jest.fn(),
            create: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
        {
          provide: PrismaService,
          useValue: {
            user: {
              create: jest.fn(),
              findUnique: jest.fn(),
            },
          },
        },
      ],
    }).compile()

    service = module.get<AuthService>(AuthService)
    userService = module.get<UserService>(UserService)
    jwtService = module.get<JwtService>(JwtService)
    prismaService = module.get<PrismaService>(PrismaService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('register', () => {
    it('should register a new user successfully', async () => {
      const registerDto = {
        email: 'test@example.com',
        password: 'password123',
        firstName: 'Test',
        lastName: 'User',
        phone: '+919876543210',
        pan: 'ABCDE1234F',
      }

      jest.spyOn(userService, 'findByEmail').mockResolvedValue(null)
      jest.spyOn(userService, 'create').mockResolvedValue(mockUser)
      jest.spyOn(jwtService, 'sign').mockReturnValue(mockJwtToken)

      const result = await service.register(registerDto, '127.0.0.1', 'test-agent')

      expect(result).toEqual({
        user: mockUser,
        token: mockJwtToken,
      })
      expect(userService.findByEmail).toHaveBeenCalledWith(registerDto.email)
      expect(userService.create).toHaveBeenCalledWith(registerDto)
    })

    it('should throw error if user already exists', async () => {
      const registerDto = {
        email: 'test@example.com',
        password: 'password123',
        firstName: 'Test',
        lastName: 'User',
        phone: '+919876543210',
        pan: 'ABCDE1234F',
      }

      jest.spyOn(userService, 'findByEmail').mockResolvedValue(mockUser)

      await expect(service.register(registerDto, '127.0.0.1', 'test-agent')).rejects.toThrow('User already exists')
    })
  })

  describe('login', () => {
    it('should login user successfully with valid credentials', async () => {
      const loginDto = {
        email: 'test@example.com',
        password: 'password123',
      }

      jest.spyOn(userService, 'findByEmail').mockResolvedValue(mockUser)
      jest.spyOn(service, 'validateUser').mockResolvedValue(mockUser)
      jest.spyOn(jwtService, 'sign').mockReturnValue(mockJwtToken)

      const result = await service.login(loginDto, '127.0.0.1', 'test-agent')

      expect(result).toEqual({
        user: mockUser,
        token: mockJwtToken,
      })
    })

    it('should throw error for invalid credentials', async () => {
      const loginDto = {
        email: 'test@example.com',
        password: 'wrongpassword',
      }

      jest.spyOn(userService, 'findByEmail').mockResolvedValue(mockUser)
      jest.spyOn(service, 'validateUser').mockResolvedValue(null)

      await expect(service.login(loginDto, '127.0.0.1', 'test-agent')).rejects.toThrow('Invalid credentials')
    })
  })

  describe('validateUser', () => {
    it('should return user if password is valid', async () => {
      const email = 'test@example.com'
      const password = 'password123'

      jest.spyOn(userService, 'findByEmail').mockResolvedValue(mockUser)
      // Mock bcrypt comparison
      jest.spyOn(require('bcrypt'), 'compare').mockResolvedValue(true)

      const result = await service.validateUser(email, password)

      expect(result).toEqual(mockUser)
    })

    it('should return null if password is invalid', async () => {
      const email = 'test@example.com'
      const password = 'wrongpassword'

      jest.spyOn(userService, 'findByEmail').mockResolvedValue(mockUser)
      jest.spyOn(require('bcrypt'), 'compare').mockResolvedValue(false)

      const result = await service.validateUser(email, password)

      expect(result).toBeNull()
    })

    it('should return null if user not found', async () => {
      const email = 'nonexistent@example.com'
      const password = 'password123'

      jest.spyOn(userService, 'findByEmail').mockResolvedValue(null)

      const result = await service.validateUser(email, password)

      expect(result).toBeNull()
    })
  })

  describe('generateJwtToken', () => {
    it('should generate JWT token for user', () => {
      jest.spyOn(jwtService, 'sign').mockReturnValue(mockJwtToken)

      const result = (service as any).generateTokens(mockUser)

      expect(result).toBe(mockJwtToken)
      expect(jwtService.sign).toHaveBeenCalledWith(
        { sub: mockUser.id, email: mockUser.email },
        { expiresIn: '7d' }
      )
    })
  })
})
