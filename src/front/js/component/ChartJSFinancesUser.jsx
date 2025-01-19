import React, { useContext, useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
} from "chart.js";
import { Context } from "../store/appContext";

// Registramos los componentes necesarios de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement
);

export function ChartJSFinancesUser() {
  const [income, setIncome] = useState([0]);
  const [bills, setBills] = useState([0]);
  const [date, setDate] = useState([0]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { store } = useContext(Context);

  // Datos de ejemplo
  const exampleData = {
    labels: ["Enero", "Febrero", "Marzo", "Abril", "Mayo"],
    datasets: [
      {
        label: "Ingresos (Ejemplo)",
        data: [500, 800, 600, 1000, 900],
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
      {
        label: "Gastos (Ejemplo)",
        data: [400, 300, 500, 700, 650],
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
      },
    ],
  };

  const exampleOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Ingresos y Gastos Mensuales (Datos de Ejemplo)",
      },
    },
  };

  // Hook useEffect para obtener los datos
  useEffect(() => {
    const getFinance = async () => {
      try {
        const response = await fetch(
          `${process.env.BACKEND_URL || "http://localhost:3001/"}api/finances/${store.userData.id}`
        );
        if (!response.ok) throw new Error("Error fetching data");
        const data = await response.json();

        const billsData =
          data?.filter((item) => item.id_category === 1).map((item) => item.amount) || [];
        const incomesData =
          data?.filter((item) => item.id_category === 2).map((item) => item.amount) || [];
        const dateData =
          data?.map((item) =>
            new Date(item.date).toLocaleDateString("es-ES", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })
          ) || [];

        setBills(billsData);
        setIncome(incomesData);
        setDate(dateData);
      } catch (err) {
        console.error("Error fetching finances:", err);
        setError("Hubo un error al obtener los datos financieros.");
      } finally {
        setLoading(false);
      }
    };

    getFinance();
  }, [store.userData.id]);

  // Si los datos están cargándose, mostramos un mensaje de carga
  if (loading) return <div>Cargando datos...</div>;

  // Si hay un error, mostramos un mensaje de error
  if (error) {
    return (
      <div>
        <h2>No se pudo conectar a la API</h2>
        <p>Por favor, verifica tu conexión a internet o intenta más tarde.</p>
        <Line data={exampleData} options={exampleOptions} />
      </div>
    );
  }

  // Si los datos se cargaron correctamente, mostramos el gráfico con los datos obtenidos
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
}