// require("@babel/polyfill");

const app = require("express")();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const compression = require("compression");
const morgan = require("morgan");
const helmet = require("helmet");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");
const socketRequireAuth = require("./server/middleware/socketRequireAuth");
const gcm = require("node-gcm");
const keys = require("./config/keys");

const sender = new gcm.Sender(keys.FCM_SENDER);

require("./db/mongoose");

io.use(socketRequireAuth);

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Expose-Headers", "Authorization");
  res.header("Access-Control-Allow-Methods", "GET, POST, DELETE, PUT, PATCH");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  next();
});
app.use(compression());
app.use(helmet());
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(cookieParser());
app.use("/api/doc", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.post("/dupa", (req, res) => {
  const { message, name } = req.body;

  const gcmMessage = new gcm.Message({
    collapseKey: name,
    notification: {
      title: name,
      body: message,
      tag: name,
      sound: "default"
    }
  });

  sender.send(
    gcmMessage,
    { registrationTokens: deviceTokens },
    (err, response) => {
      console.log(response);
    }
  );
  res.end();
});

io.on("connection", function(socket) {
  socket.join(socket.user.id);
  console.log("connected");
  const user = socket.user;
  user.online = true;
  user.lastOnline = Date.now();
  user.save().then(() => console.log("online"));

  socket.on("disconnect", () => {
    user.online = false;
    user.save().then(() => console.log("offline"));
  });

  socket.on("newPushToken", token => {
    user.pushNotificationsToken = token;
    user.save().then(() => console.log("Token saved", token));
  });

  require("./server/messages/messages.controller")(
    app,
    io,
    socket,
    user,
    sender
  );
  require("./server/friend/friend.controller")(app, io, socket, user);
  require("./server/requests/requests.controller")(app, io, socket, user);
  require("./server/conversation/conversation.controller")(app);
});

require("./server/fileUpload/fileUpload.controller")(app);
require("./server/auth/auth.controller")(app);
require("./server/user/user.controller")(app);

const PORT = process.env.PORT || 4000;

const server = http.listen(PORT, () => {
  const host = server.address().address;
  const port = server.address().port;

  console.log(`App is listening at PORT: ${PORT}`);
});
