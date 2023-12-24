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
    // we have fetch data from API before without react query where we might have done some data transformation into a format that the frontend component can consume, where backend could have different convention and frontend could have different convention
    // To help with these scenario react query provide us a 'select' configuration option
    // Select is a function that takes and api data as an argument
    select: (data: AxiosResponse<SuperHero[]>) => {
      const newData = data.data.map((hero) => {
        return { name: hero.name, id: hero.id };
      });
      return newData;
    },
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
      <h1>React query Super Heroes page</h1>
      {data?.map((hero) => {
        return <div key={hero.id}>{hero.name}</div>;
      })}
    </>
  );
};

export default RQSuperHeroes;
