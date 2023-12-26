import React, { useState } from "react";
import Nav from "../components/Nav";
import { useSuperHeroesData } from "../hooks";
import { Link } from "react-router-dom";
import SuperHero from "../interface/Superheroes";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError, AxiosResponse } from "axios";

// Mutation function to add new super hero
const addSuperHero = (
  newHero: Partial<SuperHero>
): Promise<AxiosResponse<SuperHero>> => {
  return axios.post("http://localhost:4000/superheroes", newHero);
};

const RQSuperHeroes = (): React.JSX.Element => {
  const [formState, setFormState] = useState<Partial<SuperHero>>({
    name: "",
    alterEgo: "",
  });
  const { isLoading, data, error, isError, isFetching, refetch } =
    useSuperHeroesData();

  // we will use 'useMutation' hook to do post request
  // https://tanstack.com/query/v5/docs/react/guides/mutations
  // it provides us with different value but to do post mutation we have 'mutate' function
  const {
    mutate: addSuperHeroMutate,
    // isError,
    // error,
    // isSuccess,
  } = useMutation<
    AxiosResponse<SuperHero>, // response type
    AxiosError, // error type
    Partial<SuperHero> // mutate argument
  >({
    // mutation doesn't necessarily required 'mutationKey'
    mutationFn: addSuperHero,
  });

  const handleForm = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const name = e.target.name;
    const value = e.target.value;
    setFormState({
      ...formState,
      [name]: value,
    });
  };

  const handleAddHero = () => {
    addSuperHeroMutate(formState); // mutation function will get the value that we will provide from mutate function
  };

  if (isLoading) {
    return <h2>Loading...</h2>;
  }

  if (isError) {
    return <h2>Error: {error.message}</h2>;
  }

  console.log({ isLoading, isFetching });

  return (
    <>
      <Nav />
      <h1>React query Super Heroes page</h1>
      <form>
        <input
          type="text"
          name="name"
          id="name"
          value={formState.name}
          onChange={handleForm}
          placeholder="Name"
        />
        <input
          type="text"
          name="alterEgo"
          id="alterEgo"
          value={formState.alterEgo}
          onChange={handleForm}
          placeholder="Alter Ego"
        />
        <button onClick={handleAddHero}>Add Hero</button>
      </form>
      <button onClick={() => refetch()}>Refetch Hero</button>
      {data?.map((hero) => {
        return (
          <div key={hero.id.toString()}>
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
