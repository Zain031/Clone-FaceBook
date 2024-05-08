
const { GraphQLError } = require('graphql')
const Follow = require("../models/Follow")

const typeDefs = `#graphql
    type Follow {
        _id: ID
        followingId: ID
        followerId: ID
        createdAt: String
        updatedAt: String
    }

    type Mutation {
        follow(followingId: ID): Follow
    }
`
const resolvers = {
    Mutation: {
        follow: async (_, args, contextValue) => {
            try {
                const payload = await contextValue.authentication()
                const { followingId } = args

                if(followingId === payload._id){
                    throw new GraphQLError("Cannot Follow Yourself", {
                        extensions: {code: "Not Autheticated"}
                    })
                }
                const hasFollow = await Follow.getFollowDetail(followingId, payload._id)              
                if(hasFollow){
                    throw new GraphQLError("Already Followed This Account", {
                            extensions: {code: "Bad request"}
                    })
                }
                const followUser = await Follow.addFollow(payload, followingId)
                return followUser
            } catch (error) {
                if(error.name === "JsonWebTokenError"){
                    throw new GraphQLError(error.message, {
                        extensions: {code:  "Not Authorization"}
                    })
                }
                throw error
            }
        }
    }
}

module.exports = { typeDefs, resolvers }