import React from "react";

const DepartmentSelect = ({ departments, selectedDepartment, setSelectedDepartment }) => {
    const handleChange = (e) => {
        const selectedDept = departments.find(dept => dept.id === e.target.value);
        setSelectedDepartment(selectedDept);
    };

    return (
        <>
            {departments.length > 1 && (
                <div className="absolute h-16 flex flex-row items-center top-16 left-52 bg-black bg-opacity-70 rounded-lg px-3">
                    <label className="block text-white text-sm font-semibold mr-2">
                        Département sélectionné :
                    </label>
                    <select
                        className="p-2 rounded-lg bg-white border-2 border-gray-300 text-black"
                        value={selectedDepartment?.id || ""}
                        onChange={handleChange}
                    >
                        {departments.length === 0 ? (
                            <option disabled>Aucun département disponible</option>
                        ) : (
                            departments.map((dept) => (
                                <option key={dept.id} value={dept.id}>
                                    {dept.name}
                                </option>
                            ))
                        )}
                    </select>
                </div>
            )}
        </>
    );
};

export default DepartmentSelect;