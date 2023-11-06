export interface Review {
    id?: string,
    userId: string;
    bookId: string;
    bookTitle: string;
    rating?: number;
    comment?: string;
}