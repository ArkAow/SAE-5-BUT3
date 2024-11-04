import React from "react";
import './Login.css'; // Pour ajouter un style de base si nécessaire
import logo from '../../images/Universite_de_Limoges_white.png';

const LoginHeader = () => {

return (
    <div className="header-container">
        <div className="header-title">
            <h1 className="Title">Prévisionnelle IUT du Limousin</h1>
        </div>
        <img src={logo} alt="Profile" className="logo"></img>
    </div>
    );
};

export default LoginHeader;