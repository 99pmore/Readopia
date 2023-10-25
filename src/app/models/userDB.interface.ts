import { BookDB } from "./bookDB.interface";

export interface UserDB {
    id?: string;
    name?: string;
    lastname?: string;
    email?: string;
    photo?: string;
    readBooks?: BookDB[];
    readingBooks?: BookDB[];
    wishBooks?: BookDB[];
    favorites?: BookDB[];
    following?: string[];
    followers?: string[];
}