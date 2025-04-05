import express from "express";
import http from "node:http";
import { createBareServer } from "@tomphttp/bare-server-node";
import cors from "cors";
import path from "node:path";
import { hostname } from "node:os";
import chalk from "chalk";

const server = http.createServer();
const app = express(server);
const __dirname = process.cwd();
const bareServer = createBareServer("/bare/");
const PORT = process.env.PORT || 8080;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.static(__dirname + "/public", {
  maxAge: '1h',
  etag: true,
  lastModified: true
}));
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.get("/", (req, res) => {
  res.sendFile(path.join(process.cwd(), "/public/index.html"));
});

app.get("/search", (req, res) => {
  res.sendFile(path.join(process.cwd(), "/public/search.html"));
});

app.get("/a", (req, res) => {
  res.sendFile(path.join(process.cwd(), "/public/apps.html"));
});

app.get("/g", (req, res) => {
  res.sendFile(path.join(process.cwd(), "/public/games.html"));
});

app.get("/settings", (req, res) => {
  res.sendFile(path.join(process.cwd(), "/public/settings/general.html"));
});

app.get("/settings/general", (req, res) => {
  res.sendFile(path.join(process.cwd(), "/public/settings/general.html"));
});

app.get("/404", (req, res) => {
  res.sendFile(path.join(process.cwd(), "/public/err/404.html"));
});

app.use((req, res, next) => {
  res.status(404).redirect("/404");
});

server.on("request", (req, res) => {
  if (bareServer.shouldRoute(req)) {
    bareServer.routeRequest(req, res);
  } else {
    app(req, res);
  }
});

server.on("upgrade", (req, socket, head) => {
  if (bareServer.shouldRoute(req)) {
    bareServer.routeUpgrade(req, socket, head);
  } else {
    socket.end();
  }
});

server.on("listening", () => {
  const address = server.address();
  const theme = chalk.hex("#b578ff");
  const host = chalk.hex("b578ff");

  console.log(`Listening to ${chalk.bold(theme("Ambient"))} on:`);

  console.log(
    `  ${chalk.bold(host("Local System:"))}            http://${address.family === "IPv6" ? `[${address.address}]` : address.address}${address.port === 80 ? "" : ":" + chalk.bold(address.port)}`,
  );

  console.log(
    `  ${chalk.bold(host("Local System:"))}            http://localhost${address.port === 8080 ? "" : ":" + chalk.bold(address.port)}`,
  );

  try {
    console.log(
      `  ${chalk.bold(host("On Your Network:"))}  http://${address.ip()}${address.port === 8080 ? "" : ":" + chalk.bold(address.port)}`,
    );
  } catch (err) { }

  if (process.env.REPL_SLUG && process.env.REPL_OWNER) {
    console.log(
      `  ${chalk.bold(host("Replit:"))}           https://${process.env.REPL_SLUG}.${process.env.REPL_OWNER}.repl.co`,
    );
  }

  if (process.env.HOSTNAME && process.env.GITPOD_WORKSPACE_CLUSTER_HOST) {
    console.log(
      `  ${chalk.bold(host("Gitpod:"))}           https://${PORT}-${process.env.HOSTNAME}.${process.env.GITPOD_WORKSPACE_CLUSTER_HOST}`,
    );
  }

  if (process.env.CODESPACE_NAME && process.env.GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN) {
    console.log(
      `  ${chalk.bold(host("Github Codespaces:"))}           https://${process.env.CODESPACE_NAME}-${address.port === 80 ? "" : "" + address.port}.${process.env.GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN}`,
    );
  }
});

server.listen({
  port: PORT,
  backlog: 100
});

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

function shutdown() {
  console.log("SIGTERM signal received: closing HTTP server");
  server.close(() => {
    bareServer.close();
    process.exit(0);
  });
}
