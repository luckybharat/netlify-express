const { Router } = require("express");
const express = require("express");

const serverless = require("serverless-http");
const { mongooseSRV } = require("./keys");
const app = express();

const router = express.Router();

const mongoose = require("mongoose");

mongoose.connect(mongooseSRV, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on("error", (error) => {
  console.log("failed to connect mongodb", error);
});

mongoose.connection.on("connected", () => {
  console.log("connected to mongodb");
});

require("./models/College");
require("./models/Student");

const College = mongoose.model("colleges");
const Student = mongoose.model("students");

router.get("/getColleges", (req, res) => {
  College.find({}).then((data) => {
    if (data) {
      return res.json(data);
    }
  });
});

// router.get("/insertStudents", (req, res) => {
//   //carefull this route inserts 10000 records at a time in db
//   Student.insertMany(students)
//     .then(() => {
//       return res.json({ message: "data inserted" });
//     })
//     .catch((error) => {
//       console.log(error);
//     });
// });

router.get("/getStudents", (req, res) => {
  Student.find({}).then((data) => {
    if (data) {
      return res.json(data);
    }
  });
});

router.post("/getCollegeById", (req, res) => {
  const { id } = req.body;
  if (!id) {
    return res.status(422).json({ error: "Invalid college id" });
  }
  College.find({ _id: mongoose.Types.ObjectId(id) })
    .then((data) => {
      return res.json(data);
    })
    .catch((error) => {
      console.log(error);
    });
});

router.post("/getStudentByCollegeId", (req, res) => {
  const { id } = req.body;
  console.log(id);
  if (!id) {
    return res.status(422).json({ error: "Invalid college id" });
  }
  Student.find({
    collegeId: mongoose.Types.ObjectId(id),
  })
    .then((data) => {
      return res.json(data);
    })
    .catch((error) => {
      console.log(error);
    });
});

router.post("/searchByName", (req, res) => {
  const { search } = req.body;
  if (!search) {
    return res.json({ error: "Invalid search" });
  }
  College.find({ $text: { $search: search } })
    .then((data) => {
      console.log(data);
      if (data) {
        return res.json(data);
      } else {
        return res.json({ error: "No results found" });
      }
    })
    .catch((error) => {
      console.log(error);
    });
});

router.post("/getSimilarColleges", (req, res) => {
  console.log(req.body);
  const { state } = req.body;
  if (!state) {
    return res.json({ error: "Invalid Input" });
  }
  College.find({ state })
    .then((data) => {
      return res.json(data);
    })
    .catch((error) => {
      console.log(error);
    });
});

router.post("/addStudent", (req, res) => {
  const { name, skills, year, collegeId } = req.body;
  console.log(req.body);
  if ((!name, !skills, !year, !collegeId)) {
    return res.status(400).json({ error: "Missing required fields" });
  } else {
    Student.find({ name, collegeId, year })
      .then((data) => {
        if (data.length > 1) {
          console.log(data);
          return res.status(400).json({ error: "Student already exist" });
        } else {
          const newStudent = new Student({
            name,
            skills,
            batch: year,
            collegeId,
          });
          newStudent
            .save()
            .then(() => {
              return res.json({ message: "saved" });
            })
            .catch((error) => {
              console.log(error);
            });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
});

router.post("/addCollege", (req, res) => {
  const { name, startYear, city, state, students, country, courses } = req.body;
  console.log("came");
  if (!name || !city || !state || !students || !startYear || !country) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  console.log("came 2", req.body);
  College.findOne({ name, city, state })
    .then((data) => {
      if (data) {
        console.log("here", 1);
        return res.json({ error: "College name already exists" });
      } else {
        const newCollege = new College({
          name,
          city,
          state,
          country,
          students,
          courses,
        });

        newCollege
          .save()
          .then((data) => {
            return res.json({ message: "Saved" });
          })
          .catch((error) => {
            console.log(error);
          });
      }
    })
    .catch((error) => {
      console.log(error);
    });
});

router.get("/", (req, res) => {
  res.json({ hello: "hi" });
});
app.use(express.json());
app.use("/.netlify/functions/app", router);

module.exports.handler = serverless(app);
