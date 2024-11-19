import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { ApolloServer } from "@apollo/server";
import { NextRequest } from "next/server";
import { prisma } from "@/db/prisma";
import { typeDefs } from "./schema";

const resolvers = {
  Query: {
    users: async () => {
      try {
        const users = await prisma.user.findMany();
        return users.map((user) => ({
          ...user,
          createdAt: user.createdAt.toISOString(),
          updatedAt: user.updatedAt.toISOString(),
        }));
      } catch (error) {
        console.error("Error fetching users:", error);
        throw error; // Let Apollo handle the error
      }
    },
    user: async (_: any, { id }: { id: string }) => {
      try {
        const user = await prisma.user.findUnique({
          where: { id },
        });

        if (!user) {
          throw new Error(`User with ID ${id} not found.`);
        }

        return {
          ...user,
          createdAt: user.createdAt.toISOString(),
          updatedAt: user.updatedAt.toISOString(),
        };
      } catch (error) {
        console.error("Error fetching user:", error);
        throw error;
      }
    },
  },
};

const server = new ApolloServer({
  resolvers,
  typeDefs,
  formatError: (error) => {
    // Log the error on the server
    console.error("GraphQL Error:", error);

    // Return detailed error in development
    return process.env.NODE_ENV === "development"
      ? error
      : new Error("Internal server error");
  },
});

const handler = startServerAndCreateNextHandler(server, {
  context: async (req) => ({ req }),
});

export async function GET(request: NextRequest) {
  return handler(request);
}

export async function POST(request: NextRequest) {
  return handler(request);
}
