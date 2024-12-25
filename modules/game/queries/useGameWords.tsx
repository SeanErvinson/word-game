import { githubInstance } from "@/libs/axios";
import { useQuery } from "@tanstack/react-query";

export type GameWordsResponse = {
  object: string[];
  action: string[];
  world: string[];
  person: string[];
  random: string[];
  nature: string[];
};

const fetchGameWords = async (): Promise<GameWordsResponse> => {
  const res = await githubInstance.get<GameWordsResponse>(
    "SeanErvinson/text-storage/refs/heads/main/words.json"
  );
  return res.data;
};

export const useGameWords = () =>
  useQuery({
    queryKey: ["words"],
    queryFn: fetchGameWords,
  });
