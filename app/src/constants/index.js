export const courseTypes = [
  { name: "CM", color: "#FFD700" },
  { name: "TD", color: "#FF3131" },
  { name: "TP", color: "#38B6FF" },
  { name: "SAE", color: "#57B440" },
];

export const teachers = [
  { name: "AP" },
  { name: "LD" },
  { name: "CO" },
  { name: "SM" },
  { name: "NM" },
  { name: "--" },
];

export const curriculums = [
    { 
        name: "A1", 
        semesters: [
            {
                name: "Semestre 1",
                subjects: [
                    {name: "R1.01", courses: []}, 
                    {name: "R1.02", courses: []}, 
                    {name: "R1.03", courses: []}],                 
            },
            {
                name: "Semestre 2",
                subjects: [
                    {name: "R2.01", courses: []}, 
                    {name: "R2.02", courses: []}, 
                    {name: "R2.03", courses: []}],               
            },
        ], 
        groups: [], 
    },
    { 
        name: "A2",
        semesters: [
            {
                name: "Semestre 3",
                subjects: [
                    {name: "R3.01", courses: [{teacher: teachers[0], duration: 1, courseType: courseTypes[0], pos: {x: 0, y: 0},id: 1 },
                                            {teacher: teachers[1], duration: 2, courseType: courseTypes[1], pos: {x: 0, y: 0},id: 2 },]}, 
                    {name: "R3.02", courses: [{teacher: teachers[3], duration: 1.5, courseType: courseTypes[2], pos: {x: 0, y: 0},id: 3 },]}, 
                    {name: "R3.03", courses: [{teacher: teachers[2], duration: 3, courseType: courseTypes[0], pos: {x: 1, y: 1},id: 4 },]}],              
            },
            {
                name: "Semestre 4",
                subjects: [
                    {name: "R4.01", courses: []}, 
                    {name: "R4.02", courses: []}, 
                    {name: "R4.03", courses: []}],               
            },
        ], 
        groups: [{ name: "G4", subGroups: ["G4A", "G4B"] }, { name: "G5", subGroups: ["G5A", "G5B"] }], 
    },    
    { 
        name: "A3", 
        semesters: [
            {
                name: "Semestre 5",
                subjects: [
                    {name: "R5.01", courses: []}, 
                    {name: "R5.02", courses: []}, 
                    {name: "R5.03", courses: []}],            
            },
            {
                name: "Semestre 6",
                subjects: [
                    {name: "R6.01", courses: []}, 
                    {name: "R6.02", courses: []}, 
                    {name: "R6.03", courses: []}],                
            },
        ], 
        groups: [{ name: "G6", subGroups: ["G6A", "G6B"] }, { name: "G7", subGroups: ["G7A", "G7B"] }],  
    },
]