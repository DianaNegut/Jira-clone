import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './SeeTasks.css';
import { assets } from '../../../assets/assets';
import { useNavigate } from 'react-router-dom';

const SeeTasks = () => {
    const navigate = useNavigate();
    const [currentUser, setCurrentUser] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [filteredTasks, setFilteredTasks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
  
    const [statusFilter, setStatusFilter] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('createdAt');
    const [sortOrder, setSortOrder] = useState('desc');
    const [showFilters, setShowFilters] = useState(false);
    const [assigneeFilter, setAssigneeFilter] = useState('');
    const [dateFilter, setDateFilter] = useState('');
    
    const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);

    const authToken = localStorage.getItem('token');

    const getProfilePictureUrl = (profilePicture) => {
        if (!profilePicture) {
            return assets.default_profile_icon;
        }

        if (profilePicture.includes('http://localhost:4000/')) {
            return profilePicture;
        }

        const correctedPath = profilePicture.replace('uploads/', 'images/');
        return `http://localhost:4000/${correctedPath}`;
    };

    const handleTaskClick = (taskId) => {
        navigate(`/task/${taskId}`);
    };

    useEffect(() => {
        const handleResize = () => {
            setIsMobileView(window.innerWidth < 768);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const fetchUserAndTeams = async () => {
            if (!authToken) {
                setError('Nu există token de autentificare. Te rugăm să te autentifici.');
                return;
            }
    
            try {
                const userResponse = await fetch('http://localhost:4000/api/user/me', {
                    headers: { Authorization: `Bearer ${authToken}` }
                });
                
                if (!userResponse.ok) {
                    throw new Error(`HTTP error! Status: ${userResponse.status}`);
                }
                
                const userData = await userResponse.json();
                setCurrentUser(userData.user);
                
                const teamsResponse = await fetch(`http://localhost:4000/api/teams/user/${userData.user._id}`, {
                    headers: {
                        'Authorization': `Bearer ${authToken}`
                    }
                });
    
                if (!teamsResponse.ok) {
                    throw new Error('Eroare la obținerea echipelor utilizatorului');
                }
    
                const teamsData = await teamsResponse.json();
                const userTeams = teamsData.teams;
    
                if (!userTeams || userTeams.length === 0) {
                    throw new Error('Nu ai echipe asignate');
                }
    
                const selectedTeamId = userTeams[0]._id;
                
                fetchTeamTasks(selectedTeamId);
                
            } catch (err) {
                setError('Eroare: ' + err.message);
                console.error(err);
            }
        };
    
        fetchUserAndTeams();
    }, [authToken]);
    
    const fetchTeamTasks = async (teamId) => {
        setLoading(true);
        setError(null);
        try {
            const url = `http://localhost:4000/api/task/teams/${teamId}/tasks`;
            const response = await fetch(url, {
                headers: { Authorization: `Bearer ${authToken}` }
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            
            const data = await response.json();
            setTasks(data.data || []);
            applyFilters(data.data || []);
        } catch (err) {
            setError('Eroare la încărcarea task-urilor: ' + err.message);
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        applyFilters(tasks);
    }, [statusFilter, searchQuery, sortBy, sortOrder, assigneeFilter, dateFilter]);

    const applyFilters = (tasksToFilter) => {
        let result = [...tasksToFilter];

        if (statusFilter) {
            result = result.filter(task => task.status === statusFilter);
        }

        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(task => 
                task.title.toLowerCase().includes(query) || 
                task.description.toLowerCase().includes(query)
            );
        }

        if (assigneeFilter === 'assigned') {
            result = result.filter(task => task.user);
        } else if (assigneeFilter === 'unassigned') {
            result = result.filter(task => !task.user);
        }

        if (dateFilter) {
            const today = new Date();
            const oneDay = 24 * 60 * 60 * 1000;
            
            if (dateFilter === 'today') {
                result = result.filter(task => {
                    const taskDate = new Date(task.createdAt);
                    return taskDate.toDateString() === today.toDateString();
                });
            } else if (dateFilter === 'week') {
                const weekAgo = new Date(today - 7 * oneDay);
                result = result.filter(task => {
                    const taskDate = new Date(task.createdAt);
                    return taskDate >= weekAgo;
                });
            } else if (dateFilter === 'month') {
                const monthAgo = new Date(today);
                monthAgo.setMonth(monthAgo.getMonth() - 1);
                result = result.filter(task => {
                    const taskDate = new Date(task.createdAt);
                    return taskDate >= monthAgo;
                });
            }
        }

        result.sort((a, b) => {
            if (sortBy === 'title') {
                return sortOrder === 'asc' 
                    ? a.title.localeCompare(b.title) 
                    : b.title.localeCompare(a.title);
            } else if (sortBy === 'status') {
                return sortOrder === 'asc' 
                    ? a.status.localeCompare(b.status) 
                    : b.status.localeCompare(a.status);
            } else {
                return sortOrder === 'asc' 
                    ? new Date(a.createdAt) - new Date(b.createdAt) 
                    : new Date(b.createdAt) - new Date(a.createdAt);
            }
        });

        setFilteredTasks(result);
    };

    const handleStatusFilterChange = (e) => {
        setStatusFilter(e.target.value);
    };

    const handleSortChange = (e) => {
        setSortBy(e.target.value);
    };

    const toggleSortOrder = () => {
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    };

    const resetFilters = () => {
        setStatusFilter('');
        setSearchQuery('');
        setSortBy('createdAt');
        setSortOrder('desc');
        setAssigneeFilter('');
        setDateFilter('');
    };

    const getStatusLabel = (status) => {
        switch(status) {
            case 'unassigned': return 'Neatribuit';
            case 'in progress': return 'În progres';
            case 'completed': return 'Finalizat';
            default: return status;
        }
    };

    if (!currentUser) {
        return <div className="loading">Se încarcă informațiile utilizatorului...</div>;
    }

    return (
        <div className="container">
            <h1 className="title">
                Task-urile Echipei: 
                <span className="team-name">
                    {currentUser.teams && currentUser.teams.length > 0 
                        ? currentUser.teams[0].nume || currentUser.teams[0].name 
                        : 'Nicio echipă'}
                </span>
            </h1>

            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}

            <div className="tasks-section">
                <div className="search-bar">
                    <input
                        type="text"
                        placeholder="Caută task-uri..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="search-input"
                    />
                    <button 
                        className="filter-toggle-btn"
                        onClick={() => setShowFilters(!showFilters)}
                    >
                        {showFilters ? 'Ascunde filtrele' : 'Arată filtrele'}
                    </button>
                </div>

                {showFilters && (
                    <div className="filters-container">
                        <div className="filter-group">
                            <label>Status:</label>
                            <select
                                value={statusFilter}
                                onChange={handleStatusFilterChange}
                                className="filter-select"
                            >
                                <option value="">Toate statusurile</option>
                                <option value="unassigned">Neatribuite</option>
                                <option value="in progress">În progres</option>
                                <option value="completed">Finalizate</option>
                            </select>
                        </div>

                        <div className="filter-group">
                            <label>Responsabil:</label>
                            <select
                                value={assigneeFilter}
                                onChange={(e) => setAssigneeFilter(e.target.value)}
                                className="filter-select"
                            >
                                <option value="">Toți responsabilii</option>
                                <option value="assigned">Atribuite</option>
                                <option value="unassigned">Neatribuite</option>
                            </select>
                        </div>

                        <div className="filter-group">
                            <label>Perioadă:</label>
                            <select
                                value={dateFilter}
                                onChange={(e) => setDateFilter(e.target.value)}
                                className="filter-select"
                            >
                                <option value="">Toate perioadele</option>
                                <option value="today">Astăzi</option>
                                <option value="week">Ultima săptămână</option>
                                <option value="month">Ultima lună</option>
                            </select>
                        </div>

                        <div className="filter-group">
                            <label>Sortare:</label>
                            <div className="sort-controls">
                                <select
                                    value={sortBy}
                                    onChange={handleSortChange}
                                    className="filter-select"
                                >
                                    <option value="createdAt">Data creării</option>
                                    <option value="title">Titlu</option>
                                    <option value="status">Status</option>
                                </select>
                                <button 
                                    className="sort-order-btn"
                                    onClick={toggleSortOrder}
                                    title={sortOrder === 'asc' ? 'Crescător' : 'Descrescător'}
                                >
                                    {sortOrder === 'asc' ? '↑' : '↓'}
                                </button>
                            </div>
                        </div>

                        <button 
                            className="reset-filters-btn"
                            onClick={resetFilters}
                        >
                            Resetează filtrele
                        </button>
                    </div>
                )}

                <div className="tasks-stats">
                    <span>Total: {filteredTasks.length} task-uri</span>
                    {filteredTasks.length !== tasks.length && (
                        <span> (din {tasks.length} total)</span>
                    )}
                </div>

                {loading ? (
                    <div className="loading-container">
                        <div className="loading-spinner"></div>
                        <p className="loading">Se încarcă task-urile...</p>
                    </div>
                ) : filteredTasks.length > 0 ? (
                    isMobileView ? (
                        <div className="mobile-tasks-list">
                            {filteredTasks.map(task => (
                                <div 
                                    key={task._id} 
                                    className="mobile-task-card"
                                    onClick={() => handleTaskClick(task._id)}
                                >
                                    <div className="mobile-task-header">
                                        <h3 className="mobile-task-title">{task.title}</h3>
                                        <span className={`mobile-status-tag ${task.status.replace(' ', '')}`}>
                                            {getStatusLabel(task.status)}
                                        </span>
                                    </div>
                                    <p className="mobile-task-description">{task.description}</p>
                                    <div className="mobile-task-footer">
                                        {task.user ? (
                                            <div className="mobile-user-info">
                                                <img 
                                                    src={getProfilePictureUrl(task.user.profilePicture)} 
                                                    alt={task.user.name}
                                                    className="mobile-user-avatar"
                                                />
                                                <span>{task.user.name}</span>
                                            </div>
                                        ) : (
                                            <span className="mobile-unassigned">Neatribuit</span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <table className="tasks-table">
                                <thead>
                                    <tr>
                                        <th>Titlu</th>
                                        <th>Descriere</th>
                                        <th>Responsabil</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredTasks.map(task => (
                                        <tr 
                                            key={task._id} 
                                            className="task-row"
                                            onClick={() => handleTaskClick(task._id)}
                                        >
                                            <td className="task-title">{task.title}</td>
                                            <td className="task-description-all">{task.description}</td>
                                            <td className="task-user">
                                                {task.user ? (
                                                    <div className="user-info">
                                                        <img 
                                                            src={getProfilePictureUrl(task.user.profilePicture)} 
                                                            alt={task.user.name}
                                                            className="user-avatar"
                                                        />
                                                        <span>{task.user.name}</span>
                                                    </div>
                                                ) : (
                                                    <span className="unassigned">Neatribuit</span>
                                                )}
                                            </td>
                                            <td className="task-status">
                                                <span className={`status-tag ${task.status.replace(' ', '')}`}>
                                                    {getStatusLabel(task.status)}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )
                ) : (
                    <div className="no-tasks">
                        {tasks.length > 0 
                            ? 'Nu există task-uri care să corespundă filtrelor aplicate.' 
                            : 'Nu există task-uri pentru această echipă.'}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SeeTasks;