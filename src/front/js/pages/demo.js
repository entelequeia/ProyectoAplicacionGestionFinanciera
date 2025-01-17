import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";

import { Context } from "../store/appContext";
import { AccessDenied } from "./AccessDenied.jsx";

export const Demo = () => {
	const { store, actions } = useContext(Context);

	return (
		<div className="container"> 
		<AccessDenied/>
		</div>
	);
};
