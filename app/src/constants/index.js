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
                subjects: ["R1.01", "R1.02", "R1.03"],            
            },
            {
                name: "Semestre 2",
                subjects: ["R2.01", "R2.02", "R2.03"],            
            },
        ], 
        group: [{ name: "G1", subGroups: ["G1A", "G1B"] }, { name: "G2", subGroups: ["G2A", "G2B"] }, { name: "G3", subGroups: ["G3A", "G3B"] }], 
    },
    { 
        name: "A2",
        semesters: [
            {
                name: "Semestre 3",
                subjects: ["R3.01", "R3.02", "R3.03"],            
            },
            {
                name: "Semestre 4",
                subjects: ["R4.01", "R4.02", "R4.03"],            
            },
        ], 
        group: [{ name: "G4", subGroups: ["G4A", "G4B"] }, { name: "G5", subGroups: ["G5A", "G5B"] }], 
    },    
    { 
        name: "A3", 
        semesters: [
            {
                name: "Semestre 5",
                subjects: ["R5.01", "R5.02", "R5.03"],            
            },
            {
                name: "Semestre 6",
                subjects: ["R6.01", "R6.02", "R6.03"],            
            },
        ], 
        group: [{ name: "G6", subGroups: ["G6A", "G6B"] }, { name: "G7", subGroups: ["G7A", "G7B"] }],  
    },
]