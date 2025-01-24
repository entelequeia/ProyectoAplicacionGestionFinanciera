import React, { useContext, useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Context } from "../store/appContext";

ChartJS.register(ArcElement, Tooltip, Legend);

export function DonutChart() {
  const [categories, setCategories] = useState([]);
  const [values, setValues] = useState([]);
  const [total, setTotal] = useState(0);
  const [details, setDetails] = useState([]);
  const [error, setError] = useState(null);
  const { store } = useContext(Context);

  const categoryMap = {
    3: "Transporte",
    4: "Transferencias",
    5: "Comida",
    6: "Ocio",
    7: "Supermercado",
    8: "Otros",
  };

  const backgroundColors = ["#FF5733", "#33FF57", "#3357FF", "#FFC300", "#FF33A8"];

  useEffect(() => {
    const getFinanceData = async () => {
      try {
        const userId = store.userData?.id || 2;
        const response = await fetch(
          `${process.env.BACKEND_URL || "http://localhost:3001/"}api/finances2/${userId}`
        );
        const data = await response.json();

        if (!Array.isArray(data) || !data.length) {
          setError("No tienes finanzas registradas.");
          setCategories([]);
          setValues([]);
          setDetails([]);
          setTotal(0);
          return;
        }

        const processedData = data.map((item) => ({
          category_name: categoryMap[item.id_category] || "Otros",
          name: item.name,
          amount: item.amount,
        }));

        const categoriesData = [...new Set(processedData.map((item) => item.category_name))];
        const valuesData = categoriesData.map((category) =>
          processedData
            .filter((item) => item.category_name === category)
            .reduce((sum, item) => sum + item.amount, 0)
        );

        const detailsData = categoriesData.map((category) => ({
          category,
          items: processedData.filter((item) => item.category_name === category),
        }));

        setCategories(categoriesData);
        setValues(valuesData);
        setDetails(detailsData);
        setTotal(valuesData.reduce((sum, val) => sum + val, 0));
        setError(null);
      } catch (err) {
        console.error("Error obteniendo los datos de la API:", err);
        setError("Hubo un problema al conectar con el servidor.");
      }
    };

    getFinanceData();
  }, [store.userData?.id]);

  const data = {
    labels: categories,
    datasets: [
      {
        label: "Gastos",
        data: values,
        backgroundColor: backgroundColors.slice(0, categories.length),
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      tooltip: {
        callbacks: {
          label: (context) => {
            const category = context.label;
            const value = context.raw;
            return `${category}: €${value}`;
          },
        },
      },
      legend: {
        position: "top",
      },
    },
    elements: {
      arc: {
        borderWidth: 2,
        borderColor: "#ffffff",
        backgroundColor: "#ff0",
        hoverBorderColor: "#fff",
        hoverBorderWidth: 3,
        backgroundColor: backgroundColors.slice(0, categories.length),
      },
    },
    animation: {
      animateRotate: true,
      animateScale: true,
    },
  };

  return (
    <div className="container mt-5">
      {error ? (
        <div className="alert alert-warning text-center">
          <strong>{error}</strong>
          <p>Por favor, revisa tu conexión o registra finanzas para ver la gráfica.</p>
        </div>
      ) : (
        <div className="row justify-content-center">
          {/* Card con la gráfica */}
          <div className="col-12 col-md-6">
            <div className="card shadow-sm p-3 mb-4 bg-white rounded">
              <div className="card-body">
                <h5 className="card-title text-center">Distribución de Gastos</h5>
                <div className="d-flex justify-content-center">
                  <Doughnut data={data} options={options} />
                </div>
              </div>
            </div>
          </div>

          {/* Lista detallada de gastos */}
          <div className="col-12 col-md-6 mt-4 mt-md-0">
            <div className="card shadow-sm p-3 mb-4 bg-white rounded">
              <div className="card-body">
                <h5 className="card-title">Detalles por Categoría</h5>
                {details.map((detail, index) => (
                  <div key={index} className="mb-3">
                    <h6 style={{ color: backgroundColors[index] }}>{detail.category}</h6>
                    <ul className="list-unstyled">
                      {detail.items.map((item, idx) => (
                        <li key={idx} className="d-flex justify-content-between">
                          <span>{item.name}</span>
                          <span>€{item.amount}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
                <h6 className="text-right">Total de Gastos: €{total.toFixed(2)}</h6>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
