import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

type Game = {
  id: string;
  name: string;
  score: number;
};

export const Categories = [
  "object",
  "action",
  "world",
  "person",
  "nature",
  "random",
] as const;

export type Category = (typeof Categories)[number];

type RoundOption = {
  roundDurationInSeconds: number;
  category: Category;
};

type State = {
  //   team: Record<string, Game[]>;
  roundOption: RoundOption;
};

type Action = {
  setRoundDuration: (duration: number) => void;
  setCategory: (category: Category) => void;
};

const useGameStore = create<State & Action>()(
  immer((set, get) => ({
    roundOption: {
      roundDurationInSeconds: 30,
      category: "action",
    },
    setRoundDuration: (duration) =>
      set((state) => {
        if (duration <= 0) {
          return;
        }
        state.roundOption.roundDurationInSeconds = duration;
      }),
    setCategory: (category) =>
      set((state) => {
        state.roundOption.category = category;
      }),
  }))
);
// if (duration <= 0) {
//     return;
//   }

export default useGameStore;
