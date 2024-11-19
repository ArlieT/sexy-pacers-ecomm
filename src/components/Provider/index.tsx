import React from "react";
import { ApolloWrapper } from "./apollo-wrapper";

const Providers = ({ children }: { children: React.ReactNode }) => {
  return <ApolloWrapper>{children}</ApolloWrapper>;
};

export default Providers;
