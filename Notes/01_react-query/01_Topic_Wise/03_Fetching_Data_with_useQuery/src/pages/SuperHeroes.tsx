import { useState, useEffect } from "react";
import axios, { AxiosError } from "axios";
import Nav from "../components/Nav";
import SuperHero from "../interface/Superheroes";

const SuperHeroes = () => {
  const [data, setData] = useState<SuperHero[]>([]);

  const [isLoading, setIsLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axios
      .get("http://localhost:4000/superheroes")
      .then((res) => {
        setData(res.data);
        setIsLoading(false);
      })
      .catch((err) => {
        setError((err as AxiosError).message);
        setIsLoading(false);
      });
  }, []);

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

export default SuperHeroes;
