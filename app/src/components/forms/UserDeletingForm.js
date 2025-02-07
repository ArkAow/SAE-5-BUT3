import React from "react";

const UserDeletingForm = ({user, deleteUser, setDeletingUser, isSaving}) => {
  const handleLeaving = () => {
    setDeletingUser(false);
  }

  const handleDeletingUser = async () => {
    console.log(user);
    await deleteUser(user.id);
    handleLeaving()
  }

  return (
    <>
      <div className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 ${isSaving ? 'cursor-wait' : ''}`}>
        <div className="tooltip-centered-bigger min-w-[450px] w-1/3">
          <h2 className="text-2xl text-center mb-4">
            Voulez-vous vraiment <span className="text-red-500 font-bold">supprimer</span> l'utilisateur ayant pour adresse mail {user.email}?
          </h2>
          <form onSubmit={handleDeletingUser} className="space-y-2">
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

export default UserDeletingForm;