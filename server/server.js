const express = require("express");
const cors = require("cors");
const path = require("path");
const { Server } = require("socket.io");
const swaggerUi = require('swagger-ui-express');
const specs = require('./swagger');
require("dotenv").config();
require("./db/conn");

// Load models before routes
const models = require('./models');

// Then import routes
const userRouter = require("./routes/userRoutes");
const doctorRouter = require("./routes/doctorRoutes");
const appointRouter = require("./routes/appointRoutes");
const notificationRouter = require("./routes/notificationRouter");

const app = express();
const port = process.env.PORT || 5015;

app.use(cors());
app.use(express.json());

// Add swagger documentation route before other routes
app.use('/docs', swaggerUi.serve, swaggerUi.setup(specs));

app.use("/api/user", userRouter);
app.use("/api/doctor", doctorRouter);
app.use("/api/appointment", appointRouter);
app.use("/api/notification", notificationRouter);

// Remove or comment out static file serving
// app.use(express.static(path.join(__dirname, "./client/build")));
// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "./client/build/index.html"));
// });

const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

