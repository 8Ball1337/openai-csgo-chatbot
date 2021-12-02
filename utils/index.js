const config = require("../config.json");
const { generate } = require("./generate");

// Removes emojis, as CSGO does not support them and OpenAI sometimes returns them
const removeInvalidChars = (text) => {
  return text.replace(
    /([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g,
    ""
  );
};

const handleChatMessage = async (msg, connection, selfName) => {
  const namePart = msg.substr(0, msg.indexOf(" : "));
  const msgPart = msg.substring(msg.indexOf(" : ") + 3);

  if (namePart.includes(selfName)) {
    return;
  }

  const ignoreList = config.ignoreList;
  if (ignoreList.length > 0) {
    for (let i = 0; i < ignoreList.length; i++) {
      if (namePart.includes(ignoreList[i])) return;
    }
  }

  try {
    const res = await generate(msgPart);
    await connection.exec("say " + removeInvalidChars(res));
  } catch (error) {
    // We don't care about no response errors, because we use the socket connection directly for that info
  }
};

module.exports = { handleChatMessage };
