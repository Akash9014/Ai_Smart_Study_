const mongoose = require("mongoose");

const revisionSchema = new mongoose.Schema({

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  topic: {
    type: String,
    required: true
  },

  subject: {
    type: String,
    required: true
  },

  nextRevision: {
    type: Date,
    required: true
  },

  createdAt: {
    type: Date,
    default: Date.now
  }

}, { timestamps: true });

module.exports = mongoose.model("Revision", revisionSchema);