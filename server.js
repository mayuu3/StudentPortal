import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcrypt";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static("public"));

// Student Schema with courses array
const StudentSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  courses: [
    {
      code: String,
      title: String,
      instructor: String,
      credits: Number
    }
  ]
});

const Student = mongoose.model("Student", StudentSchema);

// Connect DB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// REGISTER
app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  await Student.create({ name, email, password: hashed });
  res.json({ message: "Registered Successfully" });
});

// LOGIN
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const student = await Student.findOne({ email });
  if (!student) return res.json({ error: "User not found" });

  const valid = await bcrypt.compare(password, student.password);
  if (!valid) return res.json({ error: "Incorrect password" });

  res.json({ message: "Login Success", student });
});

// REGISTER COURSE API (IMPORTANT)
app.post("/register-course", async (req, res) => {
  const { email, course } = req.body;

  const student = await Student.findOne({ email });
  if (!student) return res.json({ error: "Student not found" });

  // Prevent duplicate registration
  const exists = student.courses.find(c => c.code === course.code);
  if (exists) return res.json({ error: "Already registered" });

  student.courses.push(course);
  await student.save();

  res.json({ message: "Course Registered", courses: student.courses });
});

// GET MY COURSES
app.post("/my-courses", async (req, res) => {
  const { email } = req.body;
  const student = await Student.findOne({ email });
  res.json(student.courses);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server Running on", PORT));
