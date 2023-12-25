import axios, { AxiosResponse } from "axios";
import { useQuery } from "@tanstack/react-query";
import SuperHero from "../interface/Superheroes";

// const fetchSuperHeroDetail1 = (
//   heroId: string
// ): Promise<AxiosResponse<SuperHero>> => {
//   return axios.get(`http://localhost:4000/superheroes/${heroId}`);
// };

const fetchSuperHeroDetail2 = (
  // rather then passing 'heroId' value as argument on fetcher function, react query automatically pass all the query keys into fetch function
  // Docs: https://tanstack.com/query/v5/docs/react/guides/query-functions
  { queryKey }: { queryKey: string[] }
): Promise<AxiosResponse<SuperHero>> => {
  const heroId = queryKey[1];
  return axios.get(`http://localhost:4000/superheroes/${heroId}`);
};

export const useSuperHeroData = (heroId: string) => {
  return useQuery({
    // because we have to uniquely identify the query because of that for every super hero detail with respect of 'heroId' needs to be uniquely identify so that react query can do it's caching and refetching stuff for these unique query
    // So we have to include 'heroId' as part of the query key by providing multiple key
    queryKey: ["super-hero", heroId], // now react query will maintain separate query for different super hero
    // queryFn: () => fetchSuperHeroDetail1(heroId), // because we have to pass 'heroId' as argument on 'fetchSuperHeroDetail' function we will convert it into arrow function
    // Another way
    queryFn: fetchSuperHeroDetail2,
  });
};
