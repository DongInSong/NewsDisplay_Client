// Import the necessary Electron components.
const contextBridge = require("electron").contextBridge;
const ipcRenderer = require("electron").ipcRenderer;

const ipc = {
  render: {
    // From render to main.
    send: ["setting:save", "brightness:update", "setting:error"],
    // From main to render.
    receive: [
      "internet:disconnect",
      "news:update",
      "news:loading",
      "timezone:update",
      "stdnotice:update",
      "welfare:update",
    ],
    // From render to main and back again.
    sendReceive: ["setting:change"],
  },
};

contextBridge.exposeInMainWorld(
  "ipcRender",
  {
    send: (channel, args) => {
      let validChannels = ipc.render.send;
      if (validChannels.includes(channel)) {
        ipcRenderer.send(channel, args);
      }
    },
    receive: (channel, listener) => {
      let validChannels = ipc.render.receive;
      if (validChannels.includes(channel)) {
        ipcRenderer.on(channel, (event, ...args) => listener(...args));
      }
    },
    invoke: (channel, args) => {
      let validChannels = ipc.render.sendReceive;
      if (validChannels.includes(channel)) {
        return ipcRenderer.invoke(channel, args);
      }
    },
  }
);
