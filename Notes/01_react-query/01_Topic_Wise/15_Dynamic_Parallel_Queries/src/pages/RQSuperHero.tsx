import React from "react";
import Nav from "../components/Nav";
import { useSuperHeroData } from "../hooks";
import { useParams } from "react-router-dom";

const RQSuperHero = (): React.JSX.Element => {
  const { heroId } = useParams();
  const { isLoading, data, isError, error } = useSuperHeroData(
    heroId as string
  );
  if (isLoading) {
    return <h2>Loading...</h2>;
  }
  if (isError) {
    return <h2>Error: {error.message}</h2>;
  }
  return (
    <>
      <div>
        <Nav />
        <h2>Name: {data?.data.name}</h2>
        <h2>AlterEgo: {data?.data.alterEgo}</h2>
      </div>
    </>
  );
};

export default RQSuperHero;
