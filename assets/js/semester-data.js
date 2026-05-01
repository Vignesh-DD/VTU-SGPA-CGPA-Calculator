const specializationOptions = [
    'Data Science and Analytics (A)',
    'Web Application Development (B)',
    'Network and System Administration (C)'
];

window.semesterCatalog = {
    1: {
        label: 'Semester 1',
        summary: 'I SEMESTER (MCA)',
        courses: [
            { code: 'MMC101', title: 'Programming and Problem-Solving in C', credits: 4, maxMarks: 100 },
            { code: 'MMC102', title: 'Discrete Mathematics and Graph Theory', credits: 3, maxMarks: 100 },
            { code: 'MMC103', title: 'Database Management Systems (DBMS)', credits: 3, maxMarks: 100 },
            { code: 'MMC104', title: 'Operating System', credits: 3, maxMarks: 100 },
            { code: 'MMC105', title: 'Web Technologies', credits: 3, maxMarks: 100 },
            { code: 'MMCL106', title: 'DBMS and Web Technologies Laboratory', credits: 2, maxMarks: 100 },
            {
                code: 'MRMI107',
                title: 'Research Methodology and IPR (Online)',
                credits: 0,
                grading: 'passfail',
                passFailOptional: true
            }
        ]
    },
    2: {
        label: 'Semester 2',
        summary: 'II SEMESTER (MCA)',
        courses: [
            { code: 'MMC201', title: 'Machine Learning and Data Analytics using Python', credits: 4, maxMarks: 100 },
            { code: 'MMC202', title: 'Object Oriented Programming using JAVA', credits: 4, maxMarks: 100 },
            { code: 'MMC203', title: 'Data Structure and Algorithms', credits: 4, maxMarks: 100 },
            { code: 'MMC204', title: 'Software Engineering', credits: 3, maxMarks: 100 },
            { code: 'MMC205', title: 'Web Application Development', credits: 3, maxMarks: 100 },
            { code: 'MMCL206', title: 'Object Oriented Programming using JAVA Laboratory', credits: 2, maxMarks: 100 },
            { code: 'MMCL207', title: 'Data Structure and Algorithms Laboratory', credits: 2, maxMarks: 100 },
            {
                code: 'MAEC258',
                title: 'Ability Enhancement Courses with Seminar-I',
                credits: 0,
                grading: 'passfail'
            }
        ]
    },
    3: {
        label: 'Semester 3',
        summary: 'III SEMESTER (B)',
        courses: [
            {
                label: 'Specialization Elective 1',
                type: 'elective',
                credits: 3,
                maxMarks: 100,
                options: specializationOptions
            },
            {
                label: 'Specialization Elective 2',
                type: 'elective',
                credits: 3,
                maxMarks: 100,
                options: specializationOptions
            },
            {
                label: 'Specialization Elective 3',
                type: 'elective',
                credits: 3,
                maxMarks: 100,
                options: specializationOptions
            },
            { code: 'MPRJ384', title: 'Project Work', credits: 15, maxMarks: 200 }
        ]
    },
    4: {
        label: 'Semester 4',
        summary: 'IV SEMESTER (B)',
        courses: [
            { code: 'MMC411', title: 'Online Courses (12 weeks duration)', credits: 3, maxMarks: 100 },
            { code: 'MMC452', title: 'Technical Seminar', credits: 2, maxMarks: 100 },
            { code: 'MINT483', title: 'Research Internship / Industry-Internship / Startup Internship', credits: 11, maxMarks: 200 }
        ]
    }
};
