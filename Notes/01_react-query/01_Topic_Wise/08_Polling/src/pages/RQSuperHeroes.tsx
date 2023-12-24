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
    // Polling refers to fetching data on regular intervals
    // EX: if you have component that shows a real time price of the different stuck then you might have to fetch data every seconds to update the UI, and UI will always be In sync with the remote data without any User interaction.
    // refetchInterval: false, // default
    refetchInterval: 2000, // query will refetch in every 2 seconds
    // NOTE that polling or automatically refetching get paused when the windows loses it's focus
    // If you want to do background refetching at regular interval then you can specify this:
    refetchIntervalInBackground: true,
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
