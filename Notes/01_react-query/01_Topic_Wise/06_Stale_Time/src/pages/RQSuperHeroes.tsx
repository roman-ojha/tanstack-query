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
    // Let's say that our super heroes data doesn't change very often and it is ok user see stale(old) data for a while, in that case we can use cached query result without having to refetch on the background
    // For that we have another property called 'staleTime'
    staleTime: 30000, // 30s
    // so now this query data will be set as fresh data for 30s of time and react query will not refetch the data until then
    // This is the way you can reduce the number of network request during the stale time coupled with the query cached.
    // NOTE: that previous the default stealTime is 0 second, which is best if you want to upto date data to be fetch from the server
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
