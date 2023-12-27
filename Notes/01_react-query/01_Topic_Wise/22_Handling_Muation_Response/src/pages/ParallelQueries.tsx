import React from "react";
import Nav from "../components/Nav";
import axios, { AxiosResponse } from "axios";
import { useQuery } from "@tanstack/react-query";
import SuperHero from "../interface/Superheroes";
import Friend from "../interface/Friend";
import { Link } from "react-router-dom";

const fetchSuperHeroes = (): Promise<AxiosResponse<SuperHero[]>> => {
  return axios.get("http://localhost:4000/superheroes");
};

const fetchFriends = (): Promise<AxiosResponse<Friend[]>> => {
  return axios.get("http://localhost:4000/friends");
};

const ParallelQueries = (): React.JSX.Element => {
  // The following queries will execute in parallel
  const { data: superHeroesData } = useQuery({
    queryKey: ["super-heroes"],
    queryFn: fetchSuperHeroes,
  });
  const { data: friendsData } = useQuery({
    queryKey: ["friends"],
    queryFn: fetchFriends,
  });
  return (
    <>
      <Nav />
      <h1>Parallel Queries</h1>
      <h1>Super Heroes:</h1>
      {superHeroesData?.data.map((hero) => {
        return (
          <div id={hero.id.toString()}>
            <Link to={`/rq-super-heroes/${hero.id}`}>
              <h2>{hero.name}</h2>
            </Link>
          </div>
        );
      })}
      <h1>Friends:</h1>
      {friendsData?.data.map((hero) => {
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

export default ParallelQueries;
