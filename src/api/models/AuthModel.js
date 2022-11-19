import UsersSchema from "../schemas/UsersSchema.js";

const getUserByEmail = async (email) => {
    return await UsersSchema.find({ email });
}

const insertNewUser = async (Item) => {
    const query = new UsersSchema(Item);

    return await query.save();
}

const updateUserData = async (userUUID, Item) => {
    return await UsersSchema.updateOne({ uuid: userUUID }, Item);
}

export default {
    getUserByEmail,
    insertNewUser,
    updateUserData
}