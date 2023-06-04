import { Gym, Prisma } from '@prisma/client'
import { GymsRepository } from '../gyms-repository'
import { randomUUID } from 'node:crypto'
import { Decimal } from '@prisma/client/runtime/library'

export class InMemoryGymsRepository implements GymsRepository {
  public readonly gyms: Gym[] = []

  async findById(id: string): Promise<Gym | null> {
    return this.gyms.find((gym) => gym.id === id) || null
  }

  async create(data: Prisma.GymCreateInput): Promise<Gym> {
    const gym: Gym = {
      id: randomUUID(),
      created_at: new Date(),
      description: data.description ?? null,
      latitude: new Decimal(0),
      longitude: new Decimal(0),
      name: data.name,
      phone: data.phone ?? null,
      updated_at: new Date(),
    }

    this.gyms.push(gym)
    return gym
  }
}
