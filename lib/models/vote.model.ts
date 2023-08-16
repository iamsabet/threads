import mongoose from 'mongoose'
const voteSchema = new mongoose.Schema({
    type: {
        type: String,
        validate: {
            validator: (value: string) => {
                return ["down", "up", ""].includes(value);
            },
            message: 'Invalid type value / only ["down", "up", ""] are allowed'
        }
    },
    voter: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    },
    thread: {
        type: mongoose.Types.ObjectId,
        ref: 'Thread'
    },
}, { timestamps: true })

voteSchema.pre('save', async (doc) => {
    // console.log("saved " + this._id + " doc ")
})

const Vote = mongoose.models.Vote || mongoose.model('Vote', voteSchema)

export default Vote
