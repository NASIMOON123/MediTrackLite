
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    ResponsiveContainer,
  } from 'recharts';
  

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const DoctorAnalytics = () => {
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const doctorId = JSON.parse(localStorage.getItem('user'))._id;
        const token = localStorage.getItem('token');
  
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/analytics/doctor/${doctorId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        const transformed = response.data.map((item) => ({
          name: item._id,
          count: item.count
        }));
  
        setChartData(transformed);
      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchAnalytics();
  }, []);

  return (
    <div className="analytics-page theme-card">
        <br/>
      <h2 className="text-adaptive">Doctor Appointments Analytics</h2>
      {loading ? (
        <p>Loading analytics...</p>
      ) : (
        <>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie 
                  data={chartData} 
                  dataKey="count" 
                  nameKey="name" 
                  cx="50%" 
                  cy="50%" 
                  outerRadius={100} 
                  fill="#3b82f6" 
                  label 
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p>No analytics data available.</p>
          )}
        </>
      )}
    </div>
  );
};

export default DoctorAnalytics;
