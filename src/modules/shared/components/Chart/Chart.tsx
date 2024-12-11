import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title,
} from 'chart.js';

// Register necessary components for Chart.js
ChartJS.register(ArcElement, Tooltip, Legend, Title);

interface Props {
  one: number,
  tow: number,
  colorOne: string,
  colorTow: string,
}

const PieChartComponent = ({one, tow, colorOne, colorTow}: Props) => {
  // Data for the Pie chart
  const data = {
    labels: ['Yellow', 'Blue'], // Labels for the pie slices
    datasets: [
      {
        label: 'Dataset 1', // Label for the dataset
        data: [one, tow], // Data points for each slice of the pie
        backgroundColor: [
        //   'rgba(255, 99, 132, 0.2)',  // Red
        //   'rgba(255, 159, 64, 0.2)',   // Orange
        //   'rgba(75, 192, 192, 0.2)',   // Green
        colorOne,   // Blue
        colorTow,   // Yellow
        ],
        borderColor: [
        //   'rgba(255, 99, 132, 1)',  // Red
        //   'rgba(255, 159, 64, 1)',   // Orange
        //   'rgba(75, 192, 192, 1)',   // Green
          'rgba(54, 162, 235, 1)',   // Blue
          'rgba(255, 205, 86, 1)',   // Yellow

        ],
        borderWidth: 1,
      },
    ],
  };

  // Pie chart configuration
  const config = {
    type: 'pie',
    data: data,
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: 'Chart.js Pie Chart',
        },
      },
    },
  };

  return (
    <div className='w-75 mt-5'>
      <Pie data={data} options={config.options} />
    </div>
  );
};

export default PieChartComponent;