const user = require("./user.js");
const conversation = require("./conversation.js");
const message = require('./message.js')
const notFound = require("../middlewares/errorHandler");

const router = (app) => {
  app.use("/api/users", user);
  app.use("/api/conversations", conversation);
  app.use("/api/messenges", message);

  app.use(notFound);
};

module.exports = router;
