import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

export type SortOrder = 'asc' | 'desc';

@Injectable()
export class SortOrderPipe implements PipeTransform<string | undefined, SortOrder> {
  transform(value?: string): SortOrder {
    if (value === undefined || value.trim() === '') return 'asc';

    const normalized = value.toLowerCase();
    if (normalized === 'asc' || normalized === 'desc') return normalized;

    throw new BadRequestException('order must be asc or desc');
  }
}
