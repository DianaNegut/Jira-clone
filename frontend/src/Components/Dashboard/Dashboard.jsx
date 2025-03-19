import React, { useEffect, useState, useContext } from "react";
import { SiteContext } from "../context/SiteContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Dashboard = () => {
    const { token, url } = useContext(SiteContext);
    const [tasks, setTasks] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) {
            navigate("/login");
        } else {
            fetchTasks();
        }
    }, [token, navigate]);

    const fetchTasks = async () => {
        try {
            const response = await axios.get(`${url}/api/tasks`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.data.success) {
                setTasks(response.data.tasks);
            }
        } catch (error) {
            console.error("Error fetching tasks:", error);
        }
    };

    return (
        <div>
            <h1>Welcome to Your Dashboard</h1>
            <h2>Your Tasks:</h2>
            <ul>
                {tasks.length > 0 ? (
                    tasks.map((task) => <li key={task.id}>{task.title}</li>)
                ) : (
                    <p>No tasks found</p>
                )}
            </ul>
        </div>
    );
};

export default Dashboard;
