export interface ImageLink {
  thumbnail: string;
  url: string;
}

export interface SnaptikJson {
  author: string;
  description: string;
  videoLinks?: string[];
  imageLinks: ImageLink[];
}
