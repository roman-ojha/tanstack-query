import { useQuery } from "@tanstack/react-query";
import axios, { AxiosResponse } from "axios";
import React from "react";
import User from "../interface/User";
import Nav from "../components/Nav";
import Channel from "../interface/Channel";

const fetchUserByEmail = (email: string): Promise<AxiosResponse<User>> => {
  return axios.get(`http://localhost:4000/users/${email}`);
};

const fetchCoursesByChannelId = (
  channelId: string
): Promise<AxiosResponse<Channel>> => {
  return axios.get(`http://localhost:4000/channels/${channelId}`);
};

// -> As we know that parallel queries can executed in parallel to maximize fetching concurrency.
// -> But in some cases where we need to execute queries sequentially, that is one after the another. this comes when one query is dependent of another query.
const DependentQueries = ({ email }: { email: string }): React.JSX.Element => {
  // In this page we need to fetch list of courses for the email that is provided on 'email' props
  // First we need to fetch user detail using 'email' and then get the 'channelId' from that
  // The secondly we have to fire another query to get chanel detail using the 'channelId' that we get from first query

  // https://tanstack.com/query/v5/docs/react/guides/dependent-queries
  // Query to get the user detail
  const { data } = useQuery({
    queryKey: ["user", email],
    queryFn: () => fetchUserByEmail(email),
  });
  const channelId = data?.data.channelId; // get the channelId from the query data

  //
  const { data: courseData } = useQuery({
    queryKey: ["course", channelId],
    queryFn: () => fetchCoursesByChannelId(channelId as string),
    // The query will not execute until the userId exists
    enabled: !!channelId, // !! convert the value into boolean
  });

  console.log(courseData);

  return (
    <>
      <Nav />
      <h1>Dependent Query Page</h1>
    </>
  );
};

export default DependentQueries;
