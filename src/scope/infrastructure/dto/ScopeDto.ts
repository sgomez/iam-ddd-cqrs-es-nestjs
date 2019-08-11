import { ApiModelProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ScopeDto {
  @IsString()
  @ApiModelProperty()
  readonly id!: string;
  @IsString()
  @ApiModelProperty()
  readonly name!: string;
  @IsString()
  @ApiModelProperty()
  readonly alias!: string;
}

export class RenameScopeDto {
  @IsString()
  @ApiModelProperty()
  readonly name!: string;
}
