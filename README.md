# ChatBot App

A simple React Native chat application powered by OpenAI's GPT-3.5-turbo API. This app uses a Node.js proxy server to handle API requests securely.

## Features

- Real-time chat interface
- Secure API calls through a local proxy server
- Error handling with detailed messages
- Loading states and UI feedback

## Installation

Clone the repository and install dependencies:

```bash
git clone <your-repo-url>
cd chatbotapp
npm install
```

## Configuration

⚠️ **IMPORTANT: API KEY SECURITY** ⚠️

The application requires an OpenAI API key to function. For security:

1. Create a `.env` file in the root directory
2. Add your OpenAI API key:
   ```
   OPENAI_API_KEY=your_api_key_here
   ```
3. **NEVER hardcode API keys directly** in any of your JavaScript files
4. The `.env` file is included in `.gitignore` to prevent accidental commits of your secret key

The server will check for the API key in your `.env` file, and will not work without it.

## Usage

### Running the app

This project is configured to run both the proxy server and Expo development server with a single command:

```bash
npm start
```

This will:

1. Start the Node.js proxy server on port 3000
2. Start the Expo development server

You can also run them separately if needed:

```bash
# Just the proxy server
npm run server

# Just the Expo app
npm run app
```

### Using the app with a physical device

If you're testing on a physical device, you'll need to update the API_URL in App.js to point to your computer's IP address instead of localhost:

```js
// Change this line in App.js
const API_URL = "http://YOUR_COMPUTERS_IP:3000/api/chat";
```

To find your computer's IP address:

- On Windows: Run `ipconfig` in Command Prompt
- On macOS/Linux: Run `ifconfig` or `ip addr show` in Terminal

## Development

### Project Structure

- `App.js`: Main React Native application
- `server.js`: Express server that proxies requests to OpenAI API
- `package.json`: Project dependencies and scripts

### How it Works

1. User inputs a message in the app
2. The message is sent to the local proxy server
3. The proxy server forwards the request to OpenAI's API
4. The response from OpenAI is returned to the app
5. The app displays the AI's response in the chat

## Troubleshooting

- If you see "Connection Error" messages, make sure your server is running
- Check that your API key is valid and has sufficient credits
- If testing on a physical device, ensure you're using the correct IP address for API_URL

## License

[MIT](LICENSE)
