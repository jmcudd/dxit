#! /usr/bin/env node
console.log("running program");
const path = require("path");
const ngrok = require("ngrok");
const cli = require("cli");

const options = cli.parse({
  file: ["f", "File to share", "file"],
  directory: ["d", "Directory to share", "dir"],
  port: ["p", "Network port to use", "int", 3000]
});

if (!options.file && !options.directory) {
  cli.fatal("Specify a --file or --directory");
}
(async function () {
  const url = await ngrok.connect({ port: options.port });

  const express = require("express");
  const app = express();
  if (options.file) {
    app.get("/", function (req, res) {
      res.sendFile(path.resolve(options.file));
    });
  } else if (options.directory) {
    const serveIndex = require("serve-index");
    app.use(express.static(path.resolve(options.directory)));
    app.use("/", serveIndex(path.resolve(options.directory)));
  }

  app.listen(options.port, function () {
    cli.info(`Server is running`);
    cli.info(`Monitor: http://127.0.0.1:4040/inspect/http`);
    cli.info(`Locally: http://localhost:${options.port}`);
    cli.info(`Publicly: ${url}`);
  });
})();
