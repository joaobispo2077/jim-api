import { Gym, Prisma } from '@prisma/client'

import { GymsRepository } from '../gyms-repository'
import { Coordinate } from '@src/utils/get-distance-between-coordinates'
import { prisma } from '@src/lib/prisma'
import { configs } from '@src/configs'
import { getPaginationOffsetFromPage } from '@src/utils/get-pagination-offset-from-page'

export class PrismaGymsRepository implements GymsRepository {
  async findManyNearby({ latitude, longitude }: Coordinate): Promise<Gym[]> {
    const nearbyGyms = await prisma.$queryRaw<Gym[]>`
    SELECT * from gyms WHERE (6371 * acos( cos( radians(${latitude})) * cos(radians(latitude)) * cos(radians(longitude) - radians(${longitude})) + sin(radians(${latitude})) * sin(radians(latitude)))) <= ${configs.DEFAULT_MAX_NEARBY_DISTANCE_IN_KM}`

    return nearbyGyms
  }

  async searchMany(query: string, page: number): Promise<Gym[]> {
    return await prisma.gym.findMany({
      where: {
        title: {
          contains: query,
        },
      },
      take: configs.DEFAULT_PER_PAGE,
      skip: getPaginationOffsetFromPage(page),
    })
  }

  async findById(id: string): Promise<Gym | null> {
    return await prisma.gym.findUnique({
      where: {
        id,
      },
    })
  }

  async create(gym: Prisma.GymCreateInput): Promise<Gym> {
    return await prisma.gym.create({ data: gym })
  }
}
