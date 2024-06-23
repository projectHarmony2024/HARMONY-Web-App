import React, { useEffect, useState } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '../../../utils/firebase'; // Correct the import path
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import TitleCard from '../../../components/Cards/TitleCard';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

function LineChart() {
  const [windVoltageData, setWindVoltageData] = useState(Array(10).fill(0));
  const [windCurrentData, setWindCurrentData] = useState(Array(10).fill(0));
  
  useEffect(() => {
    const SolarRef = ref(database, 'Wind');
    onValue(SolarRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setWindVoltageData((prevData) => {
          const newData = [...prevData.slice(1), data.Voltage];
          return newData;
        });
        setWindCurrentData((prevData) => {
          const newData = [...prevData.slice(1), data.Current];
          return newData;
        });
      }
    });
  }, []);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
  };

  const labels = ['', '', '', '', '', '', '', '', '', ''];

  const chartData = {
    labels,
    datasets: [
      {
        fill: false,
        label: 'Solar Voltage (V)',
        data: windVoltageData,
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
      {
        fill: false,
        label: 'Wind Current (A)',
        data: windCurrentData,
        borderColor: 'rgb(251, 133, 0)',
        backgroundColor: 'rgba(251, 133, 0, 0.5)',
      }
    ],
  };

  return (
    <TitleCard title={"Wind Voltage and Current"}>
      <Line data={chartData} options={options} />
    </TitleCard>
  );
}

export default LineChart