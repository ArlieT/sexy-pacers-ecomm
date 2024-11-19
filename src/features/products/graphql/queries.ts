import { Product } from "@prisma/client";
import gql from "graphql-tag";

export const GET_PRODUCTS = gql`
  query GetProducts {
    products {
      id
      name
      description
      price
      SKU
      categoryId
      inventoryId
      discountId
      createdAt
      updatedAt
      category {
        id
        name
      }
    }
  }
`;

export type GetProductsQuery = {
  products: Product[];
};
