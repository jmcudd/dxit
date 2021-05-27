#! /usr/bin/env node

"use strict";
var pjson = require("../package.json");
const path = require("path");
const cli = require("cli");

const options = cli.parse({
  file: ["f", "File to share", "file"],
  directory: ["d", "Directory to share", "dir"],
  port: ["p", "Network port to use", "int", 3000],
  subdomain: ["s", "Subdomain for your link", "string"],
  version: ["v", "dxit version number"]
});

if (options.version) {
  console.log();
  cli.info(`dxit version: ${pjson.version}`);
  process.exit(1)
}

if (!options.file && !options.directory) {
  cli.fatal("Specify a --file or --directory");
}
(async function () {
  const express = require("express");
  const morgan = require("morgan");
  const app = express();
  app.use(morgan("short"));

  if (options.file) {
    app.get("/", function (req, res) {
      res.sendFile(path.resolve(options.file));
    });
  } else if (options.directory) {
    const serveIndex = require("serve-index");
    app.use(express.static(path.resolve(options.directory)));
    app.use("/", serveIndex(path.resolve(options.directory)));
  }

  const localtunnel = require("localtunnel");
  const tunnel = await localtunnel({
    port: options.port,
    subdomain: options.subdomain || "dxit"
  });

  app.listen(options.port, function () {
    cli.info(`Server is running:`);
    cli.info(`Locally: http://localhost:${options.port}`);
    cli.info(`Publicly: ${tunnel.url}`);
  });
})();
