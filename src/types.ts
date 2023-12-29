export type Book = {
  id?: number;
  title: string;
  isbn: string;
  PublisherId: number;
  year?: number;
  author?: string;
  pages?: number;
  Publisher?: Publisher;
  Comments?: Comment[];
};

export type Comment = {
  id?: number;
  name: string;
  comment: string;
  stars?: number;
  BookId: number;
  Book?: Book;
};

export type Publisher = {
  id?: number;
  name: string;
  country?: string;
  Books?: Book[];
};
