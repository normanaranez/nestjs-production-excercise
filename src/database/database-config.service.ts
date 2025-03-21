import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { resolve } from 'path';

@Injectable()
export class DatabaseConfigService implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    const dbConfig: TypeOrmModuleOptions = {
      synchronize: false,
    };

    switch (this.configService.get<string>('NODE_ENV')) {
      case 'development':
        Object.assign(dbConfig, {
          type: 'sqlite',
          database: 'db.sqlite',
          entities: [resolve(__dirname + '/**/*.entity{.ts,.js}')],
        });
        break;
      case 'test':
        Object.assign(dbConfig, {
          type: 'sqlite',
          database: 'test.sqlite',
          entities: [resolve(__dirname, '../**/*.entity{.ts,.js}')],
          synchronize: true,
        });
        break;
      case 'production':
      default:
        throw new Error('Unknown environment');
    }

    return dbConfig;
  }
}

export default DatabaseConfigService;
