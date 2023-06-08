import { configs } from '@src/configs'

export const getPaginationOffsetFromPage = (page: number): number => {
  return (page - 1) * configs.DEFAULT_PER_PAGE
}
