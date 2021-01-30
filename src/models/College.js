const mongoose = require("mongoose");

const College = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  startYear: {
    type: String,
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  students: {
    type: String,
    required: true,
  },
  courses: {
    type: [
      {
        name: {
          type: String,
          required: true,
        },
      },
    ],
  },
});
College.indexes({ "$**": "text" });
const CollegeSchema = mongoose.model("colleges", College);
module.exports = CollegeSchema;
