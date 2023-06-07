import { Gym, Prisma } from '@prisma/client'
import { Coordinate } from '@src/utils/get-distance-between-coordinates'

export type FindManyGymsNearbyParams = Coordinate

export interface GymsRepository {
  findManyNearby(coordinates: FindManyGymsNearbyParams): Promise<Gym[]>
  searchMany(query: string, page: number): Promise<Gym[]>
  findById(id: string): Promise<Gym | null>
  create(gym: Prisma.GymCreateInput): Promise<Gym>
}
