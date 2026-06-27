import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class RegionsService {
  constructor(private readonly prisma: PrismaService) {}

  async getRegions() {
    const rows = await this.prisma.region.findMany({
      orderBy: { sortOrder: 'asc' },
    });

    const regions = rows.filter((r) => !r.parentId);
    const countries = rows.filter((r) => r.parentId);

    return {
      regions: regions.map((r) => ({
        id: r.code,
        label: r.nameEn,
        nameCn: r.nameCn,
        countries: countries
          .filter((c) => c.parentId === r.id)
          .map((c) => ({
            id: c.code,
            name: c.nameCn,
            en: c.nameEn,
            isHot: c.isHot,
          })),
      })),
      favorites: rows
        .filter((r) => r.isFavorite)
        .map((r) => ({
          id: r.code,
          label: r.nameCn,
          sub: r.nameEn,
          isHot: r.isHot,
        })),
    };
  }
}
