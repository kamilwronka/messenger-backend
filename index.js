const app = require("express")();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
require("./db/mongoose");

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
app.use(bodyParser.json());
app.use(cookieParser());

require("./server/news/news")(app);
require("./server/auth/auth")(app);

const server = app.listen(8080, () => {
  const host = server.address().address;
  const port = server.address().port;

  console.log(`App is listening at PORT: ${8080}`);
});
