export type ListType = "favorites" | "wishlist" | "playing" | "completed" | "backlog";

export type GameSnap = {
  id: number;
  title: string;
  imgURL?: string | null;
  genre?: string | null;
  releaseYear?: number | null;
};

export type Review = { gameId: number; rating: number; text?: string; createdAt: number };

export type Achievement = { id: string; title: string; unlocked: boolean; dateUnlocked?: number };

export type UserDataState = {
  lists: Record<ListType, Record<number, GameSnap>>;
  reviews: Record<number, Review[]>;                 // by gameId
  achievements: Record<number, Achievement[]>;       // by gameId
  catalog: Record<number, GameSnap>;                 // all known games
  companyIndex: Record<string, number[]>;            // "Iron Gate Studios" -> [gameIds]
};
