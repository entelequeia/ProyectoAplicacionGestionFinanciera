import React, { useEffect, useState } from "react";
import "../../styles/home.css";
import { _descriptors } from "chart.js/helpers";

export function Home() {
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('user')
        return savedUser ? JSON.parse(savedUser) : null
    })

    const [finance, setFinance] = useState([])

    useEffect(() => {
        const getFinance = async () => {
            try {
                const response = await fetch(`${process.env.BACKEND_URL || 'http://localhost:3001/'}api/get_finances/${user.id}`)
                const data = await response.json()
                console.log(data)

                if (response.ok) {
                    setFinance(data)
                } else {
                    console.log('Error getting finance', data)
                }
            } catch (error) {
                console.log('Error getting finance', error)
            }
        }

        getFinance()
    }, [])

    return (
        <div className="home-container">
            <h1>Bienvenido {user.name.replace(/\b\w/g, l => l.toUpperCase())}</h1>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Amount</th>
                        <th>Date</th>
                        <th>Category</th>
                        <th>Type</th>
                    </tr>
                </thead>
                <tbody>
                    {finance.map((item, key) => (
                        <tr key={key}>
                            <td>{item.id}</td>
                            <td>{item.name}</td>
                            <td>{item.description}</td>
                            <td>{item.amount} $</td>
                            <td>{item.date}</td>
                            <td>{item.category}</td>
                            <td>{item.type}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
