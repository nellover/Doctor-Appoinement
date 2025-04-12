const mongoose = require('mongoose');
const User = require('./userModel');
const Doctor = require('./doctorModel');
const Appointment = require('./appointmentModel');
const Notification = require('./notificationModel');

module.exports = {
  User,
  Doctor,
  Appointment,
  Notification
};
