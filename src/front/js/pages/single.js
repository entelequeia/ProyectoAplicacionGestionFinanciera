import React, { useState, useEffect, useContext } from "react";
import PropTypes from "prop-types";
import { useParams } from "react-router-dom";
import { Context } from "../store/appContext";

export const Single = props => {
	const { store, actions } = useContext(Context);
	const params = useParams();
	const [groupId, setGroupId] = useState(params.theid);
	const [email, setEmail] = useState(params.theemail.replaceAll("DOT", "."));
	const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user')
    return savedUser ? JSON.parse(savedUser) : null
  })
	const [message, setMessage] = useState(null);

	console.log("params", groupId, email);

	useEffect(() => {
		const addUserToGroup = async () => {
			const response = await fetch(`${process.env.BACKEND_URL || 'http://localhost:3001/'}/api/add_user_to_group/${user?.id}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					//Authorization: `Bearer ${localStorage.getItem("token")}`
				},
				body: JSON.stringify({ 'id_group': groupId })
			})

			const data = await response.json()
			if (response.ok){
				setMessage(data.message)
			} else {
				setMessage(data.error)
			}
		}

		addUserToGroup()
	}, [params]);

	return (
		<div className="jumbotron">
			El usuario con email {email} ha sido añadido al grupo {groupId}
			{message && <div className="alert alert-primary" role="alert">{message}</div>}
		</div>
	);
};

Single.propTypes = {
	match: PropTypes.object
};
