const { ObjectId } = require('mongodb')
const database = require('../config/mongodb')

class User{

    static getCollection(){
        return database.collection('User')
    }

    static async findAll() {
        const users = await User.getCollection().find({}).toArray()
        return users
    }
   
    static async findById(id) {
      const userById = await User.getCollection().aggregate([
          {
            '$match': {
              '_id': new ObjectId(String(id))
            }
          }, {
            '$lookup': {
              'from': 'follow', 
              'localField': '_id', 
              'foreignField': 'followerId', 
              'as': 'following'
            }
          }, {
            '$lookup': {
              'from': 'users', 
              'localField': 'following.followingId', 
              'foreignField': '_id', 
              'as': 'userFollowing'
            }
          }, {
            '$lookup': {
              'from': 'follow', 
              'localField': '_id', 
              'foreignField': 'followingId', 
              'as': 'follower'
            }
          }, {
            '$lookup': {
              'from': 'users', 
              'localField': 'follower.followerId', 
              'foreignField': '_id', 
              'as': 'userFollower'
            }
          }, {
            '$project': {
              'password': 0, 
              'userFollowing.password': 0, 
              'userFollower.password': 0
            }
          }
        ]).toArray()

        return userById
  }
    static async addUser(args){
      let {name, username, email, password, profileImgUrl} = args
      const user = await User.getCollection().insertOne({name, username, email, password, profileImgUrl})
      return {
          _id: user.insertedId,
          ...args
      }
  }
  static async findUser(email) {
      const user = await User.getCollection().findOne({
          email: email
      })

      return user
  }
  static async search(search){
      const user = await User.getCollection().find({
          $or: [
              {name: {$regex: search, $options: 'i'}},
              {username: {$regex: search, $options: 'i'}}
          ]
      }).toArray()

      return user
  }

}

module.exports = User