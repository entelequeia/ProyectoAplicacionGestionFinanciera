import React, { useContext, useEffect, useState } from "react";
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement
} from "chart.js";
import { Context } from "../store/appContext";

// Registrar los componentes de Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, LineElement);

export function ChartJSFinancesUser() {
  const [income, setIncome] = useState([0]);
  const [bills, setBills] = useState([0]);
  const [date, setDate] = useState([0]);
  const [loading, setLoading] = useState(true); // Estado de carga
  const [error, setError] = useState(null); // Estado de error
  const { store, actions } = useContext(Context);

  useEffect(() => {
    const getFinance = async () => {
      try {
        const response = await fetch(`${process.env.BACKEND_URL || "http://localhost:3001/"}api/finances2/2`);
        if (!response.ok) throw new Error("Error fetching data");
        const data = await response.json();

        // Validación para asegurar que los datos existen
        const billsData =
          data?.filter((item) => item.id_category === 1) // Filtra los objetos son Gastos
            .map((item) => item.amount) || [];

        const incomesData = data
          .filter(item => item.id_category === 2) // Filtra los objetos son Ingresos
          .map(item => item.amount) || [];

        const dateData =
          data?.map((item) =>
            item.date ? new Date(item.date).toLocaleDateString("es-ES", {
              year: "numeric",
              month: "long",
              day: "numeric",
            }) : "Fecha no disponible"
          ) || [];

        // Actualizar estados
        setBills(billsData);
        setIncome(incomesData);
        setDate(dateData);
      } catch (error) {
        console.log('Error getting finance', error);
        setError("Hubo un error al obtener los datos financieros.");
      } finally {
        setLoading(false);
      }
    };

    getFinance();
  }, [store.userData.id]);

  // Estados de carga y error:
  if (loading) return <div>Cargando datos...</div>;
  if (error) return <div>{error}</div>;

  const data = {
    labels: date,
    datasets: [
      {
        label: "Ingresos",
        data: income,
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
      {
        label: "Gastos",
        data: bills,
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Ingresos y Gastos Mensuales",
      },
    },
  };

  return <Line data={data} options={options} />;
};

