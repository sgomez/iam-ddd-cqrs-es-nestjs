import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ScopeDto {
  @IsString()
  @ApiProperty()
  readonly id!: string;
  @IsString()
  @ApiProperty()
  readonly name!: string;
  @IsString()
  @ApiProperty()
  readonly alias!: string;
}
