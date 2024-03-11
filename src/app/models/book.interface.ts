export interface Data {
    items?:      Book[];
}

export interface Book {
    id?:         string;
    volumeInfo?: VolumeInfo;
}

export interface VolumeInfo {
    title?:               string;
    pageCount?:           number;
    categories?:          string[];
    authors?:             string[];
    publishedDate?:       string;
    averageRating?:       number;
    ratingsCount?:        number;
    description?:         string;
    imageLinks?:          ImageLinks;
}

export interface ImageLinks {
    thumbnail?:      string;
}
