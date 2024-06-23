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
  const [powerData, setPowerData] = useState(Array(10).fill(0));

  useEffect(() => {
    const fetchData = () => {
      const WindRef = ref(database, 'Wind');
      const SolarRef = ref(database, 'Solar');

      onValue(WindRef, (windSnapshot) => {
        const windData = windSnapshot.val();
        onValue(SolarRef, (solarSnapshot) => {
          const solarData = solarSnapshot.val();
          if (windData && solarData) {
            setPowerData((prevData) => {
              const newData = [...prevData.slice(1), windData.Power + solarData.Power];
              return newData;
            });
          }
        });
      });
    };

    fetchData();

    return () => {
      // Clean up listeners
      ref(database, 'Wind').off();
      ref(database, 'Solar').off();
    };
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
        label: 'Combined Power (W)',
        data: powerData,
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
    ],
  };

  return (
    <TitleCard title={"Combined Solar and Wind Power Yield"}>
      <Line data={chartData} options={options} />
    </TitleCard>
  );
}

export default LineChart;
