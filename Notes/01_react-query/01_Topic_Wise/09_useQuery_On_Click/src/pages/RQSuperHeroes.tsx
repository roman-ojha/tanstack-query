import React from "react";
import Nav from "../components/Nav";
import { useQuery } from "@tanstack/react-query";
import axios, { AxiosResponse } from "axios";
import SuperHero from "../interface/Superheroes";

const RQSuperHeroes = (): React.JSX.Element => {
  const fetchSuperHeroes = (): Promise<AxiosResponse<SuperHero[]>> => {
    return axios.get("http://localhost:4000/superheroes");
  };

  // By default useQuery will fetch the data on component mount
  // For that react query provide us the 'refetch' method to manually trigger the query
  const { isLoading, data, error, isError, isFetching, refetch } = useQuery({
    queryKey: ["super-heroes"],
    queryFn: fetchSuperHeroes,
    // If we don't want useQuery to fetch the data on component mount that we want to inform useQuery to not fire the fetch request on component mount.
    // We do that by passing the configuration 'enabled' to false
    enabled: false,
  });

  console.log({ isLoading, isFetching });

  if (isLoading || isFetching) {
    // render loading on isFetching as well
    return <h2>Loading...</h2>;
  }

  if (isError) {
    return <h2>Error: {error.message}</h2>;
  }

  return (
    <>
      <Nav />
      <h1>React query Super Heroes page</h1>
      <button onClick={refetch}>Fetch Heroes</button>
      {data?.data.map((hero) => {
        return <div key={hero.id}>{hero.name}</div>;
      })}
    </>
  );
};

export default RQSuperHeroes;
