#! /usr/bin/env node

"use strict";
var pjson = require("../package.json");
const path = require("path");
const cli = require("cli");
const uuidv4 = require("uuid").v4;

const options = cli.parse({
  file: ["f", "File to share", "file"],
  directory: ["d", "Directory to share", "dir"],
  port: ["p", "Network port to use", "int", 3000],
  subdomain: ["s", "Subdomain for your link", "string"],
  version: ["v", "dxit version number"],
  quota: ["q", "Max number of downloads", "int", -1],
  token: ["t", "Require token"]
});

if (options.version) {
  console.log();
  cli.info(`dxit version: ${pjson.version}`);
  process.exit(1);
}

if (!options.file && !options.directory) {
  cli.fatal("Specify a --file or --directory");
}
const token = uuidv4();

let hits = 0;
(async function () {
  const express = require("express");
  const morgan = require("morgan");
  const app = express();
  app.use(morgan("short"));

  app.get("*", function (req, res, next) {
    if (options.token) {
      if (req.query.token == token) {
        next();
      } else {
        res.sendStatus(401);
      }
    } else {
      next();
    }
  });

  if (options.file) {
    app.get("/", function (req, res) {
      if (options.quota > 0) {
        if (hits >= options.quota) {
          cli.info(`Quota Reached: Downloaded ${hits} time(s)`);
          res.sendStatus(401);
        } else {
          hits = hits + 1;
          res.sendFile(path.resolve(options.file));
        }
      } else {
        res.sendFile(path.resolve(options.file));
      }
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
    cli.info(
      `Locally: http://localhost:${options.port}/${
        options.token ? `?token=${token}` : ""
      }`
    );
    cli.info(`Publicly: ${tunnel.url}/${options.token ? `?token=${token}` : ""}`);
  });
})();
