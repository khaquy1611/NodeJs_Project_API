import mongoose from "mongoose";


async function main() {
    await mongoose.connect(`${process.env.MONGODB_URL}/${process.env.DB_NAME}`);
}


export const connect = {
    main,
};