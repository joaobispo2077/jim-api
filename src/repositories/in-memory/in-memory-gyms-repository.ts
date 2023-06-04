import { Gym } from '@prisma/client'
import { GymsRepository } from '../gyms-repository'

export class InMemoryGymsRepository implements GymsRepository {
  public readonly gyms: Gym[] = []

  async findById(id: string): Promise<Gym | null> {
    return this.gyms.find((gym) => gym.id === id) || null
  }
}
