const dotenv = require('dotenv')
dotenv.config();

const USERNAME = process.env.DB_USERNAME;
const PASSWORD = process.env.DB_PASSWORD;

const mongoose = require("mongoose");

mongoose.connect(`mongodb+srv://${USERNAME}:${PASSWORD}@cluster0.lclag3k.mongodb.net/userinput`)

const userSchema = mongoose.Schema({
    input: String,
    data: String,
})

const userInput = mongoose.model("userinput", userSchema);
module.exports = {
    userInput
}