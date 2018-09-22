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

const PORT = process.env.PORT || 4000;

const server = app.listen(PORT, () => {
  const host = server.address().address;
  const port = server.address().port;

  console.log(`App is listening at PORT: ${PORT}`);
});
