import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { Note } from './note.model';
import { SortOrder } from '../common/pipes/sort-order.pipe';

@Injectable()
export class NotesService {
  private nextId = 1;
  private readonly notes: Note[] = [];

  create(dto: CreateNoteDto, ownerId: number): Note {
    const now = new Date().toISOString();
    const note: Note = {
      id: this.nextId++,
      title: dto.title,
      content: dto.content,
      tags: dto.tags ?? [],
      ownerId,
      createdAt: now,
      updatedAt: now,
    };
    this.notes.push(note);
    return note;
  }

  findByOwner(ownerId: number, order: SortOrder): Note[] {
    return this.notes
      .filter((note) => note.ownerId === ownerId)
      .sort((a, b) => {
        const comparison = a.title.localeCompare(b.title, undefined, { sensitivity: 'base' });
        return order === 'asc' ? comparison : -comparison;
      });
  }

  findById(id: number): Note {
    const note = this.notes.find((item) => item.id === id);
    if (!note) throw new NotFoundException(`Note ${id} was not found`);
    return note;
  }

  update(id: number, dto: UpdateNoteDto): Note {
    const note = this.findById(id);
    Object.assign(note, dto, { updatedAt: new Date().toISOString() });
    return note;
  }
}
