import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  ForbiddenException,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthGuard } from '../common/guards/auth.guard';
import { PositiveIntPipe } from '../common/pipes/positive-int.pipe';
import { SortOrder, SortOrderPipe } from '../common/pipes/sort-order.pipe';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { Note } from './note.model';
import { NotesService } from './notes.service';

type RequestUser = Request & { user: { sub: number; role: string } };

@Controller('notes')
@UseGuards(AuthGuard)
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Post()
  create(@Req() req: RequestUser, @Body() dto: CreateNoteDto): Note {
    return this.notesService.create(dto, req.user.sub);
  }

  @Get()
  findMine(
    @Req() req: RequestUser,
    @Query('order', SortOrderPipe) order: SortOrder,
  ): Note[] {
    return this.notesService.findByOwner(req.user.sub, order);
  }

  @Patch(':id')
  update(
    @Param('id', PositiveIntPipe) id: number,
    @Req() req: RequestUser,
    @Body() dto: UpdateNoteDto,
  ): Note {
    const note = this.notesService.findById(id);
    if (note.ownerId !== req.user.sub && req.user.role !== 'admin') {
      throw new ForbiddenException('Only the note owner or an admin may update this note');
    }
    return this.notesService.update(id, dto);
  }
}
