import React from "react";
import Nav from "../components/Nav";
import { useQuery } from "@tanstack/react-query";
import axios, { AxiosResponse } from "axios";
import SuperHero from "../interface/Superheroes";

const RQSuperHeroes = (): React.JSX.Element => {
  const fetchSuperHeroes = (): Promise<AxiosResponse<SuperHero[]>> => {
    return axios.get("http://localhost:4000/superheroes");
  };

  /* 
    *) Query Cache:
      -> the first time useQuery fire for 'suer-heroes' key ' 'isLoading' is set to true and network request is send to fetch the data.
      -> when the request is completed it will get cached using the query key and 'fetchSuperHeroes' function as the unique identifier
      -> now when we will navigate to the another page and revisit this page then react query check whether the data for this query exist in cache, if it does then the cached data will get returned without setting isLoading set to true.
      -> However react query know that server data might have updated and the cached might not contain the latest data so a background refetch is triggered for the same query and if it is successful then the new data is updated to a UI.
      -> if our data is same is the cached data we don't see any changes on the UI.
      -> React query by default holds 5min of cache data
    */

  // 'isFetching' give whether background fetching is happening or not
  const { isLoading, data, error, isError, isFetching } = useQuery({
    queryKey: ["super-heroes"],
    queryFn: fetchSuperHeroes,
    // We can change the cache 'garbage collect' time
    gcTime: 5000, // 5s
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
