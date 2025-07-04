const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const { execFile } = require("child_process");
const path = require("path");
const axios = require("axios");
const fs = require("fs");
const fn = "./localSetting.json";
const updater = require("./updater.js");
// const url = "http://127.0.0.1:8000";
const url = "http://kostech.iptime.org:3944";
const url_default = url + "/trendnews/most";

function createWindow() {
  const window = new BrowserWindow({
    // x: 0,
    // y: 0,
    width: 800,
    height: 480,
    show: false,
    frame: false,
    fullscreen: true,
    titleBarStyle: "hidden",

    // titleBarOverlay: {
    // color: '#2f3241',
    // symbolColor: '#74b1be'
    // },
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  window.loadFile("display.html").then(() => {
    window.show();
  });

  updater();

  // default news
  window.webContents.on("did-finish-load", function () {
    var defaultSetting = readSetting();
    console.log(defaultSetting);
    timezoneUpdate(defaultSetting.timezone);
    userInfoUpdate(defaultSetting.user);
    if (defaultSetting.keyword.length >= 2)
      newsUpdate("/trendnewsKeyword/" + defaultSetting.keyword);
    else newsUpdate("/trendnews/" + defaultSetting.category);
  });

  // window.webContents.openDevTools();

  return window;
}

app.whenReady().then(() => {
  window = createWindow();

  // news update
  var now = new Date();
  let time = 1000 * 60 * 60;
  var start =
    time -
    (now.getMinutes() * 60 + now.getSeconds()) * 1000 +
    now.getMilliseconds();
  setInterval(function reload() {
    var defaultSetting = readSetting();
    console.log(defaultSetting);
    timezoneUpdate(defaultSetting.timezone);
    if (defaultSetting.keyword.length >= 2)
      newsUpdate("/trendnewsKeyword/" + defaultSetting.keyword);
    else newsUpdate("/trendnews/" + defaultSetting.category);
    setTimeout(reload, time);
  }, start);

  ipcMain.on("setting:save", (event, content) => {
    saveSetting(content);
    if (content.timezone) {
      timezoneUpdate(content.timezone);
    }
    if (content.category) {
      newsUpdate("/trendnews/" + content.category);
      content.keyword = "-";
      saveSetting(content);
    }
    if (content.keyword) {
      if (content.keyword === "-") {
        newsLoading();
        newsUpdate("/trendnews/" + readSetting().category);
      } else {
        newsLoading();
        newsUpdate("/trendnewsKeyword/" + content.keyword);
      }
    }
    if (content.user) {
      userInfoUpdate(content.user);
    }
  });

  ipcMain.on("setting:error", (event, content) => {
    if (content === "keyword") {
      dialog.showMessageBox(null, {
        type: "info",
        buttons: ["확인"],
        title: "저장 실패",
        message: "키워드의 길이가 짧습니다.",
        detail: "최소 2자를 입력하세요!",
      });
    }
  });

  ipcMain.handle("setting:change", (event, content) => {
    console.log(content);
    return apiRequest("/trendnews/" + content, "GET");
  });

  ipcMain.on("brightness:update", (event, content) => {
    execFile(
      "/home/user/set_brightness.sh",
      [content],
      function (error, stdout) {
        if (error !== null) {
          console.log(error);
        } else {
          console.log("brightness: " + stdout);
        }
      }
    );
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

function newsUpdate(url) {
  apiRequest(url, "GET").then((data) => {
    window.webContents.send("news:update", data);
  });
}

function newsLoading() {
  window.webContents.send("news:loading");
}

function timezoneUpdate(data) {
  window.webContents.send("timezone:update", data);
}

function userInfoUpdate(data) {
  if (data === "normal") {
    apiRequest("/welfare", "GET").then((data) => {
      window.webContents.send("welfare:update", data);
    });
  } else if (data === "student") {
    apiRequest("/stdnotice", "GET").then((data) => {
      window.webContents.send("stdnotice:update", data);
    });
  }
}

function apiRequest(param, method) {
  return axios(url + param, {
    method: method,
    raxConfig: {
      retry: 3,
      retryDelay: 4000,
    },
  })
    .then((res) => res.data)
    .catch((err) => {
      if (err.errno === -3001) {
        window.webContents.send("internet:disconnect");
      }
      if (err.response.status === 500) {
        console.log("ERROR: ", err.response.status, " redirecting...");
        newsUpdate("/trendnews/most");
      }
    });
}

function saveSetting(content, path = fn) {
  console.log("saving...");
  for (let i in content) {
    var data = readSetting();
    data[i] = content[i];
    fs.writeFileSync(path, JSON.stringify(data));
  }
  console.log(data);
  console.log("saved...");
}

function readSetting() {
  console.log("reading...");
  // if (isEmptyObject(JSON.parse(fs.readFileSync(fn, "utf8")))) {
  // }
  try {
    setting = JSON.parse(fs.readFileSync(fn, "utf8"));
  } catch {
    let defaultSetting = {
      timezone: "seoul",
      category: "most",
      keyword: "-",
      user: "student",
    };
    fs.writeFileSync(fn, JSON.stringify(defaultSetting));
    setting = JSON.parse(fs.readFileSync(fn, "utf8"));
  }
  return setting;
}
