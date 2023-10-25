export interface Review {
    userId: string;
    bookId: string;
    bookTitle: string;
    rating?: number;
    comment?: string;
}