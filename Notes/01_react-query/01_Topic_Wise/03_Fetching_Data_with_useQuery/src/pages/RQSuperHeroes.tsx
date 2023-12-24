import React from "react";
import Nav from "../components/Nav";
import { useQuery } from "@tanstack/react-query";
import axios, { AxiosResponse } from "axios";
import SuperHero from "../interface/Superheroes";

const RQSuperHeroes = (): React.JSX.Element => {
  // https://tanstack.com/query/v5/docs/react/quick-start
  // Function that do http request to our server and return the promise from this function
  const fetchSuperHeroes = (): Promise<AxiosResponse<SuperHero[]>> => {
    return axios.get("http://localhost:4000/superheroess");
  };

  // setting up query
  // to handle the query result returned by useQuery hooks, it provides us some properties like 'isLoading', 'data' & 'error'
  const { isLoading, data, error, isError } = useQuery({
    queryKey: ["super-heroes"],
    queryFn: fetchSuperHeroes,
  });
  // useQuery(<unique_key_to_identify_query>, <accept_function_that_return_promise>)

  if (isLoading) {
    return <h2>Loading...</h2>;
  }

  if (isError) {
    // If error occur react query will try to retry the request again
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
