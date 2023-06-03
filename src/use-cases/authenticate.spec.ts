import { describe, expect, it, beforeEach } from 'vitest'
import { InMemoryUsersRepository } from '@src/repositories/in-memory/in-memory-users-repository'
import { AuthenticateUseCase } from './authenticate'
import { hash } from 'bcryptjs'
import { configs } from '@src/configs'
import { InvalidCredentialsError } from './errors/invalid-credentials-error'

let usersRepository: InMemoryUsersRepository
let authenticateUseCase: AuthenticateUseCase

describe('Authenticate User Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    authenticateUseCase = new AuthenticateUseCase(usersRepository)
  })

  it('should be able to authenticate', async () => {
    const email = 'john.doe@gmail.com'
    const password = '123456'

    await usersRepository.create({
      name: 'John Doe',
      email,
      password_hash: await hash(password, configs.SALT_ROUND),
    })

    const { user } = await authenticateUseCase.execute({
      email,
      password,
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should not be able to authenticate with wrong email', async () => {
    const email = 'john.doe@gmail.com'
    const password = '123456'

    await usersRepository.create({
      name: 'John Doe',
      email,
      password_hash: await hash(password, configs.SALT_ROUND),
    })

    await expect(
      authenticateUseCase.execute({
        email: 'wrong-email',
        password,
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it('should not be able to authenticate with wrong password', async () => {
    const email = 'john.doe@gmail.com'
    const password = '123456'

    await usersRepository.create({
      name: 'John Doe',
      email,
      password_hash: await hash(password, configs.SALT_ROUND),
    })

    await expect(
      authenticateUseCase.execute({
        email,
        password: 'abcdefgh',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
})
