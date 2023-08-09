import mongoose from 'mongoose'

let isConnected = false

const connectToDb = async () => {
    // to prevent unknown field queries
    mongoose.set('strictQuery', true);

    if (!process.env.MONGODB_URL) {
        return console.error("MongoDb URL not found")
    }
    if (isConnected) {
        // console.error("Already connected to MongoDb")
        return
    }
    try {
        // console.log(process.env.MONGODB_URL);
        await mongoose.connect(process.env.MONGODB_URL)
        isConnected = true
        return console.log("Connected to MongoDb")

    } catch (e) {
        return console.error(e)

    }

}

export { connectToDb }