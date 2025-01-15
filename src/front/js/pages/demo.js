import React, { useState, useEffect, useContext } from "react";
import { FinanceForm } from "./FinanzasLogin.jsx";
import { Context } from "../store/appContext";

export const Demo = () => {
	const { store, actions } = useContext(Context);

	return (
		<div className="container">
			<FinanceForm/>
		</div>
	);
};
