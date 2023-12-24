import { useState, useEffect } from "react";
import axios, { AxiosError } from "axios";
import Nav from "../components/Nav";
import SuperHero from "../interface/Superheroes";

// Overview: https://tanstack.com/query/v5/docs/react/overview
const SuperHeroes = () => {
  // What we used to do before on data fetching is we used to use 'useEffect' for data fetching and 'useState' to store the data
  const [data, setData] = useState<SuperHero[]>([]);

  // Creating loading spinner state
  const [isLoading, setIsLoading] = useState(true);

  // to hand the error what we can do is we can add error state
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axios
      // using valid link and fetch data with status 200
      // .get("http://localhost:4000/superheroes")
      // using invalid link and which throw the error
      .get("http://localhost:4000/superheroess")
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => {
        setError((err as AxiosError).message);
      })
      .finally(() => {
        setIsLoading(false);
      });

    // When ever this component get render into the page, it could happen through several reason like: (navigating to next page & get back to the same page again) in that case 'useEffect' will get called and fetch api will fetch the list of product using http request on the server and again we are fetching the same product that we fetch before
    // Rather we should have a functionality to handle catching of the data that we fetch before and no need to do a request again to the server
  }, []);

  // Here we can see that It is becoming complex to hand just fetching data and rendering it into browser

  if (isLoading) {
    return <h2>Loading...</h2>;
  }

  if (error) {
    return <h2>Error: {error}</h2>;
  }

  return (
    <>
      <Nav />
      <h2>Super Heroes Page</h2>
      {data.map((hero) => {
        return <div>{hero.name}</div>;
      })}
    </>
  );
};

/* 
  *) React Query:
    -> React Query have 3 core concepts:
      1. Queries
        -> fetching data using get request
      2. Mutations
        -> if you want to update or post the data onto the server in that case we use mutation
      3. Query Invalidation
*/

export default SuperHeroes;
