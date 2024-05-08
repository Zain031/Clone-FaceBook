const {
    GraphQLError
} = require('graphql')
const {
    hashPassword,
    comparePassword
} = require('../helpers/bcrypt')
const {
    signToken
} = require('../helpers/jwt')
const User = require('../models/User')

const typeDefs = `#graphql
    type User {
        _id: ID
        name: String
        username: String
        email: String
        password: String
        profileImgUrl: String
    }


    type UserFollow {
        _id: ID
        name: String
        username: String
        email: String
        password: String
        profileImgUrl: String
        following: [Follow]
        userFollowing: [User]
        follower: [Follow]
        userFollower: [User]
    }

    type Follow {
        _id: ID
        followingId: ID
        followerId: ID
        createdAt: String
        updatedAt: String
    }

    type Token {
        accessToken: String
    }

    type Query {
        users: [User]
        getUserById(_id: ID!): [UserFollow]
        searchUser(search: String): [User]
        loggedUser: [UserFollow]
    }

    type Mutation {
        login(email: String!, password: String!): Token
        register(name: String, username: String, email: String, password: String, profileImgUrl: String): User
    }
`

const resolvers = {
    Query: {
        users: async () => {
            try {
                const users = await User.findAll()
                return users

            } catch (error) {
                throw error
            }
        },

        getUserById: async (_, args) => {
            try {
                const _id = args._id
                const user = await User.findById(_id)

                return user

            } catch (error) {
                throw error
            }
        },

        searchUser: async (_, args, contextValue) => {
            try {
                const payload = await contextValue.authentication()
                const {
                    search
                } = args

                const userSearch = await User.search(search)

                return userSearch

            } catch (error) {
                if (error.name === "JsonWebTokenError") {
                    throw new GraphQLError(error.message, {
                        extensions: {
                            code: "Not Authorization"
                        }
                    })
                }
                throw error
            }
        },

        loggedUser: async (_, args, contextValue) => {
            try {
                const payload = await contextValue.authentication()

                const currentUser = await User.findById(payload._id)
                return currentUser

            } catch (error) {
                if (error.name === "JsonWebTokenError") {
                    throw new GraphQLError(error.message, {
                        extensions: {
                            code: "Not Authorization"
                        }
                    })
                }
                throw error
            }
        }
    },

    Mutation: {
        register: async (_, args) => {
            try {
                let {
                    name,
                    username,
                    email,
                    password,
                    profileImgUrl
                } = args

                if (!name) {
                    throw new GraphQLError("Name is required", {
                        extensions: {
                            code: "Not Authorization"
                        }
                    })
                }

                if (!username) {
                    throw new GraphQLError("Username is required", {
                        extensions: {
                            code: "Not Authorization"
                        }
                    })
                }

                if (!password) {
                    throw new GraphQLError("Password is required", {
                        extensions: {
                            code: "Not Authorization"
                        }
                    })
                }

                if (!email) {
                    throw new GraphQLError("Email is required", {
                        extensions: {
                            code: "Not Authorization"
                        }
                    })
                }

                if (!profileImgUrl) {
                    throw new GraphQLError("Profile Image is required", {
                        extensions: {
                            code: "Not Authorization"
                        }
                    })
                }

                const userFound = await User.findUser(email)

                if (userFound) {
                    throw new GraphQLError("Email is already registered", {
                        extensions: {
                            code: "Not Authorization"
                        }
                    })
                }

                const user = {
                    name,
                    username,
                    email,
                    password,
                    profileImgUrl
                }

                user.password = hashPassword(user.password)
                let result = await User.addUser(user)
                console.log(result);

                return result

            } catch (error) {
                throw error
            }
        },


        login: async (_, args) => {
            try {
                const {
                    email,
                    password
                } = args

                const userFound = await User.findUser(email)

                if (!userFound) {
                    throw new GraphQLError("Email is not registered", {
                        extensions: {
                            code: "Not Authorization"
                        }
                    })
                }
                const validatePassword = comparePassword(password, userFound.password)

                if (!validatePassword) {
                    throw new GraphQLError("Password is not correct", {
                        extensions: {
                            code: "Not Authorization"
                        }
                    })
                }

                const payload = {
                    _id: userFound._id,
                    email: userFound.email,
                    username: userFound.username,
                    profileImgUrl: userFound.profileImgUrl
                }

                const token = signToken(payload)

                return {
                    accessToken: token
                }

            } catch (error) {
                throw error
            }
        }
    }
}

module.exports = {
    typeDefs,
    resolvers
}