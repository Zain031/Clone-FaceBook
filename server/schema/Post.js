const { GraphQLError } = require('graphql')
const Post = require('../models/Post')
const { ObjectId } = require('mongodb')




const typeDefs = `#graphql

    type Post {
        _id: ID
        content: String
        tags: [String]
        imgUrl: String
        authorId: ID
        comments: [Comments]
        likes: [Likes]
        createdAt: String
        updatedAt: String
    }

    type PostAuthor {
        _id: ID
        content: String
        tags: [String]
        imgUrl: String
        authorId: ID
        author: [User]
        comments: [Comments]
        likes: [Likes]
        createdAt: String
        updatedAt: String
    }

    type User {
        _id: ID
        name: String
        username: String
        email: String
        password: String
        profileImgUrl: String
    }

    type Comments {
        content: String
        username: String
        profileImgUrl: String
        createdAt: String
        updatedAt: String
    }

    type Likes {
        username: String
        createdAt: String
        updatedAt: String
    }

    type Follow {
        _id: ID
        followingId: ID
        followerId: ID
        createdAt: String
        updatedAt: String
    }

    type Query {
        posts: [Post]
        getPostById(_id: ID!): [PostAuthor]
    }

    type Mutation {
        addPost(content: String!, tags: [String], imgUrl: String!): Post
        commentPost(content: String!, _id: ID): Post
        likePost(_id: ID!): Post
    }
`


const resolvers = {
  Query: {
      posts: async (_, args, contextValue) => {
          try {
              const payload = await contextValue.authentication()           
              if(postCache){
                  const postData = JSON.parse(postCache)
                  return postData
              }
              const post = await  Post.findAll()
              console.log(post);
 
              return post

          } catch (error) {
              if(error.name === "JsonWebTokenError"){
                  throw new GraphQLError(error.message, {
                      extensions: {code: "Not Authorization"}
                  })
              }
              throw error
          }
      },

      getPostById: async (_, args, contextValue) => {
          try {
              const payload = contextValue.authentication()
              const {_id} = args

              const post = await Post.findById(_id)
              return post

          } catch (error) {
              if(error.name === "JsonWebTokenError"){
                  throw new GraphQLError(error.message, {
                      extensions: {code:  "Not Authorization"}
                  })
              }
              throw error
          }
      }
  },

  Mutation: {
      addPost: async (_, args, contextValue) => {
          try {
              const payload = await contextValue.authentication()
              const {content, imgUrl, tags} = args

              const post = await Post.create(payload, content, imgUrl, tags)
           
              
              console.log(post);
              
              return post

          } catch (error) {
              if(error.name === "JsonWebTokenError"){
                  throw new GraphQLError(error.message, {
                      extensions: {code:  "Not Authorization"}
                  })
              }
              throw error
          }
      },
      commentPost: async (_, args, contextValue) => {
          try {
              const payload = await contextValue.authentication()
              const {_id, content} = args

              const post = await Post.commentPost(payload, _id, content)
              // console.log(post.comments);

              return post

          } catch (error) {
              if(error.name === "JsonWebTokenError"){
                  throw new GraphQLError(error.message, {
                      extensions: {code:  "Not Authorization"}
                  })
              }
              throw error
          }
      },
      likePost: async (_, args, contextValue) => {
          try {
              const payload = await contextValue.authentication()
              const {_id} = args

              //Get Post by the Id
              const currentPost = await Post.findById(_id)

              //Checks if user already like the post
              const hasLikedPost = currentPost[0].likes.some((user) => user.username === payload.username)

              if(hasLikedPost){
                  throw new GraphQLError("you already like this post", {
                      extensions: {code: "Bad request"}
                  })
              }
  
              const post = await Post.likePost(payload, _id)
              await redis.del("posts:all")
              return post

          } catch (error) {
              if(error.name === "JsonWebTokenError"){
                  throw new GraphQLError(error.message, {
                      extensions: {code: " Not Authorization"}
                  })
              }
              throw error
          }
      }
  }
}

module.exports = { typeDefs, resolvers }


