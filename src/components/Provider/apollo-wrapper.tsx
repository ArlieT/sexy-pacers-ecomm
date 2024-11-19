"use client";

import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  HttpLink,
} from "@apollo/client";
import { useMemo } from "react";

export function ApolloWrapper({ children }: { children: React.ReactNode }) {
  const client = useMemo(() => {
    return new ApolloClient({
      cache: new InMemoryCache(),
      link: new HttpLink({
        uri: "/api/graphql",
      }),
    });
  }, []);

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
