import React, { useEffect, useState } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '../../utils/firebase'; // Correct the import path
import DashboardStats from './components/DashboardStats';
import AmountStats from './components/AmountStats';
import PageStats from './components/PageStats';
import { IoCompassOutline } from "react-icons/io5";
import { MdOutlineSpeed } from "react-icons/md";
import { FaWind } from "react-icons/fa";
import DashboardTopBar from './components/DashboardTopBar';
import { useDispatch } from 'react-redux';
import { showNotification } from '../common/headerSlice';
import LineChart from './components/LineChart';
import BarChart from './components/BarChart';
import UserChannels from './components/UserChannels';
import DoughnutChart from './components/DoughnutChart';
import SunIcon from '@heroicons/react/24/solid/SunIcon'
import { getCompassDirection } from '../../utils/compassUtils';

const Dashboard = () => {
    const [statsData, setStatsData] = useState([
        { title: "Solar Power", value: "52", icon: <SunIcon className='w-8 h-8' />, description: "" },
        { title: "Wind Power", value: "34,545", icon: <FaWind className='w-8 h-8' />, description: "" },
        { title: "Wind Speed", value: "1.3 kph", icon: <MdOutlineSpeed className='w-8 h-8' />, description: "" },
        { title: "Wind Direction", value: "323", icon: <IoCompassOutline className='w-8 h-8' />, description: "" },
    ]);

    const dispatch = useDispatch();

    useEffect(() => {
        const fetchData = () => {
            const ultrasonicAnemometerRef = ref(database, 'UltrasonicAnemometer');
            onValue(ultrasonicAnemometerRef, (snapshot) => {
                const data = snapshot.val();
                if (data) {
                    let windDirectionInt = Math.round(data.wind_direction);
                    if (parseFloat(data.wind_speed_kph) === 0) {
                        windDirectionInt = 0;
                    }
                    const windPower = parseFloat(data.wind_speed_kph * 0.475 * 1.75).toFixed(2);
                    setStatsData([
                        { title: "Solar Power", value: `${data.solar_power} kWh`, icon: <SunIcon className='w-8 h-8' />, description: "" },
                        { title: "Wind Power", value: `${windPower} kWh`, icon: <FaWind className='w-8 h-8' />, description: "" },
                        { title: "Wind Speed", value: `${data.wind_speed_kph} kph`, icon: <MdOutlineSpeed className='w-8 h-8' />, description: "" },
                        { title: "Wind Direction", value: `${windDirectionInt}° (${getCompassDirection(windDirectionInt)})`, icon: <IoCompassOutline className='w-8 h-8' />, description: "" },
                    ]);
                }
            });
        };
        fetchData();
    }, []);
    

    const updateDashboardPeriod = (newRange) => {
        dispatch(showNotification({ message: `Period updated to ${newRange.startDate} to ${newRange.endDate}`, status: 1 }));
    };

    return (
        <>
            <DashboardTopBar updateDashboardPeriod={updateDashboardPeriod} />
            <div className="grid lg:grid-cols-4 mt-2 md:grid-cols-2 grid-cols-1 gap-6">
                {statsData.map((d, k) => (
                    <DashboardStats key={k} {...d} colorIndex={k} />
                ))}
            </div>
            <div className="grid lg:grid-cols-2 mt-4 grid-cols-1 gap-6">
                <LineChart />
                <BarChart />
            </div>
            {/* <div className="grid lg:grid-cols-2 mt-10 grid-cols-1 gap-6">
                <AmountStats />
                <PageStats />
            </div>
            <div className="grid lg:grid-cols-2 mt-4 grid-cols-1 gap-6">
                <UserChannels />
                <DoughnutChart />
            </div> */}
        </>
    );
};

export default Dashboard;
