import React, { useEffect, useState } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '../../utils/firebase'; // Correct the import path
import DashboardStats from './components/DashboardStats';
import { IoCompassOutline } from "react-icons/io5";
import { MdOutlineSpeed } from "react-icons/md";
import { FaWind } from "react-icons/fa";
import DashboardTopBar from './components/DashboardTopBar';
import { useDispatch } from 'react-redux';
import { showNotification } from '../common/headerSlice';
import VoltageCurrentLineChart from './components/VoltageCurrentLineChart';
import PowerLineChart from './components/PowerLineChart';
import BarChart from './components/BarChart';
import SunIcon from '@heroicons/react/24/solid/SunIcon';

const Dashboard = () => {
    const [statsData, setStatsData] = useState([
        { title: "Solar and Wind Voltage (V)", value: "0", description: "" },
        { title: "Solar and Wind Current (A)", value: "0", description: "" },
        { title: "Solar and Wind Power (W)", value: "0", description: "" },
        { title: "Solar and Wind Speed (kph)", value: "0", description: "" },
        { title: "Solar and Wind Direction (°)", value: "0", description: "" },
    ]);

    const dispatch = useDispatch();

    // Utility function to determine cardinal direction
    const getWindDirection = (degrees) => {
        const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
        const index = Math.round(degrees / 45) % 8;
        return directions[index];
    };

    useEffect(() => {
        const fetchData = () => {
            const WindRef = ref(database, 'Wind');
            const SolarRef = ref(database, 'Solar');

            onValue(WindRef, (windSnapshot) => {
                const windData = windSnapshot.val();
                onValue(SolarRef, (solarSnapshot) => {
                    const solarData = solarSnapshot.val();
                    if (windData && solarData) {
                        const windDirection = getWindDirection(windData.WindDirection);
                        setStatsData([
                            { title: "Solar and Wind Voltage (V)", value: `${Math.round((windData.Voltage + solarData.Voltage) * 100) / 100}`, description: "" },
                            { title: "Solar and Wind Current (A)", value: `${Math.round((windData.Current + solarData.Current) * 100) / 100}`, description: "" },
                            { title: "Solar and Wind Power (W)", value: `${Math.round((windData.Power + solarData.Power) * 100) / 100}`, description: "" },
                            { title: "Wind Speed (kph)", value: `${windData.WindSpeed}`, description: "" },
                            { title: "Wind Direction (°)", value: `${windData.WindDirection}° ${windDirection}`, description: "" },
                        ]);
                    }
                });
            });
        };

        fetchData();

        return () => {
            // Clean up listener
            ref(database, 'Wind').off();
            ref(database, 'Solar').off();
        };
    }, []);

    const updateDashboardPeriod = (newRange) => {
        dispatch(showNotification({ message: `Period updated to ${newRange.startDate} to ${newRange.endDate}`, status: 1 }));
    };

    return (
        <>
            {/* <DashboardTopBar updateDashboardPeriod={updateDashboardPeriod} /> */}
            <div className="grid lg:grid-cols-3 mt-2 md:grid-cols-2 grid-cols-1 gap-6">
                {statsData.map((d, k) => (
                    <DashboardStats key={k} {...d} colorIndex={k} />
                ))}
            </div>
            <div className="grid lg:grid-cols-2 mt-4 grid-cols-1 gap-6">
                <VoltageCurrentLineChart />
                <PowerLineChart />
                {/* <BarChart /> */}
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
