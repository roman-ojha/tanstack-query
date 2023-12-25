import React from "react";
import Nav from "../components/Nav";
import { useSuperHeroesData } from "../hooks";

const RQSuperHeroes = (): React.JSX.Element => {
  const { isLoading, data, error, isError, isFetching } = useSuperHeroesData();

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
