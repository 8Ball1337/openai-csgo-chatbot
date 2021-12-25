const config = require("./config.json");
const Telnet = require("telnet-client");
const { handleChatMessage } = require("./utils");
const RETRY_TIMEOUT = 10 * 1000;

let selfName = "";

async function run() {
  const connection = new Telnet();

  const params = {
    host: "127.0.0.1",
    port: config.port,
    negotiationMandatory: false,
    timeout: 1500,
  };

  try {
    await connection.connect(params);
  } catch (e) {
    console.log(
      `Error: Unable to connect to ${params.host}:${params.port}.\nMake sure that "-netconport ${params.port}" is added to the CS:GO launch options and that the game is running.\nRetrying in 10 seconds...`
    );
    setTimeout(() => {
      run();
    }, RETRY_TIMEOUT);
    return;
  }

  const socket = connection.getSocket();

  socket.on("data", (data) => {
    const msg = data.toString("utf8");

    if (msg.includes(" : ")) {
      if (config.teamChatDisabled && msg.includes(") ") && msg.includes("(")) {
        return;
      }
      handleChatMessage(msg, connection, selfName);
      return;
    }

    if (msg.startsWith('"name" =')) {
      let name = msg.substring(msg.indexOf('= "') + 3);
      selfName = name.substring(0, name.indexOf('"'));
      console.log("Detected username: " + selfName);
      return;
    }

    if (msg.startsWith(`* ${selfName} changed name`)) {
      selfName = msg.substring(msg.indexOf("name to ") + 8);
      console.log("Updated username to: " + selfName);
      return;
    }
  });

  socket.on("close", (data) => {
    console.log("Connection closed. Retrying in 10 seconds...");
    setTimeout(() => {
      run();
    }, RETRY_TIMEOUT);
  });

  try {
    await connection.exec("name");
  } catch (error) {
    // We don't care about no response errors, because we use the socket connection directly for that info
  }
}

run();
