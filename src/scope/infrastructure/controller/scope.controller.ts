import { Body, Controller, Delete, Post, Put, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiUseTags } from '@nestjs/swagger';

import { RenameScopeDto, ScopeDto } from '../dto/ScopeDto';
import { ScopeService } from '../services/scope.service';

@Controller('scopes')
@ApiUseTags('Scopes')
export class ScopeController {
  constructor(private readonly scopeService: ScopeService) {}

  @ApiOperation({ title: 'Create Scope' })
  @ApiResponse({ status: 200, description: 'Create Scope.' })
  @Post()
  async createScope(@Body() scopeDto: ScopeDto): Promise<ScopeDto> {
    return this.scopeService.createScope(
      scopeDto.id,
      scopeDto.name,
      scopeDto.alias,
    );
  }

  @ApiOperation({ title: 'Rename Scope' })
  @ApiResponse({ status: 200, description: 'Rename scope' })
  @Put(':id')
  async renameScope(@Query('id') id: string, @Body() scopeDto: RenameScopeDto) {
    return this.scopeService.renameScope(id, scopeDto.name);
  }

  @ApiOperation({ title: 'Delete Scope' })
  @ApiResponse({ status: 200, description: 'Delete scope' })
  @Delete(':id')
  async removeScope(@Query('id') id: string) {
    return this.scopeService.removeScope(id);
  }
}
