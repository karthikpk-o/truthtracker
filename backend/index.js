const express = require("express");
const { exec } = require("child_process");
const { inputSearch } = require("./types");
const { userInput } = require("./db");
const cors = require("cors");
const fs = require("fs");
const dotenv = require("dotenv");
const { GoogleGenerativeAI } = require("@google/generative-ai");

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());


//Function to verify whether input if fact or not
async function runFactCheck(para, statement) {
  try {
    // Get the API key from environment variable
    const API_KEY = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    
    if (!API_KEY) {
      throw new Error("API key is not provided.");
    }

    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const paragraph = para;
    const condition = "just refer the given paragraph and say if the given statement is True or false or Not sure and give a one line explanation ";
    const prompt = condition + " .paragraph:" + paragraph + " Statement:" + statement;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = await response.text();

    return text;
  } catch (error) {
    console.error("Fact-checking error:", error);
    throw new Error("Can't verify");
  }
}




//Routes
app.post("/search", async (req, res) => {
  let factcheck; // Declare factcheck outside the try block

  try {
    const createPayload = req.body;
    const parsedPayload = inputSearch.safeParse(createPayload);

    if (!parsedPayload.success) {
      res.status(411).json({
        msg: "You sent the wrong inputs",
      });
      return;
    }

    const pythonScript = "search.py";
    const tempFile = "temp_output.txt";

    // Wrap exec in a promise
    const executeScript = () => {
      return new Promise((resolve, reject) => {
        exec(`python3 ${pythonScript} "${createPayload.input}" > ${tempFile}`, (error, stdout, stderr) => {
          if (error) {
            console.error(`Error executing Python script: ${error}`);
            reject("Internal Server Error");
            return;
          }
          resolve(fs.readFileSync(tempFile, "utf-8").trim());
        });
      });
    };

    const pythonOutput = await executeScript();
    fs.unlinkSync(tempFile);

    // Assuming userInput.create returns a Promise
    await userInput.create({
      input: createPayload.input,
      data: pythonOutput,
    });

    // Move try-catch inside the main try block
    try {
      factcheck = await runFactCheck(pythonOutput, createPayload.input);
    } catch (error) {
      console.error("Fact-checking error:", error);
      res.status(500).send("Internal server error");
      return;
    }

    res.json({
      msg: "Input and Data received",
      factcheck: factcheck,
    });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
