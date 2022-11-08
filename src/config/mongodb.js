import mongoose from "mongoose";

const databaseConnection = () => {
    mongoose.connect("mongodb+srv://raulreis:GK1aDJeCRlMEa8p6@authserver.i2aprrc.mongodb.net/auth-server-dev");

    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function() {
        console.log("connected to MongoDB")
    });
}

export default {
    databaseConnection
}