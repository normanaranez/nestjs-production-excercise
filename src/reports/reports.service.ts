import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateReportDto } from './dtos/create-report.dto';
import { Report } from './reports.entity';
import { User } from '../users/users.entity';
import { GetEstimateDto } from './dtos/get-estimate.dto';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Report) private repository: Repository<Report>,
  ) {}

  create(reportDto: CreateReportDto, user: User) {
    const report = this.repository.create(reportDto);
    report.user = user;
    return this.repository.save(report);
  }

  async changeApproval(id: string, approved: boolean) {
    const report = await this.repository.findOne({
      where: { id: parseInt(id) },
    });

    if (!report) {
      throw new NotFoundException('Report not found');
    }

    report.approved = approved;

    return this.repository.save(report);
  }

  createEstimate(estimatedDto: GetEstimateDto) {
    return this.repository
      .createQueryBuilder()
      .select('*')
      .where('make = :make', { make: estimatedDto.make })
      .andWhere('model = :model', { model: estimatedDto.model })
      .andWhere('lat - :lat BETWEEN -5 AND 5', { lat: estimatedDto.lat })
      .andWhere('lng - :lng BETWEEN -5 AND 5', { lng: estimatedDto.lng })
      .andWhere('year - :year BETWEEN -3 AND 3', { year: estimatedDto.year })
      .andWhere('ABS(mileage - :mileage) < 50000', {
        mileage: estimatedDto.mileage,
      })
      .limit(3)
      .getRawOne();
  }
}
