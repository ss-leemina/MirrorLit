const express = require("express");
const app = express();
const userRoutes = require("./routes/userRoutes");
require("dotenv").config();

app.use(express.json());
app.use("/users", userRoutes);

module.exports = app;