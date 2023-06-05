import { hash } from 'bcryptjs'
import { configs } from '@src/configs'
import { UsersRepository } from '@src/repositories/users-repository'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'
import type { User } from '@prisma/client'

export type RegisterUseCaseRequest = {
  name: string
  email: string
  password: string
}

export type RegisterUseCaseResponse = {
  user: User
}
export class RegisterUseCase {
  constructor(private readonly usersRepository: UsersRepository) {}

  async execute({
    name,
    email,
    password,
  }: RegisterUseCaseRequest): Promise<RegisterUseCaseResponse> {
    const passwordHash = await hash(password, configs.SALT_ROUND)

    const isUserAlreadyExists = await this.usersRepository.findByEmail(email)

    if (isUserAlreadyExists) {
      throw new UserAlreadyExistsError()
    }

    const user = await this.usersRepository.create({
      email,
      name,
      password_hash: passwordHash,
    })

    return { user }
  }
}
