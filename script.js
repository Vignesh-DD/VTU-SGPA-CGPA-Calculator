const semesters = {
    1: [
        { name: 'Programming and Problem Solving in C', credits: 4 },
        { name: 'Discrete Mathematics and Graph Theory', credits: 3 },
        { name: 'Database Management Systems (DBMS)', credits: 3 },
        { name: 'Operating Systems', credits: 3 },
        { name: 'Web Technologies', credits: 3 },
        { name: 'DBMS and Web Technologies Laboratory', credits: 2 }
    ],
    2: [
        { name: 'Machine Learning and Data Analytics using python', credits: 4 },
        { name: 'Object Oriented Programming using JAVA', credits: 4 },
        { name: 'Data Structure and Algorithms', credits: 4 },
        { name: 'Software Engineering', credits: 3 },
        { name: 'Web Application Development', credits: 3 },
        { name: 'OOP JAVA Lab', credits: 2 },
        { name: 'DSA Lab', credits: 2 }
    ],
    // 🔥 NEW SEM 3
    3: [
        { name: 'Specialization 1', credits: 3, max: 100 },
        { name: 'Specialization 2', credits: 3, max: 100 },
        { name: 'Specialization 3', credits: 3, max: 100 },
        { name: 'Project Work', credits: 15, max: 200 }
    ]
};


// Show subjects
function showSemesterSubjects() {
    const selectedSemester = document.getElementById('semesterSelect').value;
    const semesterContainer = document.getElementById('semesters');
    semesterContainer.innerHTML = '';

    if (!semesters[selectedSemester]) {
        semesterContainer.innerHTML = '<p>No data available</p>';
        return;
    }

    const table = document.createElement('table');
    table.classList.add('grade-table');

    table.innerHTML = `<tr>
        <th>Course</th>
        <th>Credits</th>
        <th>Marks</th>
    </tr>`;

    semesters[selectedSemester].forEach(course => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${course.name}</td>
            <td>${course.credits}</td>
            <td>
                <input type="number" class="grade"
                data-credits="${course.credits}"
                data-max="${course.max || 100}"
                placeholder="0 - ${course.max || 100}" required>
            </td>
        `;
        table.appendChild(row);
    });

    semesterContainer.appendChild(table);
}


// SGPA
function calculateSGPA() {
    let totalCredits = 0;
    let weightedSum = 0;
    let allValid = true;
    let isFail = false;

    document.querySelectorAll('.grade').forEach(input => {
        const credits = parseInt(input.dataset.credits);
        const maxMarks = parseInt(input.dataset.max) || 100;
        let marks = parseFloat(input.value);

        if (isNaN(marks)) {
            allValid = false;
            input.style.border = '2px solid red';
            return;
        }

        if (marks < 0 || marks > maxMarks) {
            alert(`Marks must be between 0 and ${maxMarks}`);
            input.style.border = '2px solid red';
            return;
        }

        // project normalization
        if (maxMarks === 200) marks /= 2;

        let gp;
        if (marks >= 90) gp = 10;
        else if (marks >= 80) gp = 9;
        else if (marks >= 70) gp = 8;
        else if (marks >= 60) gp = 7;
        else if (marks >= 55) gp = 6;
        else if (marks >= 50) gp = 5;
        else {
            gp = 0;
            isFail = true;
        }

        weightedSum += gp * credits;
        totalCredits += credits;
        input.style.border = '';
    });

    if (!allValid) {
        alert("Enter all marks");
        return;
    }

    const sgpa = (weightedSum / totalCredits).toFixed(2);

    document.getElementById('result').textContent =
        `SGPA: ${sgpa}` + (isFail ? " (FAIL)" : "");
}


// CGPA
function calculateCGPA() {
    const newSemesterSgpa = parseFloat(document.getElementById('newSemesterSgpa').value);
    const semesterForSgpa = parseInt(document.getElementById('semesterForSgpa').value);
    const previousCgpa = parseFloat(document.getElementById('previousCgpa').value);

    if (isNaN(newSemesterSgpa) || !semesterForSgpa || isNaN(previousCgpa)) {
        alert('Fill all fields');
        return;
    }

    let oldCredits = 0;
    for (let i = 1; i < semesterForSgpa; i++) {
        semesters[i].forEach(s => oldCredits += s.credits);
    }

    let newCredits = 0;
    semesters[semesterForSgpa].forEach(s => newCredits += s.credits);

    const cgpa = ((previousCgpa * oldCredits) + (newSemesterSgpa * newCredits)) / (oldCredits + newCredits);

    document.getElementById('cgpaResult').innerHTML = `
        <div class="cgpa-result">
            Your CGPA after Semester ${semesterForSgpa}:
            <span>${cgpa.toFixed(2)}</span>
        </div>
    `;
}


// TARGET SGPA
function calculateReqSgpa() {
    const currentCgpa = parseFloat(document.getElementById('currentCgpa').value);
    const requiredCgpa = parseFloat(document.getElementById('requiredCgpa').value);
    const semester = parseInt(document.getElementById('semesterForSgpareq').value);

    if (isNaN(currentCgpa) || isNaN(requiredCgpa) || !semester) {
        alert('Fill all fields');
        return;
    }

    let totalCredits = 0;
    let prevCredits = 0;

    for (let i = 1; i <= semester; i++) {
        semesters[i].forEach(s => {
            totalCredits += s.credits;
            if (i < semester) prevCredits += s.credits;
        });
    }

    const requiredSgpa =
        ((requiredCgpa * totalCredits) - (currentCgpa * prevCredits)) /
        (totalCredits - prevCredits);

    let output;

    if (requiredSgpa > 10 || requiredSgpa < 0) {
        output = "Target not achievable";
    } else {
        output = `You need <span>${requiredSgpa.toFixed(2)}</span> SGPA`;
    }

    document.getElementById('sgpareq').innerHTML = `
        <div class="sgpareq-result">${output}</div>
    `;
}


// Toggle (same as yours)
function toggleCalculator(type) {
    const sgpaCalc = document.getElementById('sgpa-calculator');
    const cgpaCalc = document.getElementById('cgpa-container');
    const sgpaReqCalc = document.getElementById('sgpareq-container');
    const buttons = document.querySelectorAll('.toggle-btn');

    if (type === 'sgpa') {
        sgpaCalc.classList.remove('hidden');
        cgpaCalc.classList.add('hidden');
        sgpaReqCalc.classList.add('hidden');
    } else if (type === 'cgpa') {
        sgpaCalc.classList.add('hidden');
        cgpaCalc.classList.remove('hidden');
        sgpaReqCalc.classList.add('hidden');
    } else {
        sgpaCalc.classList.add('hidden');
        cgpaCalc.classList.add('hidden');
        sgpaReqCalc.classList.remove('hidden');
    }
}

window.onload = () => toggleCalculator('sgpa');