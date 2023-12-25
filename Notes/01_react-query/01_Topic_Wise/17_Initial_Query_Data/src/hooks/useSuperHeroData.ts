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

// https://tanstack.com/query/v5/docs/react/guides/initial-query-data
// -> Ex: on '/rq-super-heroes' we will get the list of heroes after loading time and when we will navigate to the 'rq-super-heroes/:heroId' page we will again get the hero detail after loading time, rather can't we use the same list of heros data that we fetch on '/rq-super-heroes' page for the initial data into 'rq-super-heroes/:heroId' page, yes we can, But we have to keep in mind that all the data that is required to display on 'rq-super-heros/:heroId' page may not exist on the data that we fetch on 'rq-super-heros' page, but we can use that data however
export const useSuperHeroData = (heroId: string) => {
  // Step 1:
  // first we need to get the query client instance for that we have 'useQueryClient' hook
  const queryClient = useQueryClient();
  // 'queryClient' instance have access to the query cached which we can now access to to set the initial data

  return useQuery({
    queryKey: ["super-hero", heroId],
    queryFn: fetchSuperHeroDetail2,
    // Step 2: Set initial data on query
    initialData: () => {
      // Get the list of superheroes
      const hero = queryClient
        .getQueryData<AxiosResponse<SuperHero[]>>(["super-heroes"])
        ?.data.find((hero) => hero.id === parseInt(heroId));
      if (hero) {
        return {
          data: hero,
        };
      }
      // if hero doesn't exist
      // If initial data is undefined, react query will set that query to loading state does saving us from run time error
      return undefined;
      // queryClient.getQueryData("<query_key>")
    },
  });
};
