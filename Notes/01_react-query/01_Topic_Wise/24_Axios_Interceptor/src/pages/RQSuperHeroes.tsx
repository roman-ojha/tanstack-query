import React, { useState } from "react";
import Nav from "../components/Nav";
import { useSuperHeroesData } from "../hooks";
import { Link } from "react-router-dom";
import SuperHero from "../interface/Superheroes";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";
import { request } from "../utils/axios-utils";

// for using axios for network request, it is common to have base url, bearer token in the header, custom error handling etc..
// for that we will going to create '../utils/axios-utils.ts', where we will implement our axios logic
const addSuperHero = (
  newHero: Partial<SuperHero>
): Promise<AxiosResponse<SuperHero>> => {
  return request({
    method: "POST",
    url: "http://localhost:4000/superheroes",
    data: newHero,
  });
};

const RQSuperHeroes = (): React.JSX.Element => {
  const [formState, setFormState] = useState<Partial<SuperHero>>({
    name: "",
    alterEgo: "",
  });
  const { isLoading, data, error, isError, isFetching, refetch } =
    useSuperHeroesData();

  const queryClient = useQueryClient();
  const { mutate: addSuperHeroMutate } = useMutation<
    AxiosResponse<SuperHero>,
    AxiosError,
    Partial<SuperHero>,
    { previousHeroData: AxiosResponse<SuperHero[]> | undefined } // context type
  >({
    mutationKey: ["add-super-heros"],
    mutationFn: addSuperHero,
    onMutate: async (newHero) => {
      await queryClient.cancelQueries({ queryKey: ["super-heroes"] });

      const previousHeroData = queryClient.getQueryData<
        AxiosResponse<SuperHero[]>
      >(["super-heroes"]);

      queryClient.setQueryData(
        ["super-heroes"],
        (oldQueryData: {
          data: SuperHero[];
          status: number;
          statusText: string;
        }) => {
          console.log(oldQueryData);
          return {
            ...oldQueryData,
            data: [
              ...oldQueryData.data,
              { id: oldQueryData.data?.length + 1, ...newHero },
            ],
          };
        }
      );

      return { previousHeroData };
    },
    onError: (_error, _newHero, context) => {
      queryClient.setQueryData(["super-heroes"], context?.previousHeroData);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["super-heroes"] });
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
