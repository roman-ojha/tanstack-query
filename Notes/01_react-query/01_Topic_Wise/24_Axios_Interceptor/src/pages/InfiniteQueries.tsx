import { useInfiniteQuery } from "@tanstack/react-query";
import axios, { AxiosResponse } from "axios";
import React from "react";
import Nav from "../components/Nav";
import Color from "../interface/Color";

const fetchColors = ({
  pageParam,
}: {
  pageParam: number;
}): Promise<AxiosResponse<Color[]>> => {
  return axios.get(`http://localhost:4000/colors?_limit=2&_page=${pageParam}`);
};

const InfiniteQueries = (): React.JSX.Element => {
  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetching,
  } = useInfiniteQuery({
    queryKey: ["colors"],
    queryFn: fetchColors,
    initialPageParam: 1,
    getNextPageParam: (_lastPage, pages) => {
      if (pages.length < 4) {
        return pages.length + 1;
      }
      return undefined;
    },
  });

  if (isLoading) {
    return <h2>Loading...</h2>;
  }

  if (isError) {
    return <h2>Error: {error.message}</h2>;
  }
  return (
    <>
      <Nav />
      {data?.pages.map((group, i) => {
        return (
          <React.Fragment key={i}>
            {group.data.map((color) => {
              return (
                <React.Fragment key={color.id}>
                  <h2>
                    {color.id}. {color.label}
                  </h2>
                </React.Fragment>
              );
            })}
          </React.Fragment>
        );
      })}
      <button
        onClick={() => fetchNextPage()}
        disabled={!hasNextPage || isFetchingNextPage}
      >
        Load More
      </button>
      <div>{isFetching && isFetchingNextPage ? "Fetching..." : null}</div>
    </>
  );
};

export default InfiniteQueries;
