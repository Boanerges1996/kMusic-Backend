const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const helmet = require("helmet");
const compression = require("compression");
const parser = require("body-parser")
const AUTH = require("./auth-token")
const url = require("./url")

//Routes import
const admin = require("./controllers/admin");
const Singers = require("./routes/singers")
const Customers = require("./routes/customer")
const Songs = require("./routes/songs")

const app = express();

dotenv.config();
// DB configuration
mongoose.set("useNewUrlParser", true);
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);
mongoose.set("useUnifiedTopology", true);

if (process.env.ENVIRON === "production") {
  // Production Database
  mongoose
    .connect(
      process.env.REMOTE_MONGODB,
      { useNewUrlParser: true, useUnifiedTopology: true },
      () => console.log("Connected to db")
    )
    .catch(err => {
      console.log(err);
    });
} else {
  // Local Database
  mongoose
    .connect("mongodb://localhost/kmusic", {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    .then(() => {
      console.log("Development local DB connected");
    });
}

// Middlewares
app.use(cors());
app.use(parser.json({
  limit:"100mb",
  extended:true
}))
app.use(parser.urlencoded({
  limit:"100mb",
  extended:true
}))
app.use(logger("dev"));
app.use(helmet());
app.use(compression());
app.use(express.static(__dirname+'/static'))

// images
app.use('/singers/image',express.static(__dirname+'/static/images/singers'))
app.use('/single/songs/cover',express.static(__dirname+'/static/images/songs_cover'))
app.use('/single/songs',express.static(__dirname+'/static/songs/single'))


// Routers
app.use("/", admin);
app.use("/admin",Singers)
app.use("/customer",Customers)
app.use("/admin",Songs)

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Listening on Port ${port}`);
});
