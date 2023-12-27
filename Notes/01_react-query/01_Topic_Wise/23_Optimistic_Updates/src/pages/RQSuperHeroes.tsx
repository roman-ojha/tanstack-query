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

  // Optimistic update imply updating the state before performing a mutation under the assumption that noting will go wrong
  const queryClient = useQueryClient();
  const { mutate: addSuperHeroMutate } = useMutation<
    AxiosResponse<SuperHero>,
    AxiosError,
    Partial<SuperHero>,
    { previousHeroData: AxiosResponse<SuperHero[]> | undefined } // context type
  >({
    mutationKey: ["add-super-heros"],
    mutationFn: addSuperHero,
    // https://tanstack.com/query/v5/docs/react/guides/optimistic-updates#updating-a-list-of-todos-when-adding-a-new-todo
    onMutate: async (newHero) => {
      // this function will get called before mutate function get fired and is is passed the same variables that the mutation function will received
      // first we will cancel any outgoing refetch so that they won't override our optimistic update.
      // https://tanstack.com/query/v5/docs/react/guides/query-cancellation
      await queryClient.cancelQueries({ queryKey: ["super-heroes"] });

      // Next we need to hold current query data before we make any update, this will help us rollback if mutation fails
      const previousHeroData = queryClient.getQueryData<
        AxiosResponse<SuperHero[]>
      >(["super-heroes"]);

      // Now update the query data
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
            data: [
              ...oldQueryData.data,
              { id: oldQueryData.data?.length + 1, ...newHero },
            ],
          };
        }
      );

      // return the context object with 'previousHeroData', this will be used to rollback data if in case the mutation errors out.
      return { previousHeroData };
    },
    // If the mutation fails,
    // use the context returned from onMutate to roll back
    // onError(<error>, <passed_mutation_data>, <context>)
    onError: (_error, _newHero, context) => {
      // on 'context' object we can access 'previousHeroData' that we have returned from the 'onMutate' callback
      queryClient.setQueryData(["super-heroes"], context?.previousHeroData);
    },
    onSettled: () => {
      // Always get called after error or success:
      // Now here we can refetch the superhero
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
