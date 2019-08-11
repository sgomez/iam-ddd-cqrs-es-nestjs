import { ApiModelProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class RenameScopeDto {
  @IsString()
  @ApiModelProperty()
  readonly name!: string;
}
