import React, { useState } from "react";
import Nav from "../components/Nav";
import { useSuperHeroesData } from "../hooks";
import { Link } from "react-router-dom";
import SuperHero from "../interface/Superheroes";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError, AxiosResponse } from "axios";

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

  // https://tanstack.com/query/v5/docs/react/guides/query-invalidation
  // At the moment when we will add, we have to manually refetch the new list of heros by calling 'refetch' function
  // Especially when you know for a fact that a query's data is out of data because of something the user have done.
  // So, rather why don't we tell react query to automatically refetch the superheros query as soon as the mutation succeed
  // for that  the 'QueryClient' has an 'invalidateQueries' method that lets you intelligently mark queries as stale and potentially refetch them too!
  const queryClient = useQueryClient();
  const { mutate: addSuperHeroMutate } = useMutation<
    AxiosResponse<SuperHero>,
    AxiosError,
    Partial<SuperHero>
  >({
    mutationKey: ["add-super-heros"],
    mutationFn: addSuperHero,
    onSuccess(data, variables, context) {
      // so whenever the mutation become success we will going to call 'invalidateQueries' for the specific query key which we want to invalidate
      queryClient.invalidateQueries({
        queryKey: ["super-heroes"],
      });
      // After this react query will refetch the query on background and update the data on UI
    },
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

  const handleAddHero = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    addSuperHeroMutate(formState);
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
      <form onSubmit={handleAddHero}>
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
        <button type="submit">Add Hero</button>
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
