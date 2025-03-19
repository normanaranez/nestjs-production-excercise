import { Transform } from 'class-transformer';
import {
  IsLatitude,
  IsLongitude,
  IsNumber,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class GetEstimateDto {
  @IsString()
  make: string;

  @IsString()
  model: string;

  @Transform(({ value }: { value: string }) => parseInt(value))
  @IsNumber()
  @Min(1930)
  @Max(2050)
  year: number;

  @Transform(({ value }: { value: string }) => parseFloat(value))
  @IsLongitude()
  lng: number;

  @Transform(({ value }: { value: string }) => parseFloat(value))
  @IsLatitude()
  lat: number;

  @Transform(({ value }: { value: string }) => parseInt(value))
  @IsNumber()
  @Min(1)
  @Max(1000000)
  mileage: number;
}
