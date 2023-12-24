import React, { useEffect } from "react";
import Nav from "../components/Nav";
import { useQuery } from "@tanstack/react-query";
import axios, { AxiosResponse } from "axios";
import SuperHero from "../interface/Superheroes";

const RQSuperHeroes = (): React.JSX.Element => {
  const fetchSuperHeroes = (): Promise<AxiosResponse<SuperHero[]>> => {
    return axios.get("http://localhost:4000/superheroes");
  };
  const { isLoading, data, error, isError, isFetching, isSuccess } = useQuery({
    queryKey: ["super-heroes"],
    queryFn: fetchSuperHeroes,
  });

  // When dealing with data fetching sometimes you might want to perform action when the query completes
  // EX: opening a model, Navigating to different route or displaying post notifications
  // https://barrymichaeldoyle.com/blog/tanstack-v5
  // https://tanstack.com/query/latest/docs/react/guides/migrating-to-v5#callbacks-on-usequery-and-queryobserver-have-been-removed

  // Defining function which will get called when query success or fail
  const onSuccess = (data: SuperHero[]) => {
    // Perform Success action
    console.log(data);
  };

  const onError = (error: Error) => {
    // Toast message
    console.log(error);
  };

  useEffect(() => {
    if (isError) {
      onError(error);
    }
    if (isSuccess) {
      onSuccess(data.data);
    }
  }, [isError, isSuccess, data, error]);

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
      <h1>React query Super Heroes page</h1>
      <button>Fetch Heroes</button>
      {data?.data.map((hero) => {
        return <div key={hero.id}>{hero.name}</div>;
      })}
    </>
  );
};

export default RQSuperHeroes;
