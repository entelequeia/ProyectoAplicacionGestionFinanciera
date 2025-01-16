const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			userData: {},
			userGroup: {},
		},
		actions: {
			addUserData: (data) => {
				setStore({ userData: data });
			},
			addUserGroup: (data) => {
				setStore({ userGroup: data });
			},
		}
	};
};

export default getState;
