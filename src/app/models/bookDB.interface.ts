export interface BookDB {
    id?: string;
    cover?: string;
    title?: string;
    authors?: string[];
    categories?: string[];
    rating?: number;
    description?: string;
    state?: string;
}