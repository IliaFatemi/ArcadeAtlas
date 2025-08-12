export type LatestGame = {
  id: number;
  title: string;
  imgURL: string;
  details: string;
  genre: string;
  releaseYear?: number | null;
  price?: string;
};
