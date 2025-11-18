// Load logged in student
const student = JSON.parse(localStorage.getItem("student"));
document.getElementById("studentName").innerText = student.name;

// TEMP course data (later we will fetch from MongoDB)
const courses = [
  {
    code: "CS101",
    title: "Intro to Computer Science",
    instructor: "Dr. Smith",
    schedule: "Mon/Wed 10:00 - 11:30",
    credits: 3,
    seats: 40
  },
  {
    code: "MATH205",
    title: "Calculus II",
    instructor: "Prof. Johnson",
    schedule: "Tue/Thu 11:00 - 12:30",
    credits: 4,
    seats: 25
  }
];

// Load into table
document.getElementById("courseList").innerHTML =
  courses.map(c => `
    <tr>
      <td>${c.code}</td>
      <td>${c.title}</td>
      <td>${c.instructor}</td>
      <td>${c.schedule}</td>
      <td>${c.credits}</td>
      <td>${c.seats} seats</td>
      <td><button class="action-btn">Register</button></td>
    </tr>
  `).join("");