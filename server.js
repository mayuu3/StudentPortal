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

// Student Schema
const StudentSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  password: String
});

const Student = mongoose.model("Student", StudentSchema);

// Connect DB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// REGISTER API
app.post("/register", async (req, res) => {
  const { name, email, phone, password } = req.body;

  const hashed = await bcrypt.hash(password, 10);

  const student = await Student.create({
    name,
    email,
    phone,
    password: hashed
  });

  res.json({ message: "Registered Successfully" });
});

// LOGIN API
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const student = await Student.findOne({ email });

  if (!student) return res.json({ error: "User not found" });

  const valid = await bcrypt.compare(password, student.password);

  if (!valid) return res.json({ error: "Incorrect password" });

  res.json({ message: "Login Success", student });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server Running on", PORT));