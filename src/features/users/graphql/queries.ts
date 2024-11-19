import { User } from "@prisma/client";
import gql from "graphql-tag";

export const GET_USERS = gql`
  query GetUsers {
    users {
      firstName
      lastName
      email
    }
  }
`;

export type GetUsersQuery = {
  users: User[];
};
