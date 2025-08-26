const detailsButton = document.querySelector(".details-Btn");
const detailsSection = document.getElementById("details");
const studentImg = document.getElementById("studentImg");
const form = document.querySelector("#registration-Form");

let editIndex = null; // to track which record is being edited

// Validate inputs
function validateInputs(name, stuId, email, contact, standard) {
    const nameRegex = /^[A-Za-z ]+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const numberRegex = /^[0-9]+$/;

    if (!name || !stuId || !email || !contact || !standard) {
        alert("All fields are required!");
        return false;
    }
    if (!nameRegex.test(name)) {
        alert("Name should contain only alphabets!");
        return false;
    }
    if (!numberRegex.test(stuId)) {
        alert("Student ID should contain only numbers!");
        return false;
    }
    if (!emailRegex.test(email)) {
        alert("Please enter a valid email!");
        return false;
    }
    if (!numberRegex.test(contact) || contact.length !== 10) {
        alert("Contact number must be exactly 10 digits!");
        return false;
    }

    return true;
}

// Save student data
form.addEventListener("submit", function (event) {
    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const stuId = document.getElementById("studentID").value.trim();
    const email = document.getElementById("emailID").value.trim();
    const contact = document.getElementById("contactNo").value.trim();
    const standard = document.getElementById("standard").value;

    if (!validateInputs(name, stuId, email, contact, standard)) {
        return;
    }

    const studentData = { name, stuId, email, contact, standard };

    // get existing students or empty array
    let students = JSON.parse(localStorage.getItem("students")) || [];

    if (editIndex !== null) {
        // update existing record
        students[editIndex] = studentData;
        editIndex = null;
        alert("Student record updated!");
    } else {
        // add new record
        students.push(studentData);
        alert("Student saved!");
    }

    localStorage.setItem("students", JSON.stringify(students));
    form.reset();
    renderTable(); // refresh table
});

// Render table
function renderTable() {
    const storedData = localStorage.getItem("students");
    // if no data in localStorage
    if (!storedData) {
        detailsSection.innerHTML = "<p class='text-center text-gray-600 mt-4'>No data available.</p>";
        return;
    }

    const students = JSON.parse(storedData);

    if (students.length === 0) {
        detailsSection.innerHTML = "<p class='text-center text-gray-600'>No records found.</p>";
        return;
    }

    let tableHTML = `
        <div class="max-h-[400px] overflow-y-auto overflow-x-auto w-full new-scrollbar ">
            <table class="mt-4 min-w-[600px] w-full border-collapse border border-gray-400">
            <thead>
                <tr class="bg-[#5152ae] text-white">
                <th class="border border-gray-400 p-2 text-left">Name</th>
                <th class="border border-gray-400 p-2 text-left">ID</th>
                <th class="border border-gray-400 p-2 text-left">Email</th>
                <th class="border border-gray-400 p-2 text-left">Contact</th>
                <th class="border border-gray-400 p-2 text-left">Standard</th>
                <th class="border border-gray-400 p-2 text-center">Edit</th>
                <th class="border border-gray-400 p-2 text-center">Delete</th>
                </tr>
            </thead>
            <tbody>
        `;

    students.forEach((student, index) => {
        tableHTML += `
            <tr class="hover:bg-gray-100">
            <td class="border border-gray-400 p-2">${student.name}</td>
            <td class="border border-gray-400 p-2">${student.stuId}</td>
            <td class="border border-gray-400 p-2">${student.email}</td>
            <td class="border border-gray-400 p-2">${student.contact}</td>
            <td class="border border-gray-400 p-2">${student.standard}</td>
            <td class="border border-gray-400 p-2 text-center">
                <button class="editBtn text-blue-600 hover:underline" data-index="${index}">Edit</button>
            </td>
            <td class="border border-gray-400 p-2 text-center">
                <button class="deleteBtn text-red-600 hover:underline" data-index="${index}">Delete</button>
            </td>
            </tr>
        `;
    });

    tableHTML += `
      </tbody>
        </table>
            </div>`;

    detailsSection.innerHTML = tableHTML;

    // Add event listeners for Edit/Delete
    document.querySelectorAll(".editBtn").forEach(btn => {
        btn.addEventListener("click", function () {
            const index = this.getAttribute("data-index");
            loadForEdit(index);
        });
    });

    document.querySelectorAll(".deleteBtn").forEach(btn => {
        btn.addEventListener("click", function () {
            const index = this.getAttribute("data-index");
            deleteStudent(index);
        });
    });
}

// Load student data into form for editing
function loadForEdit(index) {
    let students = JSON.parse(localStorage.getItem("students")) || [];
    const student = students[index];

    document.getElementById("name").value = student.name;
    document.getElementById("studentID").value = student.stuId;
    document.getElementById("emailID").value = student.email;
    document.getElementById("contactNo").value = student.contact;
    document.getElementById("standard").value = student.standard;

    editIndex = index;
}

// Delete student
function deleteStudent(index) {
    let students = JSON.parse(localStorage.getItem("students")) || [];
    if (confirm("Are you sure you want to delete this record?")) {
        students.splice(index, 1);
        localStorage.setItem("students", JSON.stringify(students));
        renderTable();
    }
}

// Toggle details / image
let showDetails = false;
detailsButton.addEventListener("click", function () {
    if (!showDetails) {
        renderTable();
        studentImg.style.display = "none";
        detailsSection.style.display = "block";
        showDetails = true;
    } else {
        detailsSection.style.display = "none";
        studentImg.style.display = "block";
        showDetails = false;
    }
});