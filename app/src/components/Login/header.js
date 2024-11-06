import React from "react";
import './header.css'; 
import logo from '../../images/Universite_de_Limoges_white.png';

const LoginHeader = () => {

return (
    <div className="header-container">
        <div>
            <h1 className="Title">Prévisionnel IUT du Limousin</h1>
        </div>
        <img src={logo} alt="Profile" className="logo"></img>
    </div>
    );
};

export default LoginHeader;