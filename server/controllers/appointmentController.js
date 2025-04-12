const mongoose = require("mongoose");
const { Appointment, Doctor, User, Notification } = require('../models');

const getallappointments = async (req, res) => {
  try {
    const keyword = req.query.search
      ? {
          $or: [{ userId: req.query.search }, { doctorId: req.query.search }],
        }
      : {};

    const appointments = await Appointment.find(keyword)
      .populate("doctorId")
      .populate("userId");
    return res.send(appointments);
  } catch (error) {
    res.status(500).send("Unable to get apponintments");
  }
};

const bookappointment = async (req, res) => {
  try {
    const appointment = await Appointment({
      date: req.body.date,
      time: req.body.time,
      age: req.body.age,
      bloodGroup: req.body.bloodGroup,
      gender: req.body.gender,
      number: req.body.number,
      familyDiseases: req.body.familyDiseases,
      // prescription: req.body.prescription,
      doctorId: req.body.doctorId,
      userId: req.locals,
    });

    const usernotification = Notification({
      userId: req.locals,
      content: `You booked an appointment with Dr. ${req.body.doctorname} for ${req.body.date} ${req.body.time}`,
    });

    await usernotification.save();

    const user = await User.findById(req.locals);

    const doctornotification = Notification({
      userId: req.body.doctorId,
      content: `You have an appointment with ${user.firstname} ${user.lastname} on ${req.body.date} at ${req.body.time} Age: ${user.age} bloodGropu: ${user.bloodGroup} Gender: ${user.gender} Mobile Number:${user.number} Family Diseases ${user.familyDiseases}` ,
    });

    await doctornotification.save();

    const result = await appointment.save();
    return res.status(201).send(result);
  } catch (error) {
    console.log("error", error);
    res.status(500).send("Unable to book appointment");
  }
};

const completed = async (req, res) => {
  try {
    const alreadyFound = await Appointment.findOneAndUpdate(
      { _id: req.body.appointid },
      { status: "Completed" }
    );

    const usernotification = Notification({
      userId: req.locals,
      content: `Your appointment with ${req.body.doctorname} has been completed`,
    });

    await usernotification.save();

    const user = await User.findById(req.locals);

    const doctornotification = Notification({
      userId: req.body.doctorId,
      content: `Your appointment with ${user.firstname} ${user.lastname} has been completed`,
    });

    await doctornotification.save();

    return res.status(201).send("Appointment completed");
  } catch (error) {
    res.status(500).send("Unable to complete appointment");
  }
};

const getUserAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ userId: req.locals })
      .populate({
        path: 'doctorId',
        model: Doctor,
        populate: {
          path: 'userId',
          model: User,
          select: 'firstname lastname'
        }
      })
      .lean();

    return res.status(200).json(appointments);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    return res.status(500).send('Unable to get appointments');
  }
};

const cancelAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.appointmentId,
      { status: 'cancelled' },
      { new: true }
    );

    if (!appointment) {
      return res.status(404).send("Appointment not found");
    }

    const usernotification = await Notification({
      userId: req.locals,
      content: `Your appointment has been cancelled`,
    }).save();

    return res.status(200).json(appointment);
  } catch (error) {
    console.error("Error cancelling appointment:", error);
    return res.status(500).send("Error cancelling appointment");
  }
};

module.exports = {
  getallappointments,
  bookappointment,
  completed,
  getUserAppointments,
  cancelAppointment,
};
