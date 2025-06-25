const semesters = {
    1: [
        { name: 'Programming and Problem Solving in C	', credits: 4 },
        { name: 'Discrete	Mathematics	and	Graph	Theory', credits: 3 },
        { name: 'Database	Management	Systems	(DBMS)', credits: 3 },
        { name: 'Operating	Systems', credits: 3 },
        { name: ' Web	Technologies', credits: 3 },
        { name: 'DBMS and Web Technologies Laboratory ', credits: 2 }
    ],
    2: [
        { name: 'Machine Learning and Data Analytics using python', credits: 4 },
        { name: 'Object Oriented Programming using  JAVA', credits: 4 },
        { name: 'Data Structure and Algorithms', credits: 4 },
        { name: 'Software Engineering', credits: 3 },
        { name: 'Web Application Development ', credits: 3 },
        { name: 'Object Oriented Programming using  JAVA Laboratory', credits: 2 },
        { name: 'Data Structure and Algorithms Laboratory', credits: 2 }
    ]
};


// Function to display subjects for the selected semester
function showSemesterSubjects() {
    const selectedSemester = document.getElementById('semesterSelect').value;
    const semesterContainer = document.getElementById('semesters');
    semesterContainer.innerHTML = '';

    if (!semesters[selectedSemester]) {
        semesterContainer.innerHTML = '<p>No data available for this semester.</p>';
        return;
    }

    const courses = semesters[selectedSemester];
    const table = document.createElement('table');
    table.classList.add('grade-table'); // Add class for styling
    const header = `<tr><th>Course</th><th>Credits</th><th>Grade</th></tr>`;
    table.innerHTML = header;

    courses.forEach(course => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${course.name}</td>
            <td>${course.credits}</td>
            <td>
                <input type="number" class="grade" id="mark" name="marks1" placeholder="Enter the Marks" data-credits="${course.credits}" required>
            </td>
        `;
        table.appendChild(row);
    });

    semesterContainer.appendChild(table);
}

//  <td>
//                 <select class="grade" data-credits="${course.credits}">
//                     <option value="" selected disabled>Select Grade</option>
//                     <option value="O">O (10)</option>
//                     <option value="E">E (9)</option>
//                     <option value="A">A (8)</option>
//                     <option value="B">B (7)</option>
//                     <option value="C">C (6)</option>
//                     <option value="D">D (5)</option>
//                 </select>
//             </td>
// Function to calculate SGPA
function calculateSGPA() {
    let totalCredits = 0;
    let weightedSum = 0;
    let allGradesValid = true;

    document.querySelectorAll('.grade').forEach(select => {
        const gradeValue = select.value;
        // console.log(gradeValue)
        const credits = parseInt(select.getAttribute('data-credits'));
        // console.log(credits)

        if (!gradeValue) {
            allGradesValid = false;
            select.style.border = '2px solid red'; // Highlight invalid fields
        }
        else if (gradeValue < 40) {
            select.style.border = '2px solid red';
            alert("Invalid input: You must be pass in all the subject to calculate SGPA")

        } else if (gradeValue > 100) {
            select.style.broder = '2px solid red';
            alert("Invalid input: Marks cannot be more than 100")
        }
        else {
            let gradePoint;
            if (gradeValue >= 90)
                gradePoint = 10
            else if (gradeValue >= 80 && gradeValue < 89)
                gradePoint = 9
            else if (gradeValue >= 70 && gradeValue < 79)
                gradePoint = 8
            else if (gradeValue >= 60 && gradeValue < 69)
                gradePoint = 7
            else if (gradeValue >= 50 && gradeValue < 54)
                gradePoint = 6
            else
                gradePoint = 5

            //  gradepoint= gradePoints[gradeValue];
            weightedSum += gradePoint * credits;
            totalCredits += credits;
            select.style.border = ''; // Reset border for valid fields
        }
    });

    if (!allGradesValid) {
        alert('Please Enter the Marks for all subjects.');
        return;
    }

    const sgpa = totalCredits > 0 ? (weightedSum / totalCredits).toFixed(2) : 0;
    document.getElementById('result').textContent = `SGPA: ${sgpa}`;
}



// Function to calculate CGPA
function calculateCGPA() {
    // Get input values
    const newSemesterSgpa = parseFloat(document.getElementById('newSemesterSgpa').value);
    const semesterForSgpa = parseInt(document.getElementById('semesterForSgpa').value);
    const previousCgpa = parseFloat(document.getElementById('previousCgpa').value);

    // Validate inputs
    if (isNaN(newSemesterSgpa) || !semesterForSgpa || isNaN(previousCgpa)) {
        alert('Please fill in all fields correctly.');
        return;
    }

    // Calculate total number of semesters (including the latest one)
    const totalSemesters = semesterForSgpa;

    // Calculate old semesters credit 
    let oldSemestersCredits = 0;
    for (let i = 1; i < totalSemesters; i++) {
        const subjects = semesters[`${i}`];
        for (const subject of subjects) {
            oldSemestersCredits += subject.credits;
        }
    }
    // console.log(oldSemestersCredits);

    // Calculate new semesters credit 
    let newSemesterCredits = 0;
    for (const subject of semesters[`${semesterForSgpa}`]) {
        newSemesterCredits += subject.credits;
    }

    // Calculate total semester credits
    const totalSemesterscredits = oldSemestersCredits + newSemesterCredits;

    // Calculate CGPA using the formula:
    const newCgpa = ((previousCgpa * oldSemestersCredits) + (newSemesterSgpa * newSemesterCredits)) / totalSemesterscredits;

    // Display the result with updated styling
    const cgpaOutput = `
        <div class="cgpa-result">
            <div>Your updated CGPA after Semester ${semesterForSgpa} is: <span>${newCgpa.toFixed(2)}</span></div>
        </div>
    `;
    document.getElementById('cgpaResult').innerHTML = cgpaOutput;
}

function calculateReqSgpa() {
    // Get input values
    const currentCgpa = parseFloat(document.getElementById('currentCgpa').value);
    const requiredCgpa = parseFloat(document.getElementById('requiredCgpa').value);
    const semesterForSgpa = parseInt(document.getElementById('semesterForSgpareq').value);

    // Validate inputs
    if (isNaN(currentCgpa) || isNaN(requiredCgpa) || !semesterForSgpa) {
        alert('Please fill in all fields correctly.');
        return;
    }
    if (currentCgpa < 0 || requiredCgpa < 0) {
        alert('Invalid Input');
        return;
    }
    // Calculate Total Cumulative Credits of current and last Semester
    let totalCumulativeCredits = 0;
    let totalCumulativeCreditsLastSem = 0;
    for (let i = 1; i <= semesterForSgpa; i++) {
        const subjects = semesters[`${i}`];
        for (const subject of subjects) {
            totalCumulativeCredits += subject.credits;
            if (i != semesterForSgpa) {
                totalCumulativeCreditsLastSem += subject.credits;
            }
        }
    }

    // Calculate Required Cumulative Credits
    const requiredCumulativeCredits = Math.round(totalCumulativeCredits * requiredCgpa);

    // Calculate Required Credits
    const requiredCredits = requiredCumulativeCredits - Math.round(currentCgpa * totalCumulativeCreditsLastSem);

    // Calculate Current Credits
    const currentCredits = (totalCumulativeCredits - totalCumulativeCreditsLastSem) / 10;

    // Calculate Required SGPA
    const requiredSgpa = requiredCredits / currentCredits / 10;

    let sgpaReqOutput = '';

    // Handle negative required SGPA case
    if (requiredSgpa < 0) {
        alert('The required SGPA is negative. Re-enter your Target CGP!');
        sgpaReqOutput = `
            <div class="sgpareq-result">
                <div>Target CGPA cannot be attained this semester.</div>
            </div>
        `;
        document.getElementById('sgpareq').innerHTML = sgpaReqOutput;
        return;
    }

    // Handle required SGPA exceeding 10 case
    if (requiredSgpa > 10) {
        alert('The required SGPA is more than 10.0. Re-enter your Target CGPA');
        sgpaReqOutput = `
            <div class="sgpareq-result">
                <div>Target CGPA cannot be attained this semester.</div>
            </div>
        `;
        document.getElementById('sgpareq').innerHTML = sgpaReqOutput;
        return;
    }

    // Display the required SGPA if achievable
    sgpaReqOutput = `
        <div class="sgpareq-result">
            <div>You need <span> ${requiredSgpa.toFixed(2)} </span> in ${semesterForSgpa}th Semester to get ${requiredCgpa} CGPA</div>
        </div>
    `;

    document.getElementById('sgpareq').innerHTML = sgpaReqOutput;
}

// Function to toggle between SGPA and CGPA calculators
function toggleCalculator(type) {
    const sgpaCalc = document.getElementById('sgpa-calculator');
    const cgpaCalc = document.getElementById('cgpa-container');
    const sgpaReqCalc = document.getElementById('sgpareq-container');
    const buttons = document.querySelectorAll('.toggle-btn');
    if (type === 'sgpa') {
        sgpaCalc.classList.remove('hidden');
        cgpaCalc.classList.add('hidden');
        sgpaReqCalc.classList.add('hidden');
        buttons[0].classList.add('active');
        buttons[1].classList.remove('active');
        buttons[2].classList.remove('active');
    } else if (type === 'cgpa') {
        sgpaCalc.classList.add('hidden');
        cgpaCalc.classList.remove('hidden');
        sgpaReqCalc.classList.add('hidden');
        buttons[0].classList.remove('active');
        buttons[1].classList.add('active');
        buttons[2].classList.remove('active');
    } else if (type === 'sgpareq') { // Fixed identifier
        sgpaCalc.classList.add('hidden');
        cgpaCalc.classList.add('hidden');
        sgpaReqCalc.classList.remove('hidden'); // Now correctly unhides SGPA Target Finder
        buttons[0].classList.remove('active');
        buttons[1].classList.remove('active');
        buttons[2].classList.add('active');
    }
}

// Ensure SGPA is displayed by default when the page loads
window.onload = function () {
    toggleCalculator('sgpa'); // This will make sure SGPA is selected initially
};