import { useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import axios, { AxiosResponse } from "axios";
import React from "react";
import Nav from "../components/Nav";
import Color from "../interface/Color";

const fetchColors = (pageNumber: number): Promise<AxiosResponse<Color[]>> => {
  return axios.get(`http://localhost:4000/colors?_limit=2&_page=${pageNumber}`);
  // 'json-server' package support the pagination out of the box:
  // http://localhost:4000/colors?_limit=<number_of_items>&_page=<which_page>
};

const PaginatedQueries = (): React.JSX.Element => {
  // First maintain the state variable for page number
  const [pageNumber, setPageNumber] = useState(1); // initial: first page

  // Now we will utilize this page number to create unique queries
  const { data, isLoading, isError, error, isFetching } = useQuery({
    queryKey: ["colors", pageNumber],
    queryFn: () => fetchColors(pageNumber),
    // so, whenever we will move to the next page using next page button component will again show us the loading screen but we don't want that UX, rather we want to remove the previous only after the next page data arrived, and we don't want a loading screen on every next button pressed in that case add bellow:
    placeholderData: keepPreviousData,
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
      {data?.data.map((color) => {
        return (
          <div id={color.id.toString()}>
            <h2>
              {color.id}. {color.label}
            </h2>
          </div>
        );
      })}
      {/* Button that will change the page number */}
      <button
        style={{ borderColor: "red", borderWidth: 1, marginRight: 10 }}
        onClick={() => setPageNumber(pageNumber - 1)}
        disabled={pageNumber <= 1 ? true : false}
      >
        Prev Page
      </button>
      <button
        style={{ borderColor: "red", borderWidth: 1 }}
        onClick={() => setPageNumber(pageNumber + 1)}
        disabled={pageNumber === 4}
      >
        Next Page
      </button>
      {isFetching && "loading"}
    </>
  );
};

export default PaginatedQueries;
