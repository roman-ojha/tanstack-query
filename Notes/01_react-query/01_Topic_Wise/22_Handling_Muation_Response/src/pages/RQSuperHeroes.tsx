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

  // So, whenever we are adding new super hero to the database by request to api it will response us with the add data
  // So, Instead of refetching the query to get list of superheros, because we are just wasting the network call, we already have the added data available on response body.
  // So, we can update the query done to fetch list of super heroes and add the new data to the existing query.
  const queryClient = useQueryClient();
  const { mutate: addSuperHeroMutate } = useMutation<
    AxiosResponse<SuperHero>,
    AxiosError,
    Partial<SuperHero>
  >({
    mutationKey: ["add-super-heros"],
    mutationFn: addSuperHero,
    onSuccess(data, variables, context) {
      // 'data' refers to the response data that api send us.
      // Now add a new data on existing query query
      // https://tanstack.com/query/v5/docs/react/guides/updates-from-mutation-responses
      // 'setQueryData(<key>,<data>)' use to update the query cache
      queryClient.setQueryData(
        ["super-heroes"],
        (oldQueryData: {
          data: SuperHero[];
          status: number;
          statusText: string;
        }) => {
          // 'oldQueryData' refers to what is present on the query cache
          console.log(oldQueryData);
          return {
            ...oldQueryData,
            data: [...oldQueryData.data, data.data],
          };
        }
      );
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
