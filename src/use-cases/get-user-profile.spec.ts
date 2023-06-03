import { describe, expect, it, beforeEach } from 'vitest'
import { InMemoryUsersRepository } from '@src/repositories/in-memory/in-memory-users-repository'
import { hash } from 'bcryptjs'
import { configs } from '@src/configs'
import { GetUserProfileUseCase } from './get-user-profile'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

let usersRepository: InMemoryUsersRepository
let getUserProfileUseCase: GetUserProfileUseCase

describe('Authenticate User Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    getUserProfileUseCase = new GetUserProfileUseCase(usersRepository)
  })

  it('should be able to get user profile', async () => {
    const email = 'john.doe@gmail.com'
    const password = '123456'

    const { id } = await usersRepository.create({
      name: 'John Doe',
      email,
      password_hash: await hash(password, configs.SALT_ROUND),
    })

    const { user } = await getUserProfileUseCase.execute({
      userId: id,
    })

    expect(user.id).toEqual(expect.any(String))
    expect(user.email).toEqual(email)
  })

  it('should not be able to get non exist user', async () => {
    await expect(
      getUserProfileUseCase.execute({
        userId: 'not-exists-id',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
