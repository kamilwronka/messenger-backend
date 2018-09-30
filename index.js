const app = require("express")();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");
require("./db/mongoose");

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
app.use(bodyParser.json());
app.use(cookieParser());
app.use("/api/doc", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

require("./server/news/news.controller")(app);
require("./server/auth/auth.controller")(app);
require("./server/worlds/worlds.controller")(app);
require("./server/village/village.controller")(app);

const PORT = process.env.PORT || 4000;

const server = app.listen(PORT, () => {
  const host = server.address().address;
  const port = server.address().port;

  console.log(`App is listening at PORT: ${PORT}`);
});
