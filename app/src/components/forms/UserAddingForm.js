import React, { useState } from "react";
const ROLES = ["superadmin", "admin", "extendedviewer", "restrictedviewer"];

const UserAddingForm = ({addUser, departments, setAddingUser, isDepartmentLoading, isSaving}) => {
  const [userEmail, setUserEmail] = useState("");
  const [userRole, setUserRole] = useState("");
  const [userDepartments, setUserDepartments] = useState([]);
  const [error, setError] = useState("");

  const handleLeaving = () => {
    setUserDepartments([]);
    setUserEmail("");
    setUserRole("");
    setAddingUser(false);
  };

  const handleToggleDepartment = (department) => {
    setUserDepartments((prev) =>
      prev.some((d) => d.id === department.id)
        ? prev.filter((d) => d.id !== department.id)
        : [...prev, department]
    );
  };

  const handleAddingUser = async (e) => {
    e.preventDefault();

    if (!userEmail.trim()) {
      setError("Une adresse email est obligatoire.");
      return;
    }
    if (!userRole) {
      setError("Veuillez sélectionner un rôle.");
      return;
    }
    if (userDepartments.length === 0) {
      setError("Veuillez sélectionner au moins un département.");
      return;
    }
    setError("");
    const payload = {
      email: userEmail,
      role: userRole,
      departments: userDepartments.map((d) => d.id),
    };
    await addUser(payload);
    handleLeaving();
  };

  return (
    <>
      <div className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 ${isSaving ? 'cursor-wait' : ''}`}f>
        <div className="tooltip-centered-bigger min-w-[450px] w-1/3">
          <h2 className="text-2xl font-bold mb-4">Ajouter un utilisateur</h2>
          <form onSubmit={handleAddingUser} className="space-y-2">
            <div>
              <label className="block mb-1 font-bold">Email de l'utilisateur<span className="text-red-500">*</span> :</label>
              <input
                type="email"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                className="flex w-full items-center bg-gray-200 p-2 rounded-xl"
                required/>
            </div>
            <p className="text-xs text-justify">
              <span className="text-xs underline">Email :</span> L'adresse email doit être celle de l'IUT pour se connecter avec les identifiants Biome.
            </p>
            
            <div>
              <label className="block mb-1 font-bold">Rôle de l'utilisateur<span className="text-red-500">*</span> :</label>
              <select
                value={userRole}
                onChange={(e) => setUserRole(e.target.value)}
                className="w-full bg-gray-200 p-2 rounded-xl"
                required>
                <option value="" disabled>-- Sélectionner un rôle --</option>
                {ROLES.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>

            {isDepartmentLoading ? (
              <div className="flex flex-col items-center justify-center p-6 rounded-lg transition-opacity duration-300 opacity-100 w-full">
                  <div className="spinner"></div>
                  <div className="text-white text-xl font-bold text-center mt-4 max-h-[100px] h-max">
                  Chargement des départements...
                  </div>
              </div>
            ) : (
              <>
                {departments.length === 0 ? (
                  <span className="w-full text-center font-bold">Il n'y a pas de département<span className="text-red-500">*</span></span>
                ) : (
                  <div className="space-y-2">
                    <label className="block mb-1 font-bold">Selectionnez les departments<span className="text-red-500">*</span> :</label>
                    <div className="flex flex-wrap gap-2 w-full justify-start">
                      {departments.map((department) => {
                        const isSelected = userDepartments.some((c) => c.id === department.id);
                        return (
                          <button
                            key={department.id}
                            type="button"
                            className={`px-4 py-2 rounded-md transition-all 
                              ${isSelected ?
                                "bg-primarytint text-white" :
                                "bg-primary text-white hover:bg-primaryshade"}`}
                            onClick={() => handleToggleDepartment(department)}>
                            {department.name}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </>
            )}
            <div className="mt-4">
              <p className="font-semibold">Départements sélectionnés :</p>
              <ul className="list-disc list-inside">
                {userDepartments.length == 0 ? (
                  <li> Auncun département selectionné</li>
                ) : (
                  <>
                    {userDepartments.map((c) => (
                    <li key={c.id}>{c.name}</li>
                    ))}
                  </>
                )}
              </ul>
            </div>
            <p className="text-red-500 text-sm">* champ(s) obligatoire(s)</p>
            {error && <p className="text-red-500">{error}</p>}
            <div className="flex justify-center space-x-2 w-full">
              <button type="button" onClick={handleLeaving} className="btn-default p-2" disabled={isSaving}>
                  Retour
              </button>
              <button type="submit" className="btn-default p-2" disabled={isSaving}>
                  Valider
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default UserAddingForm;