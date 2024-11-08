import React from "react";
import header from '../header/header';
import './homePage.css';

const homePage = () => {
    return (
        <div className="homePage">
            <header />
            <div className="body-container">
                <div className="EditPrevi">
                    
                </div>
                <div className="InsertM3C">

                </div>
                <div className="SeePrevi">
                    <svg width="100" height="100">
                        <circle cx="50" cy="50" r="40" stroke="black" stroke-width="3" fill="red" />
                    </svg>
                </div>
            </div>
        </div>
    );
}

export default homePage;