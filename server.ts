let express = require("express");
let app = express();
let expressWs = require("express-ws")(app);

app.use("/", express.static("game"));

app.listen(1337);


