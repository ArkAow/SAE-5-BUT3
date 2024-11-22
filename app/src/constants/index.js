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
        name: "BUT1", 
        ressources: ["R1.01", "R1.02", "R1.03"], 
        group: [{ name: "G1", subGroups: ["G1A", "G1B"] }, { name: "G2", subGroups: ["G2A", "G2B"] }, { name: "G3", subGroups: ["G3A", "G3B"] }], 
    },
    { 
        name: "BUT2",
        ressources: ["R2.01", "R2.02", "R2.03"],
        group: [{ name: "G4", subGroups: ["G4A", "G4B"] }, { name: "G5", subGroups: ["G5A", "G5B"] }], 
    },    
    { 
        name: "BUT3", 
        ressources: ["R3.01", "R3.02", "R3.03"],
        group: [{ name: "G6", subGroups: ["G6A", "G6B"] }, { name: "G7", subGroups: ["G7A", "G7B"] }],  
    },
]