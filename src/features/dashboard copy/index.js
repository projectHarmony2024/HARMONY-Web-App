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
        { title: "Wind Voltage (V)", value: "0", description: "" },
        { title: "Wind Current (A)", value: "0", description: "" },
        { title: "Wind Power (W)", value: "0", description: "" },
        { title: "Wind Speed (kph)", value: "0", description: "" },
        { title: "Wind Direction (°)", value: "0", description: "" },
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
            onValue(WindRef, (snapshot) => {
                const data = snapshot.val();
                if (data) {
                    const windDirection = getWindDirection(data.WindDirection);
                    setStatsData([
                        { title: "Wind Voltage (V)", value: `${data.Voltage}`, description: "" },
                        { title: "Wind Current (A)", value: `${data.Current}`, description: "" },
                        { title: "Wind Power (W)", value: `${data.Power}`, description: "" },
                        { title: "Wind Speed (kph)", value: `${data.WindSpeed}`, description: "" },
                        { title: "Wind Direction (°)", value: `${data.WindDirection}° ${windDirection}`, description: "" },
                    ]);
                }
            });
        };

        fetchData();

        return () => {
            // Clean up listener
            ref(database, 'Wind').off();
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
