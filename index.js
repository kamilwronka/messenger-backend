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

io.on("connection", function(socket) {
  socket.join(socket.user.id);
  console.log("connected");
  const user = socket.user;
  user.online = true;
  user.lastOnline = Date.now();
  user.save().then(() => console.log("online"));

  require("./server/auth/auth.controller")(app);
  require("./server/user/user.controller")(app);
  require("./server/messages/messages.controller")(app, io, socket, user);
  require("./server/friend/friend.controller")(app, io, socket, user);
  require("./server/requests/requests.controller")(app, io, socket, user);
  require("./server/fileUpload/fileUpload.controller")(app);
  require("./server/conversation/conversation.controller")(app);
});

const PORT = process.env.PORT || 4000;

const server = http.listen(PORT, () => {
  const host = server.address().address;
  const port = server.address().port;

  console.log(`App is listening at PORT: ${PORT}`);
});
