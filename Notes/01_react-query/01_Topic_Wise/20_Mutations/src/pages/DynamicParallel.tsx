import React from "react";
import Nav from "../components/Nav";
import axios, { AxiosResponse } from "axios";
import { useQueries } from "@tanstack/react-query";
import SuperHero from "../interface/Superheroes";

// Data needs to be fetch is a hero details
// Data about one single hero
const fetchSuperHero = (
  heroId: number
): Promise<AxiosResponse<SuperHero[]>> => {
  return axios.get(`http://localhost:4000/superheroes/${heroId}`);
};

const DynamicParallel = ({
  heroIds,
}: {
  heroIds: number[];
}): React.JSX.Element => {
  // But this component just not fetch data about 1 single hero detail rather it will fetch detail about multiple hero details using list of provided id 'heroIds'
  // it means that this component doesn't know that how many queries it needs to handle
  // and if number of queries changing from render to render we can't using manual query, because that violate the rules of hooks.
  // https://tanstack.com/query/v5/docs/react/guides/parallel-queries#dynamic-parallel-queries-with-usequeries
  // in this scenario we have to use 'useQueries' hook
  const queryResults = useQueries({
    queries: heroIds.map((id) => {
      return {
        queryKey: ["super-hero", id],
        queryFn: () => fetchSuperHero(id),
      };
    }),
  });

  console.log(queryResults);
  return (
    <>
      <Nav />
      <h1>Dynamic Parallel Page</h1>
    </>
  );
};

export default DynamicParallel;
