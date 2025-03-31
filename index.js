import express from "express";
import http from "node:http";
import { createBareServer } from "@tomphttp/bare-server-node";
import cors from "cors";
import path from "node:path";
import chalk from "chalk";
import compression from 'compression';

const server = http.createServer();
const app = express(server);
const bareServer = createBareServer("/bare/");
const PORT = process.env.PORT || 8080;

// Enable compression
app.use(compression({
  level: 6, // 1-9 (9 slowest)
  threshold: 1024 // only responses above 1kb
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cors());

// caching
const cacheControl = (req, res, next) => {
  if (req.url.match(/\.(css|js|jpg|jpeg|png|gif|ico|woff2)$/)) {
    res.setHeader('Cache-Control', 'public, max-age=604800');
  } else {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  }
  next();
};

app.use(cacheControl);

app.get("/", (req, res) => {
  try {
    res.sendFile(path.join(process.cwd(), "/public/index.html"));
  } catch (err) {
    console.error('Error serving index:', err);
    res.status(500).send('Internal Server Error');
  }
});

app.get("/search", (req, res) => {
  try {
    res.sendFile(path.join(process.cwd(), "/public/search.html"));
  } catch (err) {
    console.error('Error serving search:', err);
    res.status(500).send('Internal Server Error');
  }
});

app.get("/a", (req, res) => {
  try {
    res.sendFile(path.join(process.cwd(), "/public/apps.html"));
  } catch (err) {
    console.error('Error serving apps:', err);
    res.status(500).send('Internal Server Error');
  }
});

app.get("/g", (req, res) => {
  try {
    res.sendFile(path.join(process.cwd(), "/public/games.html"));
  } catch (err) {
    console.error('Error serving games:', err);
    res.status(500).send('Internal Server Error');
  }
});

app.get("/404", (req, res) => {
  try {
    res.sendFile(path.join(process.cwd(), "/public/err/404.html"));
  } catch (err) {
    console.error('Error serving 404:', err);
    res.status(500).send('Internal Server Error');
  }
});

// error config (global)
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).send('Internal Server Error');
});

app.use((req, res) => {
  res.status(404).redirect("/404");
});

// optimization for requests
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
  var theme = chalk.hex("#b578ff");
  var host = chalk.hex("b578ff");
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

  if (
    process.env.CODESPACE_NAME &&
    process.env.GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN
  ) {
    console.log(
      `  ${chalk.bold(host("Github Codespaces:"))}           https://${process.env.CODESPACE_NAME}-${address.port === 80 ? "" : "" + address.port}.${process.env.GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN}`,
    );
  }
});

// optimization
server.listen({ 
  port: PORT,
  host: '0.0.0.0'
});

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

function shutdown() {
  console.log("SIGTERM signal received: closing HTTP server");
  server.close();
  bareServer.close();
  process.exit(0);
}
