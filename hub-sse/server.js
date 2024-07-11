const express = require("express");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const serverCredentials = process.env.ALLOWED_CLIENTS.split(/, ?/);
const subscribers = {};

function checkServerAuth(req, res, next) {
  const header = req.headers.Authorization ?? req.headers.authorization;
  if (!header) return res.sendStatus(401);
  const [type, token] = header.split(" ");
  if (type !== "Bearer") return res.sendStatus(401);
  if (!serverCredentials.includes(token)) return res.sendStatus(401);
  next();
}

/**
 * Event format
 *
 * {
 *  destination: String,
 *  type: String,
 *  data: Object
 * }
 */
app.post("/events", checkServerAuth, (req, res, next) => {
  let errors = {};
  if (!req.body.destination) {
    errors.destination = "Must not be empty";
  } else if (typeof req.body.destination !== "string") {
    errors.destination = "Must be a string";
  }
  if (!req.body.type) {
    errors.type = "Must not be empty";
  } else if (typeof req.body.type !== "string") {
    errors.type = "Must be a string";
  }
  if (!req.body.data) {
    errors.data = "Must not be empty";
  }
  if (typeof req.body.data !== "object") {
    errors.data = "Must be an object";
  }

  if (Object.keys(errors).length) {
    return res.status(422).json(errors);
  }
  const { destination, ...event } = req.body;
  res.sendStatus(200);

  if (!subscribers[destination]) {
    subscribers[destination] = {
      id: destination,
      socket: null,
      events: [],
    };
  }

  dispatchEvent(subscribers[destination], event);
});

app.get("/subscribe/:visitorId", (req, res, next) => {
  let subscriber;
  if (!subscribers[req.params.visitorId]) {
    subscribers[req.params.visitorId] = {
      id: req.params.visitorId,
      socket: null,
      events: [],
    };
  }
  subscriber = subscribers[req.params.visitorId];
  subscriber.socket = res;

  // create sse stream
  subscriber.socket.on("close", (event) => {
    console.error(
      `Stream closed for user ${subscriber.id}: ${JSON.stringify(event)}`
    );
    clearInterval(subscriber.interval);
    subscriber.socket = null;
  });
  subscriber.socket.on("error", (event) => {
    console.error(
      `Error in stream for user ${subscriber.id}: ${JSON.stringify(event)}`
    );
    clearInterval(subscriber.interval);
    subscriber.socket = null;
  });
  subscriber.socket.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  });
  subscriber.socket.write("\n");
  subscriber.interval = setInterval(() => {
    subscriber.socket.write(":\n");
  }, 1000 * 10);

  while (subscriber.events.length) {
    const event = subscriber.events.pop();
    sendEvent(subscriber.socket, event);
  }
});

function dispatchEvent(destinationObject, event) {
  if (destinationObject.socket === null) {
    destinationObject.events.push(event);
    console.log("Event stacked for user " + destinationObject.id);
  } else {
    sendEvent(destinationObject.socket, event);
    console.log("Event sent to user " + destinationObject.id);
  }
}

function sendEvent(socket, event) {
  const messageData = [
    `event: ${event.type}`,
    `data: ${JSON.stringify(event.data)}`,
    "",
  ].join("\n");
  socket.write(messageData + "\n");
}

app.listen(process.env.PORT, () =>
  console.log("Server started on port " + process.env.PORT)
);
