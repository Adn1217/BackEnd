import {buildSchema} from 'graphql';

export const schema = buildSchema(`
    type Product {
        id: ID!,
        code: String,
        description: String,
        price: Float,
        stock: Int,
        thumbnail: String,
        timestamp: Float,
        title: String
    }    
    input ProductInput {
        code: String,
        description: String,
        price: Float,
        stock: Int,
        thumbnail: String,
        timestamp: Float,
        title: String
    }    
    type Query {
        getProduct(id: ID!): Product,
        getProducts:[Product]
    }
    type Mutation {
        saveProduct(data: ProductInput): Product,
        updateProduct(id: ID!, data: ProductInput): Product,
        deleteProduct(id: ID!): Product
    }
`)

export function getProducts(){

}

export function getProduct(id){

}

export function saveProduct(data){

}

export function updateProduct(data){

}

export function deleteProduct(data){
    
}