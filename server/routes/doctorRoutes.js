const express = require("express");
const doctorController = require("../controllers/doctorController");
const auth = require("../middleware/auth");

const doctorRouter = express.Router();

doctorRouter.get("/getalldoctors", doctorController.getalldoctors);

doctorRouter.get("/getnotdoctors", auth, doctorController.getnotdoctors);
doctorRouter.get("/getdoctor/:userId", auth, doctorController.getDoctor);
doctorRouter.get("/appointments/:doctorId", auth, doctorController.getDoctorAppointments);

doctorRouter.post("/applyfordoctor", auth, doctorController.applyfordoctor);

doctorRouter.put("/deletedoctor", auth, doctorController.deletedoctor);

doctorRouter.put("/acceptdoctor", auth, doctorController.acceptdoctor);

doctorRouter.put("/rejectdoctor", auth, doctorController.rejectdoctor);

/**
 * @swagger
 * components:
 *   schemas:
 *     Doctor:
 *       type: object
 *       properties:
 *         userId:
 *           type: string
 *         specialization:
 *           type: string
 *         experience:
 *           type: number
 *         fees:
 *           type: number
 *         longitude:
 *           type: number
 *         latitude:
 *           type: number
 *         isDoctor:
 *           type: boolean
 */

/**
 * @swagger
 * /doctor/getalldoctors:
 *   get:
 *     tags: [Doctors]
 *     summary: Get all doctors
 *     responses:
 *       200:
 *         description: List of all doctors
 */

/**
 * @swagger
 * /doctor/updatelocation:
 *   put:
 *     tags: [Doctors]
 *     summary: Update doctor location
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               longitude:
 *                 type: number
 *               latitude:
 *                 type: number
 *     responses:
 *       200:
 *         description: Location updated successfully
 *       404:
 *         description: Doctor not found
 */
doctorRouter.put("/updatelocation", auth, doctorController.updateLocation);

module.exports = doctorRouter;
