import { gql } from "graphql-tag";

export const userTypeDefs = gql`
  type User {
    id: String!
    firstName: String
    lastName: String
    email: String
    mobile: String
    location: String
    bio: String
    isVerified: Boolean!
    verificationToken: String
    tokenExpiry: String
    createdAt: String!
    updatedAt: String!
  }

  type Query {
    users: [User!]!
    user(id: String!): User
  }
`;
