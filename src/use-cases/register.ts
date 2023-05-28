import { hash } from 'bcryptjs'
import { configs } from '@src/configs'
import { UsersRepository } from '@src/repositories/users-repository'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'

export type RegisterUseCaseRequest = {
  name: string
  email: string
  password: string
}

export class RegisterUseCase {
  constructor(private readonly usersRepository: UsersRepository) {}

  async execute({ name, email, password }: RegisterUseCaseRequest) {
    const passwordHash = await hash(password, configs.SALT_ROUND)

    const isUserAlreadyExists = await this.usersRepository.findByEmail(email)

    if (isUserAlreadyExists) {
      throw new UserAlreadyExistsError()
    }

    await this.usersRepository.create({
      email,
      name,
      password_hash: passwordHash,
    })
  }
}
