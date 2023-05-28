import { hash } from 'bcryptjs'
import { configs } from '@src/configs'
import { prisma } from '@src/lib/prisma'

export type RegisterUseCaseRequest = {
  name: string
  email: string
  password: string
}

export class RegisterUseCase {
  constructor(private readonly usersRepository: any) {}

  async execute({ name, email, password }: RegisterUseCaseRequest) {
    const passwordHash = await hash(password, configs.SALT_ROUND)

    const isUserAlreadyExists = await prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (isUserAlreadyExists) {
      throw new Error('Email already exists')
    }

    await this.usersRepository.create({
      email,
      name,
      password_hash: passwordHash,
    })
  }
}
