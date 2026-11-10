import { Controller, Get } from '@nestjs/common';

@Controller('health')
export class HealthController {
  @Get()
  health(): { status: string; service: string } {
    return { status: 'ok', service: 'CS-301L Lab 09 API' };
  }
}
