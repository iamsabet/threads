import { Schema, models, model } from 'mongoose'
const threadSchema = new Schema({
    text: { type: String, required: true },
    repost: { // source thread._id 
        type: Schema.Types.ObjectId,
        ref: 'Tread'
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    community: {
        type: Schema.Types.ObjectId,
        ref: 'Community',
    },
    parentId: {
        type: Schema.Types.ObjectId,
        ref: 'Thread'
    },
    children: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Thread'
        }
    ],
    votes: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Vote'
        }
    ],
    votePoints: { type: Number, default: 0 }
}, { timestamps: true })

threadSchema.pre('save', async (doc) => {
    // console.log("saved " + this._id + " doc ")
})

const Thread = models.Thread || model('Thread', threadSchema)

export default Thread

// Oirignal Thread
//     -> Thread comment 1
//     -> Thread comment 2
//         -> Thread comment 3