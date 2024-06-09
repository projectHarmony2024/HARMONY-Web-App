import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
  } from 'chart.js';
  import { Bar } from 'react-chartjs-2';
  import TitleCard from '../../../components/Cards/TitleCard';
  
  ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);
  
  function StackBarChart(){
  
      const options = {
            responsive: true,
            scales: {
                x: {
                    stacked: true,
                },
                y: {
                    stacked: true,
                },
            },
        };
        
        const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
        
        const data = {
          labels,
          datasets: [
            {
              label: 'Wind',
              data: labels.map(() => { return Math.random() * 1000 + 500 }),
              backgroundColor: 'rgba(255, 99, 132, 1)',
            },
            {
              label: 'Solar',
              data: labels.map(() => { return Math.random() * 1000 + 500 }),
              backgroundColor: 'rgba(53, 162, 235, 1)',
            },
            {
                label: 'Solar & Wind',
                data: labels.map(() => { return Math.random() * 1000 + 500 }),
                backgroundColor: 'rgba(235, 162, 235, 1)',
              },
          ],
        };
  
      return(
        <TitleCard title={"Total Energy Generation"} topMargin="mt-2">
              <Bar options={options} data={data} />
        </TitleCard>
  
      )
  }
  
  
  export default StackBarChart