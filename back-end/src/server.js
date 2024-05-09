const router = require("./routes");
require("dotenv").config();
const connectDb = require("./config/connectDb.js");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const { app, server } = require("./socket/socket.js");
const port = process.env.POST;

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", process.env.URL_CLIENT);
  res.header(
    "Access-Control-Allow-Methods",
    "POST, GET, PUT,PATCH, DELETE, OPTIONS, "
  );

  res.header("Access-Control-Allow-Credentials", true);
  res.header(
    "Access-Control-Allow-Headers",
    "Authorization, X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept"
  );

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.use(cookieParser());

connectDb();

router(app);

server.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
