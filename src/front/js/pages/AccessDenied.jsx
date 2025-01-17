import React from "react";
import { Link } from "react-router-dom";
import "../../styles/AccessDenied.css";


export function AccessDenied() {
  return (
    <div className="denied-container">
      
    <h1 className="denied-title"> We are sorry...</h1>
      <p>
        The page you're trying to access has restricted access. <br/>Please refer to your system administrator.
      </p>
      <button className="returnButton"><Link to="/" className="denied-link">homepage</Link></button>
    </div>
    
  );
};