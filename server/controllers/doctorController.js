const mongoose = require("mongoose");
const Doctor = require("../models/doctorModel");
const User = require("../models/userModel");
const Notification = require("../models/notificationModel");
const Appointment = require("../models/appointmentModel");

const getalldoctors = async (req, res) => {
  try {
    console.log("Fetching all doctors");
    const doctors = await Doctor.find({ isDoctor: true })
      .populate({
        path: 'userId',
        model: 'users',
        select: 'firstname lastname email'
      })
      .exec();

    console.log("Found doctors count:", doctors.length);
    return res.status(200).json(doctors);
  } catch (error) {
    console.error("Error fetching doctors:", error);
    res.status(500).send("Unable to get doctors");
  }
};

const getnotdoctors = async (req, res) => {
  try {
    const docs = await Doctor.find({ isDoctor: false })
      .find({
        _id: { $ne: req.locals },
      })
      .populate("userId");

    return res.send(docs);
  } catch (error) {
    res.status(500).send("Unable to get non doctors");
  }
};

const applyfordoctor = async (req, res) => {
  try {
    const alreadyFound = await Doctor.findOne({ userId: req.locals });
    if (alreadyFound) {
      return res.status(400).send("Application already exists");
    }

    const doctorData = {
      ...req.body.formDetails,
      userId: req.locals,
      longitude: req.body.formDetails.longitude || null,
      latitude: req.body.formDetails.latitude || null
    };

    const doctor = Doctor(doctorData);
    const result = await doctor.save();

    return res.status(201).send("Application submitted successfully");
  } catch (error) {
    res.status(500).send("Unable to submit application");
  }
};

const acceptdoctor = async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { _id: req.body.id },
      { isDoctor: true, status: "accepted" }
    );

    const doctor = await Doctor.findOneAndUpdate(
      { userId: req.body.id },
      { isDoctor: true }
    );

    const notification = await Notification({
      userId: req.body.id,
      content: `Congratulations, Your application has been accepted.`,
    });

    await notification.save();

    return res.status(201).send("Application accepted notification sent");
  } catch (error) {
    res.status(500).send("Error while sending notification");
  }
};

const rejectdoctor = async (req, res) => {
  try {
    const details = await User.findOneAndUpdate(
      { _id: req.body.id },
      { isDoctor: false, status: "rejected" }
    );
    const delDoc = await Doctor.findOneAndDelete({ userId: req.body.id });

    const notification = await Notification({
      userId: req.body.id,
      content: `Sorry, Your application has been rejected.`,
    });

    await notification.save();

    return res.status(201).send("Application rejection notification sent");
  } catch (error) {
    res.status(500).send("Error while rejecting application");
  }
};

const deletedoctor = async (req, res) => {
  try {
    const result = await User.findByIdAndUpdate(req.body.userId, {
      isDoctor: false,
    });
    const removeDoc = await Doctor.findOneAndDelete({
      userId: req.body.userId,
    });
    const removeAppoint = await Appointment.findOneAndDelete({
      userId: req.body.userId,
    });
    return res.send("Doctor deleted successfully");
  } catch (error) {
    console.log("error", error);
    res.status(500).send("Unable to delete doctor");
  }
};

const getDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ userId: req.params.userId });
    if (!doctor) {
      return res.status(404).send("Doctor not found");
    }
    return res.status(200).json(doctor);
  } catch (error) {
    return res.status(500).send("Error fetching doctor data");
  }
};

const updateLocation = async (req, res) => {
  try {
    const { longitude, latitude } = req.body;
    console.log('Updating location for userId:', req.locals);
    console.log('Location data:', { longitude, latitude });

    // First check if doctor exists
    let doctor = await Doctor.findOne({ userId: req.locals });
    
    if (!doctor) {
      // Create new doctor record if doesn't exist
      console.log('Creating new doctor record for userId:', req.locals);
      doctor = new Doctor({
        userId: req.locals,
        specialization: "Not specified",
        experience: 0,
        fees: 0,
        isDoctor: true,
        longitude: longitude,
        latitude: latitude
      });
      await doctor.save();
      console.log('New doctor record created:', doctor);
    } else {
      // Update existing doctor record
      doctor.longitude = longitude;
      doctor.latitude = latitude;
      await doctor.save();
      console.log('Updated existing doctor record:', doctor);
    }

    return res.status(200).json(doctor);
  } catch (error) {
    console.error("Error updating location:", error);
    return res.status(500).send(`Error updating location: ${error.message}`);
  }
};

const getDoctorAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ 
      doctorId: req.params.doctorId,
      status: { $ne: 'cancelled' }  // Exclude cancelled appointments
    }).select('date time status');

    return res.status(200).json(appointments);
  } catch (error) {
    console.error('Error fetching doctor appointments:', error);
    return res.status(500).send('Error fetching appointments');
  }
};

const updateProfile = async (req, res) => {
  try {
    const { openTime, closeTime } = req.body;
    const doctor = await Doctor.findOneAndUpdate(
      { userId: req.locals },
      { openTime, closeTime },
      { new: true }
    );
    
    if (!doctor) {
      return res.status(404).send("Doctor not found");
    }

    return res.status(200).json(doctor);
  } catch (error) {
    console.error("Error updating doctor profile:", error);
    return res.status(500).send("Error updating profile");
  }
};

module.exports = {
  getalldoctors,
  getnotdoctors,
  deletedoctor,
  applyfordoctor,
  acceptdoctor,
  rejectdoctor,
  getDoctor,
  updateLocation,
  getDoctorAppointments,
  updateProfile,
};
