import React, { useEffect, useState } from "react";
import "../../styles/home.css";
import { ChartJSFinancesUser } from "../component/ChartJSFinancesUser.jsx";

export function Home() {
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('user')
        return savedUser ? JSON.parse(savedUser) : null
    });
    const [gastos, setGastos] = useState(0)
    const [ingresos, setIngresos] = useState(0)
    const [finance, setFinance] = useState([]);

    useEffect(() => {
        const getFinance = async () => {
            try {
                const response = await fetch(`${process.env.BACKEND_URL || 'http://localhost:3001/'}api/get_finances_all/${user.id}`);
                const data = await response.json();

                if (response.ok) {
                    setFinance(data);
                } else {
                    console.error('Error getting finance', data);
                }
            } catch (error) {
                console.error('Error getting finance', error);
            }
        };
        getFinance();
    }, [user]);

    useEffect(() => {
        const gastosTotales = finance
            .filter(item => item.category === "Gasto")  // Filtramos los gastos
            .reduce((acc, item) => acc + item.amount, 0); // Sumamos los gastos
        setGastos(gastosTotales);

        const ingresosTotales = finance
            .filter(item => item.category === "Ingreso")  // Filtramos los Ingreso
            .reduce((acc, item) => acc + item.amount, 0); // Sumamos los ingresos
        setIngresos(ingresosTotales);
    }, [finance])

    console.log(finance);
    console.log(gastos);

    return (
        <div className="dashboard-container">
            <main className="main-content">
                <header className="header">
                    <h1>Welcome, {user.name.replace(/\b\w/g, (l) => l.toUpperCase())}</h1>
                    <div className="header-right">
                        {/* Checkbox del modo oscuro */}
                        <label className="dark-mode-toggle">
                            <input
                                type="checkbox"
                                disabled
                            />
                            <span className="toggle-slider"></span>
                        </label>
                        {/* Icono del usuario */}
                        <div className="user-icon" title="Account Settings">
                            <img
                                src={`https://unavatar.io/${user.name}`}
                                alt="User Icon"
                                className="profile-picture"
                            />
                        </div>
                    </div>
                </header>


                <div className="section-row">
                    <section className="transactions-list">
                        <h3>Recent Transactions</h3>
                        <ul>
                            {finance.map((item, key) => (
                                <li key={key} className="transaction-item">
                                    <div className="transaction-logo">
                                        <img
                                            src={`https://unavatar.io/${item.name}`}
                                            alt={`${item.name} logo`}
                                        />
                                    </div>
                                    <div className="transaction-info">
                                        <strong>{item.name}</strong>
                                        <p className="description">
                                            {item.description || "No description"} •{" "}
                                            <span className="date">
                                                {new Date(item.date).toLocaleDateString("es-ES", {
                                                    day: "numeric",
                                                    month: "long",
                                                    year: "numeric",
                                                })}
                                            </span>
                                        </p>
                                    </div>
                                    <div className="transaction-amount">
                                        <span className={`amount ${item.category === "Gasto" ? "expense" : "income"}`}>
                                            {item.category === "Gasto" ? "-" : "+"} {item.amount} $
                                        </span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </section>

                    <section className="overview">
                        <div className="balance">
                            <h3>Your Total Balance</h3>
                            <h1>{(ingresos - gastos).toLocaleString("en-US", { style: "decimal" })} $</h1>
                            <p className="current-date">{new Date().toLocaleDateString("en-US", {
                                weekday: "long",
                                year: "numeric",
                                month: "long",
                                day: "numeric"
                            })}</p>
                            <button disabled className="add-finance-btn">Add New Finance</button>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
}
