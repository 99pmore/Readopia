import { DocumentReference } from "@angular/fire/firestore";

export interface Review {
    id?: string;
    userId?: DocumentReference;
    bookId?: string;
    rating?: number;
    comment?: string;
}