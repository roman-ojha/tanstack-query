import React from "react";
import Nav from "../components/Nav";
import { useQuery } from "@tanstack/react-query";
import axios, { AxiosResponse } from "axios";
import SuperHero from "../interface/Superheroes";

const RQSuperHeroes = (): React.JSX.Element => {
  const fetchSuperHeroes = (): Promise<AxiosResponse<SuperHero[]>> => {
    return axios.get("http://localhost:4000/superheroes");
  };

  const { isLoading, data, error, isError, isFetching } = useQuery({
    queryKey: ["super-heroes"],
    queryFn: fetchSuperHeroes,
    // -> https://tanstack.com/query/latest/docs/react/guides/important-defaults
    // More: https://tanstack.com/query/v5/docs/react/guides/window-focus-refetching
    // if 'refetchOnMount' set to true then react query will refetch the data on component mount if the data is 'stale', by default it is true
    refetchOnMount: true,
    // if 'refetchOnMount' set to false then react query will not refetch the data on component mount if the data is 'stale'
    // refetchOnMount: false,
    // if 'refetchOnMount' set to 'always' then react query will refetch the data on component mount whether the query data is 'stale' or not, the query will always refetch the data on component mounts
    // refetchOnMount: "always",

    // if 'refetchOnWindowFocus' set to true then whenever browser windows is on focus then react query will refetch the data if the data is stale, by default it is true
    // refetchOnWindowFocus: true,
    // if 'refetchOnWindowFocus' set to true then whenever browser windows is on focus then react query will not refetch the data.
    // refetchOnWindowFocus: false,
    refetchOnWindowFocus: "always",
    // if 'refetchOnWindowFocus' set to 'always' then whenever browser windows is on focus then react query will refetch the data whether the query data is 'stale' or not.

    // refetch on given time interval
    // refetchInterval: 5000 //
  });

  console.log({ isLoading, isFetching });

  if (isLoading) {
    return <h2>Loading...</h2>;
  }

  if (isError) {
    return <h2>Error: {error.message}</h2>;
  }

  return (
    <>
      <Nav />
      React query Super Heroes page
      {data?.data.map((hero) => {
        return <div key={hero.id}>{hero.name}</div>;
      })}
    </>
  );
};

export default RQSuperHeroes;
