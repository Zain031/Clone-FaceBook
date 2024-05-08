const { ObjectId } = require("mongodb")
const database = require("../config/mongodb")
class Follow {
    static getCollection(){
        return database.collection('Follow')
    }

    static async addFollow(payload, followingId){
        const follow = await Follow.getCollection().insertOne({
            followingId: new ObjectId(String(followingId)),
            followerId: new ObjectId(String(payload._id)),
            createdAt: new Date(),
            updatedAt: new Date()
        })

        const result = await Follow.getCollection().findOne({
            _id: follow.insertedId
        })

        return result
    }

    static async getFollowDetail(followingId, followerId){
        const follow = await Follow.getCollection().findOne({
            followingId: new ObjectId(String(followingId)),
            followerId: new ObjectId(String(followerId))
        })

        return follow
    }
}

module.exports = Follow