import React, { useEffect, useState, useContext } from "react";
import { SiteContext } from "../../Components/context/SiteContext";
import { useNavigate } from "react-router-dom";
import KanbanDashboard from "../../Components/User/Kanban/KanbanDashboard";
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
            const response = await axios.get(`${url}/api/task`, {
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
            
            <ul>
                <KanbanDashboard />
              
                  
            </ul>
        </div>
    );
};

export default Dashboard;
