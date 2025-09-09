import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import { PrismaService } from '../src/prisma/prisma.service'
import { AppModule } from '../src/app.module'

export let app: INestApplication
export let prismaService: PrismaService

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
  await prismaService.auditLog.deleteMany()
  await prismaService.caProfile.deleteMany()
  await prismaService.transaction.deleteMany()
  await prismaService.document.deleteMany()
  await prismaService.consent.deleteMany()
  await prismaService.user.deleteMany()
})
