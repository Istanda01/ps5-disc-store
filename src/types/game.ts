// โครงสร้างข้อมูลที่ได้รับจาก Mock API ไม่เก็บข้อมูลชุดนี้ซ้ำใน Zustand
export interface Game {
  id: string;
  title: string;
  price: number;
  cover: string;
  banner?: string;
  screenshots?: string[]
  genre: string;
  players: string;
  platform: string;
  format: string;
  releaseDate: string;
  publisher: string;
  featured: boolean;
  description: string;
}

export type SortOrder = 'featured' | 'price-asc' | 'price-desc' | 'name'|'banner' | 'releaseDate' | 'publisher' |'screenshots' | 'platform' | 'format' | 'players' | 'genre';
