export interface Note {
  id: number;
  title: string;
  content: string;
  tags: string[];
  ownerId: number;
  createdAt: string;
  updatedAt: string;
}
