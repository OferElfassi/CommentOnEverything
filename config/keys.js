const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

if (process.env.NODE_ENV === "production") {
  module.exports = require("./prod");
} else {
  module.exports = require("./dev");
}
