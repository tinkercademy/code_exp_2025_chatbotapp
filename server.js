const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Get API key from environment variables - NO HARDCODED KEYS
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// Check if API key exists
if (!OPENAI_API_KEY) {
  console.error(
    "ERROR: OpenAI API key not found! Set OPENAI_API_KEY in .env file"
  );
  console.error(
    "The server will start but API calls will fail without a valid key"
  );
}

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: OPENAI_API_KEY
});

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get("/", (req, res) => {
  res.send("OpenAI Proxy Server is running");
});

// Proxy endpoint for chat completions
app.post("/api/chat", async (req, res) => {
  try {
    if (!OPENAI_API_KEY) {
      return res.status(500).json({
        error:
          "OpenAI API key not configured. Please set OPENAI_API_KEY in .env file."
      });
    }

    const { messages, model = "gpt-3.5-turbo", max_tokens = 1000 } = req.body;

    console.log("Request received:", { model, messages: messages.length });

    const completion = await openai.chat.completions.create({
      model,
      messages,
      max_tokens
    });

    console.log("Response received from OpenAI");
    res.json(completion);
  } catch (error) {
    console.error("Error calling OpenAI:", error.message);
    res.status(500).json({
      error: error.message,
      details: error.response ? error.response.data : null
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
