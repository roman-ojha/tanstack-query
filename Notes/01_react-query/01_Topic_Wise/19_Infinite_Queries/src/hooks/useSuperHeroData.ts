import axios, { AxiosResponse } from "axios";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import SuperHero from "../interface/Superheroes";

const fetchSuperHeroDetail2 = ({
  queryKey,
}: {
  queryKey: string[];
}): Promise<AxiosResponse<SuperHero>> => {
  const heroId = queryKey[1];
  return axios.get(`http://localhost:4000/superheroes/${heroId}`);
};

export const useSuperHeroData = (heroId: string) => {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ["super-hero", heroId],
    queryFn: fetchSuperHeroDetail2,
    initialData: () => {
      const hero = queryClient
        .getQueryData<AxiosResponse<SuperHero[]>>(["super-heroes"])
        ?.data.find((hero) => hero.id === parseInt(heroId));
      if (hero) {
        return {
          data: hero,
        };
      }
      return undefined;
    },
  });
};
