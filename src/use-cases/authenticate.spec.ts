import { describe, expect, it } from 'vitest'
import { InMemoryUsersRepository } from '@src/repositories/in-memory/in-memory-users-repository'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'
import { AuthenticateUseCase } from './authenticate'
import { hash } from 'bcryptjs'
import { configs } from '@src/configs'

describe('Authenticate User Use Case', () => {
  it('should be able to authenticate', async () => {
    const usersRepository = new InMemoryUsersRepository()
    const authenticateUseCase = new AuthenticateUseCase(usersRepository)

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
})
