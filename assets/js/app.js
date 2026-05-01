document.addEventListener('DOMContentLoaded', () => {
    const semesterCatalog = window.semesterCatalog || {};
    const semesterSelect = document.getElementById('semesterSelect');
    const semesterContainer = document.getElementById('semesters');
    const resultContainer = document.getElementById('result');
    const dashboardContainer = document.getElementById('resultsDashboard');
    const sgpareqContainer = document.getElementById('sgpareq');

    const semesterResults = {};

    const panelMap = {
        sgpa: document.getElementById('sgpa-calculator'),
        sgpareq: document.getElementById('sgpareq-container')
    };

    function getSemesterData(semesterNumber) {
        return semesterCatalog[String(semesterNumber)] || semesterCatalog[semesterNumber] || null;
    }

    function getSemesterCredits(semesterNumber) {
        const semesterData = getSemesterData(semesterNumber);

        if (!semesterData) {
            return 0;
        }

        return semesterData.courses.reduce((sum, course) => sum + course.credits, 0);
    }

    function getGradePoint(marks) {
        if (marks >= 90) return 10;
        if (marks >= 80) return 9;
        if (marks >= 70) return 8;
        if (marks >= 60) return 7;
        if (marks >= 50) return 6;
        if (marks >= 45) return 5;
        if (marks >= 40) return 4;
        return 0;
    }

    function formatPercent(value) {
        return `${value.toFixed(2)}%`;
    }

    function clampPercent(value) {
        return Math.min(100, Math.max(0, value));
    }

    function animateResultPop(element) {
        if (!element || !window.motion || !window.motion.animate) {
            return;
        }

        window.motion.animate(
            element,
            { opacity: [0, 1], scale: [0.96, 1] },
            { duration: 0.28, easing: 'ease-out' }
        );
    }

    function animatePanel(element) {
        if (!element || !window.gsap) {
            return;
        }

        window.gsap.fromTo(
            element,
            { autoAlpha: 0, y: 12 },
            { autoAlpha: 1, y: 0, duration: 0.35, ease: 'power2.out' }
        );
    }

    function clearSgpaResult() {
        resultContainer.textContent = '';
    }

    function validatePassFail() {
        const passFailSelects = document.querySelectorAll('.passfail-select');
        let isValid = true;
        let hasFail = false;

        passFailSelects.forEach((select) => {
            if (!select.value) {
                select.style.border = '2px solid red';
                isValid = false;
            } else {
                select.style.border = '';
                if (select.value === 'fail') {
                    hasFail = true;
                }
            }
        });

        return { isValid, hasFail };
    }

    function renderSemesterTable(semesterNumber) {
        const semesterData = getSemesterData(semesterNumber);

        semesterContainer.innerHTML = '';

        if (!semesterData) {
            semesterContainer.innerHTML = '<p>No data available</p>';
            return;
        }

        const table = document.createElement('table');
        table.classList.add('grade-table');

        table.innerHTML = `
            <tr>
                <th>Course</th>
                <th>Credits</th>
                <th>Marks</th>
            </tr>
        `;

        semesterData.courses.forEach((course, index) => {
            const row = document.createElement('tr');
            const label = course.code ? `${course.code}: ${course.title}` : course.title || course.label;
            let courseCell = label || 'Specialization Elective';

            if (course.type === 'elective') {
                courseCell = `<div class="elective-label">${course.label}</div>`;
            }

            let marksCell;

            if (course.grading === 'passfail') {
                    const optionalOption = course.passFailOptional
                        ? '<option value="not-applicable">Not Applicable</option>'
                        : '';

                marksCell = `
                    <select class="passfail-select" data-course-index="${index}">
                        <option value="" selected>Select</option>
                        <option value="pass">Pass</option>
                        <option value="fail">Fail</option>
                            ${optionalOption}
                    </select>
                `;
            } else {
                    const maxMarks = course.maxMarks || 100;
                marksCell = `
                    <input
                        type="number"
                        class="grade"
                        data-credits="${course.credits}"
                            data-max="${maxMarks}"
                        min="0"
                            max="${maxMarks}"
                            placeholder="0 - ${maxMarks}"
                        required
                    >
                `;
            }

            row.innerHTML = `
                <td>${courseCell}</td>
                <td>${course.credits}</td>
                <td>${marksCell}</td>
            `;
            table.appendChild(row);
        });

        const summary = document.createElement('div');
        summary.classList.add('semester-summary');
        summary.innerHTML = `
            <div>${semesterData.label} total credits: <strong>${getSemesterCredits(semesterNumber)}</strong></div>
            <div class="scheme-focus">${semesterData.summary}</div>
        `;

        semesterContainer.appendChild(summary);
        semesterContainer.appendChild(table);

    }

    function updateDashboard() {
        const semesters = Object.keys(semesterResults).sort((a, b) => Number(a) - Number(b));

        if (semesters.length === 0) {
            dashboardContainer.classList.add('hidden');
            dashboardContainer.innerHTML = '';
            return;
        }

        let totalCredits = 0;
        let totalPoints = 0;

        const listItems = semesters.map((semester) => {
            const sgpa = semesterResults[semester];
            const semesterCredits = getSemesterCredits(semester);

            totalCredits += semesterCredits;
            totalPoints += sgpa * semesterCredits;

            return `
                <li>
                    <span>Semester ${semester}</span>
                    <strong>${sgpa.toFixed(2)}</strong>
                </li>
            `;
        }).join('');

        const cgpa = totalCredits > 0 ? totalPoints / totalCredits : 0;
        const percentage = clampPercent((cgpa - 0.75) * 10);

        dashboardContainer.innerHTML = `
            <h3>Results Dashboard</h3>
            <div class="results-grid">
                <div class="results-card">
                    <h4>Semester SGPA</h4>
                    <ul class="results-list">${listItems}</ul>
                </div>
                <div class="results-card">
                    <h4>Running CGPA</h4>
                    <div class="results-metric">${cgpa.toFixed(2)}</div>
                    <div class="results-sub">Percentage: <span>${formatPercent(percentage)}</span></div>
                </div>
            </div>
        `;
        dashboardContainer.classList.remove('hidden');
        animateResultPop(dashboardContainer);
    }

    function calculateSGPA() {
        const selectedSemester = semesterSelect.value;
        const grades = document.querySelectorAll('.grade');
        let totalCredits = 0;
        let weightedSum = 0;
        let allValid = true;
        let isFail = false;

        if (!selectedSemester) {
            alert('Select a semester first');
            return;
        }

        const passFailStatus = validatePassFail();

        if (!passFailStatus.isValid) {
            alert('Complete all pass/fail selections');
            return;
        }

        grades.forEach((input) => {
            const credits = Number.parseInt(input.dataset.credits, 10);
            const maxMarks = Number.parseInt(input.dataset.max, 10) || 100;
            const marks = Number.parseFloat(input.value);

            if (Number.isNaN(marks)) {
                allValid = false;
                input.style.border = '2px solid red';
                return;
            }

            if (marks < 0 || marks > maxMarks) {
                alert(`Marks must be between 0 and ${maxMarks}`);
                input.style.border = '2px solid red';
                allValid = false;
                return;
            }

            const normalizedMarks = maxMarks === 100 ? marks : (marks / maxMarks) * 100;
            const gradePoint = getGradePoint(normalizedMarks);

            if (gradePoint === 0) {
                isFail = true;
            }

            weightedSum += gradePoint * credits;
            totalCredits += credits;
            input.style.border = '';
        });

        if (!allValid) {
            alert('Enter all marks');
            return;
        }

        if (totalCredits === 0) {
            alert('No graded courses found for this semester');
            return;
        }

        const sgpa = weightedSum / totalCredits;
        semesterResults[selectedSemester] = sgpa;

        if (passFailStatus.hasFail) {
            isFail = true;
        }

        resultContainer.textContent = `SGPA: ${sgpa.toFixed(2)}${isFail ? ' (FAIL)' : ''}`;
        animateResultPop(resultContainer);
        updateDashboard();
    }

    function calculateReqSgpa() {
        const currentCgpa = Number.parseFloat(document.getElementById('currentCgpa').value);
        const requiredCgpa = Number.parseFloat(document.getElementById('requiredCgpa').value);
        const semester = Number.parseInt(document.getElementById('semesterForSgpareq').value, 10);

        if (Number.isNaN(currentCgpa) || Number.isNaN(requiredCgpa) || Number.isNaN(semester)) {
            alert('Fill all fields');
            return;
        }

        let totalCredits = 0;
        let prevCredits = 0;

        for (let semesterIndex = 1; semesterIndex <= semester; semesterIndex += 1) {
            const semesterCredits = getSemesterCredits(semesterIndex);
            totalCredits += semesterCredits;

            if (semesterIndex < semester) {
                prevCredits += semesterCredits;
            }
        }

        if (totalCredits === 0 || totalCredits === prevCredits) {
            alert('Selected semester data is not available');
            return;
        }

        const requiredSgpa = ((requiredCgpa * totalCredits) - (currentCgpa * prevCredits)) / (totalCredits - prevCredits);

        let output;
        if (requiredSgpa > 10 || requiredSgpa < 0) {
            output = 'Target not achievable';
        } else {
            output = `You need <span>${requiredSgpa.toFixed(2)}</span> SGPA`;
        }

        sgpareqContainer.innerHTML = `
            <div class="sgpareq-result">${output}</div>
        `;
        animateResultPop(sgpareqContainer);
    }

    function toggleCalculator(type) {
        const buttons = document.querySelectorAll('.toggle-btn');

        Object.entries(panelMap).forEach(([panelName, panelElement]) => {
            if (!panelElement) {
                return;
            }

            if (panelName === type) {
                panelElement.classList.remove('hidden');
                animatePanel(panelElement);
            } else {
                panelElement.classList.add('hidden');
            }
        });

        buttons.forEach((button) => {
            button.classList.toggle('active', button.dataset.panel === type);
        });
    }

    semesterSelect.addEventListener('change', (event) => {
        const selectedSemester = event.target.value;
        clearSgpaResult();
        renderSemesterTable(selectedSemester);
    });

    document.querySelectorAll('.toggle-btn').forEach((button) => {
        button.addEventListener('click', () => toggleCalculator(button.dataset.panel));
    });

    document.getElementById('calculateButton').addEventListener('click', calculateSGPA);
    document.getElementById('calculateReqButton').addEventListener('click', calculateReqSgpa);

    toggleCalculator('sgpa');
});
