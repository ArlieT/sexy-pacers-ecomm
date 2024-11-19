"use client";

import { useQuery } from "@apollo/client";
import { GET_USERS, GetUsersQuery } from "./graphql/queries";

export default function UsersList() {
  const { loading, error, data } = useQuery<GetUsersQuery>(GET_USERS);

  console.log(error);
  console.log(data);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h2>Users</h2>
      <ul>
        {data?.users?.map((user, id) => (
          <li key={id}>
            {user.firstName} {user.lastName} ({user.email})
          </li>
        ))}
      </ul>
    </div>
  );
}
