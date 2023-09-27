const express = require("express");
const connectDb = require("./config/dbConnection");

const dotenv = require("dotenv").config();

// extra security packages
const fileUpload = require('express-fileupload');


// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');



connectDb();
const app = express();

const port = process.env.PORT || 5000;
app.use(express.static('./static'));
app.use(express.json());
app.use(fileUpload({ useTempFiles: true }));

app.use("/api/contacts", require("./routes/contactRoutes"));
app.use("/api/users", require("./routes/userRoutes"));


app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
