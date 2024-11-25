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
                    {name: "R1.01"}, 
                    {name: "R1.02"}, 
                    {name: "R1.03"}],                 
            },
            {
                name: "Semestre 2",
                subjects: [
                    {name: "R2.01"}, 
                    {name: "R2.02"}, 
                    {name: "R2.03"}],               
            },
        ], 
        groups: [{ name: "G1", subGroups: ["G1A", "G1B"] }, { name: "G2", subGroups: ["G2A", "G2B"] }, { name: "G3", subGroups: ["G3A", "G3B"] }], 
    },
    { 
        name: "A2",
        semesters: [
            {
                name: "Semestre 3",
                subjects: [
                    {name: "R3.01"}, 
                    {name: "R3.02"}, 
                    {name: "R3.03"}],              
            },
            {
                name: "Semestre 4",
                subjects: [
                    {name: "R4.01"}, 
                    {name: "R4.02"}, 
                    {name: "R4.03"}],               
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
                    {name: "R5.01"}, 
                    {name: "R5.02"}, 
                    {name: "R5.03"}],            
            },
            {
                name: "Semestre 6",
                subjects: [
                    {name: "R6.01"}, 
                    {name: "R6.02"}, 
                    {name: "R6.03"}],                
            },
        ], 
        groups: [{ name: "G6", subGroups: ["G6A", "G6B"] }, { name: "G7", subGroups: ["G7A", "G7B"] }],  
    },
]