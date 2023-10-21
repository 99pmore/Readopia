export interface Review {
    userId: string;
    bookId: string;
    rating?: number;
    comment?: string;
}