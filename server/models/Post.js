const { ObjectId } = require('mongodb')
const database = require('../config/mongodb')

class Post {
    static getCollection() {
        return database.collection('Post')
    }

    static async findAll() { //agregat
        const posts = Post.getCollection().find({}).toArray()
        return posts
    }

    static async findById(_id) {
        const post = Post.getCollection().aggregate([
            {
              '$match': {
                '_id': new ObjectId(String(_id))
              }
            }, {
              '$lookup': {
                'from': 'users', 
                'localField': 'authorId', 
                'foreignField': '_id', 
                'as': 'author'
              }
            }, {
              '$project': {
                'author.password': 0
              }
            }
          ]).toArray()

        return post
    }
   
    static async create(payload, content, imgUrl, tags){
        const post = await Post.getCollection().insertOne({
            content: content,
            tags: tags,
            imgUrl: imgUrl,
            authorId: new ObjectId(String(payload._id)),
            likes: [],
            comments: [],
            createdAt: new Date(),
            updatedAt: new Date()
        })

        const result = await Post.getCollection().findOne({
            _id: post.insertedId
        })

        return result
    }
    static async commentPost(payload, _id, content){
        const updatePost = await Post.getCollection().updateOne(
            {_id: new ObjectId(String(_id))},
            {$push: {
                comments: {
                        username: payload.username,
                        profileImgUrl: payload.profileImgUrl,
                        content: content,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    }
                }   
            }
        )
        const result = await Post.getCollection().findOne({_id: new ObjectId(String(_id))})
        console.log(result);
        return result
    }

    static async likePost(payload, _id){
        const likedPost = await Post.getCollection().updateOne(
            {_id: new ObjectId(String(_id))},
            {$push: {
                likes: {
                    username: payload.username,
                    createdAt: new Date(),
                    updatedAt: new Date()
                }
            }}
        )
        const result = await Post.getCollection().findOne({_id: new ObjectId(String(_id))})
        return result
    }
}

module.exports = Post