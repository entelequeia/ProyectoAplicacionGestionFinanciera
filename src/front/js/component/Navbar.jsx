import React, { useState } from "react";
import { Link } from "react-router-dom";
import { BsCash } from "react-icons/bs";
import { IoIosLogOut } from "react-icons/io";
import { FaRegEnvelope } from "react-icons/fa";
import { MdOutlineGroups } from "react-icons/md";
import { CiHome, CiSettings } from "react-icons/ci";
import { IoAnalytics, IoPersonOutline, IoHelp } from "react-icons/io5";
import '../../styles/Navbar.css'

export function Navbar() {
	const [collapsed, setCollapsed] = useState(false);

	const toggleSidebar = () => {
		setCollapsed(!collapsed);
	};

	const handleLogout = () => {
		localStorage.removeItem("token");
		location.replace("/");
	}

	return (
		<div className={`sidebar ${collapsed ? "collapsed" : ""}`}>
			<button className="toggle-button" onClick={toggleSidebar}>
				{collapsed ? ">" : "<"}
			</button>

			<div className="sidebar-menu">
				<ul>
					<li>
						 <Link to="/home"> <CiHome /><span> Home</span></Link>
					</li>
					<li>
						 <Link to="/currency"> <BsCash /><span> Currency Conversion</span></Link>
					</li>
					<li>
						 <Link to="/messages"> <FaRegEnvelope /><span> Messages</span></Link>
					</li>
					<li>
						<Link to="/analytics"> <IoAnalytics /> <span> Analytics</span></Link>
					</li>
					<li>
						<Link to="/groups"> <MdOutlineGroups /> <span> Groups</span></Link>
					</li>
					<li>
						 <Link to="/profile"> <IoPersonOutline /><span> Profile</span></Link>
					</li>
					<li>
						 <Link to="/settings"> <CiSettings /><span> Settings</span></Link>
					</li>
				</ul>
			</div>

			<div className="sidebar-bottom">
				<ul>
					<li>
						 <Link to="/help"> <IoHelp /><span>Help</span></Link>
					</li>
					<li className="logout">
						 <Link to="/" onClick={handleLogout}> <IoIosLogOut /><span>Logout</span></Link>
					</li>
				</ul>
			</div>

			<div className="sidebar-footer">
				<span>© 2025 SafeHaven</span>
			</div>
		</div>
	);
};
