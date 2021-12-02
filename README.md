# OpenAI CS:GO Chat Bot

Chatbot for CS:GO that reads the console over telnet and replies to messages by other players using OpenAI GPT-3 generated messages.

**Note**: You can't get banned for using this Bot, but sometimes OpenAI returns insults (so be careful on FaceIt)

## Setup

    git clone https://github.com/8Ball1337/openai-csgo-chatbot
    cd openai-csgo-chatbot
    npm install

Add the following to the CS:GO launch options:

    -netconport 2121

Add your OpenAI API Key and FaceIt username to config.json.

Run the node app:

    node index.js
