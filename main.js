"use strict";

const { app } = require("electron");
const { start, getLastWindow } = require("./index");

if (process.argv[3] === "true" || process.argv.length == 1) {
  // Lock
  const singlesInstanceLock = app.requestSingleInstanceLock();
  if (!singlesInstanceLock) {
    app.quit();
    return;
  }

  // Someone tried to run a second instance, we should focus our window.
  app.on("second-instance", (event, commandLine, workingDirectory) => {
    const lastWindow = getLastWindow()
    if (lastWindow) {
      if (lastWindow.isMinimized()) lastWindow.restore();
      lastWindow.show();
    }
  });
}

// Command line switches
let idx = 4;
for (let i = idx; i < process.argv.length; i++) {
  let s = process.argv[i].replace(/^[\-]+/g, "");
  let v;
  if (
    typeof process.argv[i + 1] !== "undefined" &&
    !process.argv[i + 1].startsWith("-")
  ) {
    v = process.argv[i + 1];
    i++;
  }
  app.commandLine.appendSwitch(s, v);
}

start();
