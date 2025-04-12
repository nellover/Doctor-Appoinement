const express = require("express");
const appointmentController = require("../controllers/appointmentController");
const auth = require("../middleware/auth");

const appointRouter = express.Router();

appointRouter.post("/bookappointment", auth, appointmentController.bookappointment);
appointRouter.get("/user-appointments", auth, appointmentController.getUserAppointments);
appointRouter.put("/cancel/:appointmentId", auth, appointmentController.cancelAppointment);
appointRouter.put("/complete", auth, appointmentController.completed);

module.exports = appointRouter;
