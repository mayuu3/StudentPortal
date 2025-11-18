function go(page) {
  window.location.href = page;
}

function logout() {
  localStorage.removeItem("student");
  window.location.href = "login.html";
}

const student = JSON.parse(localStorage.getItem("student"));
document.getElementById("studentName").innerText = student.name;

// Full courses with availability
const courses = [
  { code:"CS101", title:"Intro to Programming", instructor:"Dr. Smith", credits:3, seats:30 },
  { code:"CS201", title:"Data Structures", instructor:"Prof. Lee", credits:4, seats:25 },
  { code:"CS305", title:"Operating Systems", instructor:"Dr. Patel", credits:3, seats:20 },
  { code:"CS310", title:"DBMS", instructor:"Dr. Reddy", credits:4, seats:35 },
  { code:"MA202", title:"Discrete Mathematics", instructor:"Prof. Das", credits:4, seats:40 }
];

// Check registered courses on load
async function loadRegistered() {
  const res = await fetch("/my-courses", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: student.email })
  });

  const registered = await res.json();

  // Update Registered Courses Count on dashboard
  document.getElementById("regCount").innerText = registered.length;

  // Show course list and disable already registered
  document.getElementById("courseList").innerHTML = courses.map((c, i) => {
    const already = registered.find(r => r.code === c.code);

    return `
      <tr>
        <td>${c.code}</td>
        <td>${c.title}</td>
        <td>${c.instructor}</td>
        <td>${c.credits}</td>
        <td>${c.seats} seats</td>
        <td>
          <button 
            class="action-btn"
            style="background:${already ? 'gray' : '#1b3b7a'};"
            ${already ? 'disabled' : `onclick="registerCourse(${i})"`}
          >
            ${already ? 'Registered' : 'Register'}
          </button>
        </td>
      </tr>
    `;
  }).join("");
}

loadRegistered();

// Register course
async function registerCourse(index) {
  const course = courses[index];

  const res = await fetch("/register-course", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: student.email, course })
  });

  const data = await res.json();

  if (data.error) {
    alert(data.error);
    return;
  }

  alert("Course Registered Successfully!");

  // Reload table and registered count
  loadRegistered();
}
