import { gql } from "graphql-tag";

export const productTypeDefs = gql`
  type Product {
    id: String
    name: String
    description: String
    price: Float
    SKU: String
    categoryId: Int
    inventoryId: Int
    discountId: Int
    category: ProductCategory
    inventory: ProductInventory
    discount: Discount
    createdAt: String
    updatedAt: String
  }

  type Query {
    products: [Product!]!
    product(id: String!): Product
  }
`;
