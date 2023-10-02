export interface Data {
    totalItems?: number;
    items?:      Book[];
}

export interface Book {
    id?:         string;
    etag?:       string;
    selfLink?:   string;
    volumeInfo?: VolumeInfo;
    searchInfo?: SearchInfo;
}

export interface SearchInfo {
    textSnippet?: string;
}

export interface VolumeInfo {
    title?:               string;
    industryIdentifiers?: IndustryIdentifier[];
    pageCount?:           number;
    categories?:          string[];
    language?:            Language;
    previewLink?:         string;
    infoLink?:            string;
    canonicalVolumeLink?: string;
    authors?:             string[];
    publishedDate?:       string;
    averageRating?:       number;
    ratingsCount?:        number;
    publisher?:           string;
    description?:         string;
    imageLinks?:          ImageLinks;
    subtitle?:            string;
}

export interface ImageLinks {
    smallThumbnail?: string;
    thumbnail?:      string;
}

export interface IndustryIdentifier {
    type?:       Type;
    identifier?: string;
}

export enum Type {
    Isbn10 = "ISBN_10",
    Isbn13 = "ISBN_13",
}

export enum Language {
    Es = "es",
}
