import { BookDB } from "./bookDB.interface";

export interface UserDB {
    name?: string;
    lastname?: string;
    email?: string[];
    readBooks?: BookDB[];
    readingBooks?: BookDB[];
    wishBooks?: BookDB[];
    favorites?: BookDB[];
}