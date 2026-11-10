import { BadRequestException } from '@nestjs/common';
import { SortOrderPipe } from './sort-order.pipe';

describe('SortOrderPipe', () => {
  const pipe = new SortOrderPipe();
  it('defaults to asc when missing', () => expect(pipe.transform(undefined)).toBe('asc'));
  it('normalizes DESC to desc', () => expect(pipe.transform('DESC')).toBe('desc'));
  it('rejects unsupported values', () => {
    expect(() => pipe.transform('random')).toThrow(BadRequestException);
  });
});
