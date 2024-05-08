if ( process.env.NODE_ENV !== "production") {
  require('dotenv').config()
}

const { verifyToken } = require('./helpers/jwt')//jwt

const { ApolloServer } = require('@apollo/server')//apolo
const { startStandaloneServer } = require('@apollo/server/standalone')//dari apolo


const { typeDefs: typeDefsUser, resolvers: resolversUser } = require('./schema/User')//dari schema follow
const { typeDefs: typeDefsPost, resolvers: resolversPost} = require('./schema/Post')//dari schema follow
const { typeDefs: typeDefsFollow, resolvers: resolversFollow } = require('./schema/Follow')//dari schema follow


const { GraphQLError } = require("graphql")//graphQl erors

//masukin typeDefs dan resolvers
const server = new ApolloServer({
  typeDefs: [typeDefsUser, typeDefsPost, typeDefsFollow],
  resolvers: [resolversUser, resolversPost, resolversFollow],
  introspection: true
})


startStandaloneServer(server, {
  listen: {port: process.env.PORT || 8080},
  context: async ({req, res}) => {
      return {
          authentication: async () => {
              const access_token = req.headers.authorization
              if(!access_token){
                  throw new GraphQLError("Access Token must be provided", {
                      extensions: {code: "UNAUTHENTICATED"}
                  })
              }
              const token = access_token.split(" ")[1]
              const payload = verifyToken(token)
              return payload
          }
      }
  }
})

  .then(result => {
      console.log("Connection Success" + result.url);
  })
  .catch(error => {
      console.log(error);
  })