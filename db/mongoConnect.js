const { configs } = require("../configs/secrets");

//using mongo db
const mongoose = require("mongoose");


main().catch(err => console.log(err));

async function main() {
    // to ignore the warning in the terminal
    mongoose.set('strictQuery', false);
    // for windows 11
    await mongoose.connect(configs.db_url);
    console.log("mongo connect Final Project DB!");
}