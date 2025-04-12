const express = require("express");
const auth = require("../middleware/auth");
const userController = require("../controllers/userController");
const userRouter = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         firstname:
 *           type: string
 *         lastname:
 *           type: string
 *         email:
 *           type: string
 *         password:
 *           type: string
 *         role:
 *           type: string
 *           enum: [Admin, Doctor, Patient]
 */

/**
 * @swagger
 * /user/register:
 *   post:
 *     tags: [Users]
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: User registered successfully
 */

/**
 * @swagger
 * /user/login:
 *   post:
 *     tags: [Users]
 *     summary: Login user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 */

userRouter.get("/getuser/:id", auth, userController.getuser);

userRouter.get("/getallusers", auth, userController.getallusers);

userRouter.post("/login", userController.login);

userRouter.post("/register", userController.register);

userRouter.post("/forgotpassword", userController.forgotpassword);

userRouter.post("/resetpassword/:id/:token", userController.resetpassword);

userRouter.put("/updateprofile", auth, userController.updateprofile);

userRouter.put("/changepassword", auth, userController.changepassword);

userRouter.delete("/deleteuser", auth, userController.deleteuser);

userRouter.get("/getuser", auth, userController.getUser);

module.exports = userRouter;
