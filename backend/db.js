const dotenv = require('dotenv')
dotenv.config();

const USERNAME = process.env.DB_USERNAME;
const PASSWORD = process.env.DB_PASSWORD;

const mongoose = require("mongoose");

mongoose.connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.r5zry.mongodb.net/`)

const userSchema = mongoose.Schema({
    input: String,
    data: String,
})

const userInput = mongoose.model("userinput", userSchema);
module.exports = {
    userInput
}