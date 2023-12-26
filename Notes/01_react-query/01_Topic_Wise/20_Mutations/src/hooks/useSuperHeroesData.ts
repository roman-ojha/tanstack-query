import { useQuery } from "@tanstack/react-query";
import axios, { AxiosResponse } from "axios";
import SuperHero from "../interface/Superheroes";

const fetchSuperHeroes = (): Promise<AxiosResponse<SuperHero[]>> => {
  return axios.get("http://localhost:4000/superheroes");
};

export const useSuperHeroesData = () => {
  return useQuery({
    queryKey: ["super-heroes"],
    queryFn: fetchSuperHeroes,
    select: (data: AxiosResponse<SuperHero[]>) => {
      const newData = data.data.map((hero) => {
        return { name: hero.name, id: hero.id };
      });
      return newData;
    },
  });
};
