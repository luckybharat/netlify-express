const mongoose = require("mongoose");

const Student = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  batch: {
    type: String,
    required: true,
  },
  collegeId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  skills: {
    type: [],
  },
});

mongoose.model("students", Student);
