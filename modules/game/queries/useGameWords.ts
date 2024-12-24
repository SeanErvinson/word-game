import { githubInstance } from "@/libs/axios";

export type GameWordsResponse = {
  object: string[];
  action: string[];
  world: string[];
  person: string[];
  random: string[];
  nature: string[];
};

export const fetchGameWords = async (): Promise<GameWordsResponse> => {
  const res = await githubInstance.get<GameWordsResponse>(
    "SeanErvinson/text-storage/refs/heads/main/words.json"
  );
  return res.data;
};
