// src/userdata/store.tsx
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type Dispatch,
} from "react";
import type {
  Achievement,
  GameSnap,
  ListType,
  Review,
  UserDataState,
} from "./types";

const KEY = "arcadeatlas.v1.userdata";
const uid = () =>
  globalThis.crypto?.randomUUID?.() ?? Math.random().toString(36).slice(2);

const initial: UserDataState = {
  lists: {
    favorites: {},
    wishlist: {},
    playing: {},
    completed: {},
    backlog: {},
  },
  reviews: {},
  achievements: {},
  catalog: {},
  companyIndex: {},
};

type Action =
  | { type: "ADD_TO_LIST"; list: ListType; snap: GameSnap }
  | { type: "REMOVE_FROM_LIST"; list: ListType; gameId: number }
  | { type: "ADD_REVIEW"; review: Review }
  | { type: "ADD_ACHIEVEMENT"; gameId: number; title: string }
  | { type: "TOGGLE_ACHIEVEMENT"; gameId: number; id: string }
  | { type: "CATALOG_ADD"; snap: GameSnap }
  | { type: "INDEX_COMPANY"; company: string; gameId: number };

function reducer(state: UserDataState, a: Action): UserDataState {
  switch (a.type) {
    case "ADD_TO_LIST": {
      const lists = {
        ...state.lists,
        [a.list]: { ...state.lists[a.list], [a.snap.id]: a.snap },
      };
      const catalog = { ...state.catalog, [a.snap.id]: a.snap };
      return { ...state, lists, catalog };
    }
    case "REMOVE_FROM_LIST": {
      const copy = { ...state.lists[a.list] };
      delete copy[a.gameId];
      return { ...state, lists: { ...state.lists, [a.list]: copy } };
    }
    case "ADD_REVIEW": {
      const arr = [...(state.reviews[a.review.gameId] ?? [])];
      arr.unshift(a.review);
      return {
        ...state,
        reviews: { ...state.reviews, [a.review.gameId]: arr },
      };
    }
    case "ADD_ACHIEVEMENT": {
      const arr = [...(state.achievements[a.gameId] ?? [])];
      arr.push({ id: uid(), title: a.title, unlocked: false });
      return {
        ...state,
        achievements: { ...state.achievements, [a.gameId]: arr },
      };
    }
    case "TOGGLE_ACHIEVEMENT": {
      const arr = (state.achievements[a.gameId] ?? []).map((x: Achievement) =>
        x.id === a.id
          ? {
              ...x,
              unlocked: !x.unlocked,
              dateUnlocked: !x.unlocked ? Date.now() : undefined,
            }
          : x
      );
      return {
        ...state,
        achievements: { ...state.achievements, [a.gameId]: arr },
      };
    }
    case "CATALOG_ADD":
      return { ...state, catalog: { ...state.catalog, [a.snap.id]: a.snap } };
    case "INDEX_COMPANY": {
      const key = a.company.trim();
      const list = new Set([...(state.companyIndex[key] ?? []), a.gameId]);
      return {
        ...state,
        companyIndex: { ...state.companyIndex, [key]: Array.from(list) },
      };
    }
    default:
      return state;
  }
}

type CtxShape = { state: UserDataState; dispatch: Dispatch<Action> };
const Ctx = createContext<CtxShape | undefined>(undefined);

export function UserDataProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initial, () => {
    try {
      const raw = localStorage.getItem(KEY);
      return raw ? { ...initial, ...JSON.parse(raw) } : initial;
    } catch {
      return initial;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch {}
  }, [state]);

  const value = useMemo(() => ({ state, dispatch }), [state]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useUserData() {
  const ctx = useContext(Ctx);
  if (!ctx) {
    throw new Error(
      "useUserData must be used within <UserDataProvider> in main.tsx."
    );
  }
  return ctx;
}
