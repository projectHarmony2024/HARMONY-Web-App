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
  const [windPowerData, setWindPowerData] = useState(Array(10).fill(0));
  
  useEffect(() => {
    const WindRef = ref(database, 'Wind');
    onValue(WindRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setWindPowerData((prevData) => {
          const newData = [...prevData.slice(1), data.Power];
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
        label: 'Wind Power (W)',
        data: windPowerData,
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
    ],
  };

  return (
    <TitleCard title={"Wind Power Yield"}>
      <Line data={chartData} options={options} />
    </TitleCard>
  );
}

export default LineChart