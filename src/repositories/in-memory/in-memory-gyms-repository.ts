import { Gym, Prisma } from '@prisma/client'
import { GymsRepository } from '../gyms-repository'
import { randomUUID } from 'node:crypto'
import { Decimal } from '@prisma/client/runtime/library'
import {
  Coordinate,
  getDistanceBetweenCoordinates,
} from '@src/utils/get-distance-between-coordinates'
import { configs } from '@src/configs'

export class InMemoryGymsRepository implements GymsRepository {
  public readonly gyms: Gym[] = []

  async searchMany(query: string, page: number): Promise<Gym[]> {
    return this.gyms
      .filter((gym) => gym.title.includes(query))
      .slice(
        (page - configs.DEFAULT_PAGE) * configs.DEFAULT_PER_PAGE,
        page * configs.DEFAULT_PER_PAGE,
      )
  }

  async findManyNearby(coordinates: Coordinate): Promise<Gym[]> {
    return this.gyms.filter((gym) => {
      const gymLatitude = parseFloat(gym.latitude.toString())
      const gymLongitude = parseFloat(gym.longitude.toString())

      const distance = getDistanceBetweenCoordinates(
        { latitude: gymLatitude, longitude: gymLongitude },
        coordinates,
      )

      return distance <= configs.DEFAULT_MAX_NEARBY_DISTANCE
    })
  }

  async findById(id: string): Promise<Gym | null> {
    return this.gyms.find((gym) => gym.id === id) || null
  }

  async create(data: Prisma.GymCreateInput): Promise<Gym> {
    const gym: Gym = {
      id: randomUUID(),
      created_at: new Date(),
      description: data.description ?? null,
      latitude: new Decimal(data.latitude.toString()),
      longitude: new Decimal(data.longitude.toString()),
      title: data.title,
      phone: data.phone ?? null,
      updated_at: new Date(),
    }

    this.gyms.push(gym)
    return gym
  }
}
