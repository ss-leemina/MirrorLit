const express = require("express"),
  app = express(),
  errorController = require("./controllers/errorController"),
  articleRouter = require("./routes/articles"),
  layouts = require("express-ejs-layouts");

app.set("port", process.env.PORT || 3000);
app.set("view engine", "ejs");

app.use(layouts);
app.use(express.static("public"));

app.use("/articles", articleRouter);


// app.use(errorController.logError);
// app.use(errorController.respondNoResourceFound);
// app.use(errorController.respondInternalError);

app.listen(app.get("port"), () => {
  console.log("실행 중");
});