import { useInfiniteQuery } from "@tanstack/react-query";
import axios, { AxiosResponse } from "axios";
import React from "react";
import Nav from "../components/Nav";
import Color from "../interface/Color";

// 'useInfiniteQuery' inject 'pageParam' into the fetcher function
const fetchColors = ({
  pageParam,
}: {
  pageParam: number;
}): Promise<AxiosResponse<Color[]>> => {
  // 'pageParam' sort of refers to a page params
  return axios.get(`http://localhost:4000/colors?_limit=2&_page=${pageParam}`);
};

const InfiniteQueries = (): React.JSX.Element => {
  // use 'useInfiniteQuery' to implement infinite queries
  // 'fetchNextPage' method will fetch the next page according to the login that will provide on 'getNextPageParam' function
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
    // provide the initial page params value, from the page you want to start fetching data
    initialPageParam: 1,
    // to fetch more or next page data we will provide another value:
    getNextPageParam: (_lastPage, pages) => {
      // 'pages' refers to an array of api responses, where each response corresponds to fetching 2 colors at a time.
      // no in this function we have to determine how to increase 'pageParam' value
      // We have Total color in db is 8, and 2 colors per page means 4 pages in total
      if (pages.length < 4) {
        // increase the page until 4 page
        return pages.length + 1;
      }
      // if page completed then return undefined
      return undefined;
      // Because json-server api is not flexible we have this logic but you should write you own logic according to you api
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
        // rendering list of pages group where inside we have again the list of colors
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
      {/* NOTE: we have add different functionality on infinite query but for now we will just going to add a button click and then fetch another peace of data or next page data */}
      <button
        onClick={() => fetchNextPage()}
        disabled={!hasNextPage || isFetchingNextPage}
      >
        Load More
      </button>
      {/* fetching next page indicator */}
      <div>{isFetching && isFetchingNextPage ? "Fetching..." : null}</div>
    </>
  );
};

export default InfiniteQueries;
