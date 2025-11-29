const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");  // ADD THIS LINE
require('dotenv').config();

// Imported from files .....
const authRouter = require("./routes/auth");
const adminRouter = require("./routes/admin");
const productRouter = require("./routes/product");
const userRouter = require("./routes/user");

// required initializations .....
const app = express();
const db = process.env.MONGODB_URI;

// middlewares .....
app.use(express.json());
app.use(cors());  // ADD THIS LINE - VERY IMPORTANT!
app.use(authRouter);
app.use(adminRouter);
app.use(productRouter);
app.use(userRouter);

// Add a root route for health checks
app.get("/", (req, res) => {
  res.json({ 
    message: "Amazon Clone Backend is running!",
    status: "OK"
  });
});

// database connection .....
mongoose.connect(db).then(()=> {
  console.log("Database connected successfully");
}).catch((e) => {console.log(e)});

// server listening .....
const PORT = process.env.PORT || 3002;
app.listen(PORT, "0.0.0.0", () => {  // ADD "0.0.0.0" HERE
  console.log(`Server is running on port ${PORT}`);
});