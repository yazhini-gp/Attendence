document.addEventListener("DOMContentLoaded", function () {
  // Load attendance if applicable
  loadAttendance();

  // Handle attendance form submission
  const attendanceForm = document.getElementById("attendanceForm");
  if (attendanceForm) {
    attendanceForm.addEventListener("submit", function (event) {
      event.preventDefault();
      addAttendance();
    });
  }

  // Signup form
  const signupForm = document.getElementById("signupForm");
  if (signupForm) {
    signupForm.addEventListener("submit", async function (event) {
      event.preventDefault();
      const email = document.getElementById("signupEmail").value;
      const password = document.getElementById("signupPassword").value;

      localStorage.setItem("email", email);
      localStorage.setItem("password", password);

      alert("Signup successful! You can now login.");
      window.location.href = "login.html";
    });
  }

  // Login form
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", async function (event) {
      event.preventDefault();
      const email = document.getElementById("loginEmail").value;
      const password = document.getElementById("loginPassword").value;

      if (
        email === localStorage.getItem("email") &&
        password === localStorage.getItem("password")
      ) {
        alert("Login successful!");
        window.location.href = "attendance.html";
      } else {
        alert("Invalid credentials. Please try again.");
      }
    });
  }

  // Forgot password form
  const forgotPasswordForm = document.getElementById("forgotPasswordForm");
  if (forgotPasswordForm) {
    forgotPasswordForm.addEventListener("submit", function (event) {
      event.preventDefault();
      const email = document.getElementById("forgotEmail").value;
      const storedEmail = localStorage.getItem("email");

      if (email === storedEmail) {
        let newPassword = prompt("Enter new password:");
        if (newPassword) {
          localStorage.setItem("password", newPassword);
          alert("Password reset successful.");
          window.location.href = "login.html";
        }
      } else {
        alert("Email not found.");
      }
    });
  }
});


function addAttendance() {
  let name = document.getElementById("name").value;
  let date = document.getElementById("date").value;
  let status = document.getElementById("status").value;

  if (name.trim() === "" || date.trim() === "") {
      alert("Please fill all fields!");
      return;
  }

  const className = "ClassA"; // 📝 Update if needed
  const attendanceData = {
      className,
      date,
      present: status === "Present" ? [{ name, rollNumber: 0 }] : [],
      absent: status === "Absent" ? [{ name, rollNumber: 0 }] : []
  };

  // ✅ Save attendance to MongoDB
  fetch("http://localhost:5000/api/attendance", {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
      },
      body: JSON.stringify(attendanceData),
  })
  .then(res => res.json())
  .then(data => {
      console.log("✅ Attendance saved:", data);
      alert("Attendance saved to MongoDB!");
      document.getElementById("attendanceForm").reset();
      loadAttendance(); // refresh from DB
  })
  .catch(err => {
      console.error("❌ Error saving attendance:", err);
  });
}

function loadAttendance() {
  const tableBody = document.getElementById("attendanceList");
  fetch("http://localhost:5000/api/attendance")
      .then(res => res.json())
      .then(data => {
          tableBody.innerHTML = "";
          data.forEach((entry, index) => {
              tableBody.innerHTML += `
                  <tr>
                      <td>${index + 1}</td>
                      <td>${entry.className}</td>
                      <td>${entry.date}</td>
                      <td>
                          Present: ${entry.present.map(p => p.name).join(', ')}<br>
                          Absent: ${entry.absent.map(a => a.name).join(', ')}
                      </td>
                  </tr>
              `;
          });
      })
      .catch(err => {
          console.error("❌ Error loading attendance:", err);
          tableBody.innerHTML = "<tr><td colspan='4'>Error fetching attendance data.</td></tr>";
      });
}


function deleteAttendance(index) {
  // ❌ Skip local deletion — you can implement backend delete later if needed
  alert("Deleting from MongoDB not implemented yet.");
}

function submitAttendance() {
  const key = getCurrentKey();
  const students = studentsData[key];

  const present = [];
  const absent = [];

  students.forEach((name, index) => {
      const checkbox = document.getElementById(`student-${index}`);
      if (checkbox && checkbox.checked) {
          present.push({ name, rollNumber: index + 1 });
      } else {
          absent.push({ name, rollNumber: index + 1 });
      }
  });

  // Show result on frontend
  const resultDiv = document.getElementById('attendanceResult');
  resultDiv.innerHTML = `
      <div class="card mt-4 p-3">
          <h5>Present Students:</h5>
          <ul>${present.map(s => `<li>${s.name}</li>`).join('')}</ul>
          <h5>Absent Students:</h5>
          <ul>${absent.map(s => `<li>${s.name}</li>`).join('')}</ul>
      </div>
  `;

  // Send to backend (MongoDB)
  fetch('http://localhost:5000/api/attendance', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({
          className: key,
          present,
          absent
      })
  })
  .then(res => res.json())
  .then(data => {
      console.log('✅ Attendance saved:', data);
  })
  .catch(error => {
      console.error('❌ Error saving attendance:', error);
  });
}
