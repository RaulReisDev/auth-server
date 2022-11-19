import mongoose from "mongoose";
import { config } from "dotenv";
config();

const databaseConnection = () => {
    mongoose.connect(`mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_SECRET}@${process.env.MONGODB_SERVER}/${process.env.MONGODB_DATABASE}`);

    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function() {
        console.log("connected to MongoDB")
    });
}

export default {
    databaseConnection
}