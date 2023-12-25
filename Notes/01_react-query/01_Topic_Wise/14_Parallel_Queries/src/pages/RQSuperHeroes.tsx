import React from "react";
import Nav from "../components/Nav";
import { useSuperHeroesData } from "../hooks";
import { Link } from "react-router-dom";

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
        return (
          <div id={hero.id.toString()}>
            <Link to={`/rq-super-heroes/${hero.id}`}>
              <h2>{hero.name}</h2>
            </Link>
          </div>
        );
      })}
    </>
  );
};

export default RQSuperHeroes;
