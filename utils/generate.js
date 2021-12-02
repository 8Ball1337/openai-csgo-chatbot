const config = require("../config.json");
const got = require("got");

let prompts = [];

const storePrompt = (prompt) => {
  if (prompts.length >= [config.memoriesAmount]) {
    prompts.shift();
  }
  prompts.push(prompt);
};

const generate = (inPrompt) => {
  return new Promise(async (resolve, reject) => {
    let stop = ["\n"];
    let prompt = "Person: " + inPrompt.replace("\r", "").replace("\n", "");
    let personalityName = "Friend"

    if (config.memoriesEnabled) {
      storePrompt(prompt);
      prompt = prompts.join("\n");
    }

    if (config.personalityEnabled) {
      prompt = config.personality + prompt;
      personalityName = config.personalityName;
      stop = ["\n\nPerson", `\n\n${personalityName}`];
    }

    prompt = prompt + `\n${personalityName}:`;

    const url = "https://api.openai.com/v1/engines/davinci/completions";

    const params = {
      prompt: prompt,
      temperature: config.temperature,
      max_tokens: config.max_tokens,
      top_p: config.top_p,
      frequency_penalty: config.frequency_penalty,
      presence_penalty: config.presence_penalty,
      stop: stop,
    };
    const headers = {
      Authorization: `Bearer ${config.apiKey}`,
    };

    const response = await got
      .post(url, { json: params, headers: headers })
      .json();

    output = response.choices[0].text.trim();

    if (!output) {
      return;
    }

    if (config.memoriesEnabled) {
      storePrompt(`${personalityName}: ${output}\n`);
    }

    console.log("AI: " + output);

    resolve(output);
  });
};

module.exports = { generate };
