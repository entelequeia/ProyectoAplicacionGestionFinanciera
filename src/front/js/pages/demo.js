import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";
import { DonutChart } from "../component/DonutChart.jsx";

export const Demo = () => {
	const { store, actions } = useContext(Context);

	return (
		<div className="container">
			<DonutChart/>
		</div>
	);
};
