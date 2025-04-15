import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AllTasksComponent.css';
import { fetchWithToken } from '../../../../utils/authUtils';


import { 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  TablePagination,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Box,
  Chip,
  Divider,
  CircularProgress,
  Snackbar,
  Alert,
  IconButton
} from '@mui/material';


import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import ClearIcon from '@mui/icons-material/Clear';
import AssignmentIcon from '@mui/icons-material/Assignment';
import SortIcon from '@mui/icons-material/Sort';

const AllTasksComponent = () => {
    const [tasks, setTasks] = useState([]);
    const [filteredTasks, setFilteredTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const navigate = useNavigate();
    
    
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    
    
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [teamFilter, setTeamFilter] = useState('all');
    const [assigneeFilter, setAssigneeFilter] = useState('all');
    
    
    const [teams, setTeams] = useState([]);
    const [assignees, setAssignees] = useState([]);
    const [statuses, setStatuses] = useState([]);
    
   
    const [sortField, setSortField] = useState('title');
    const [sortDirection, setSortDirection] = useState('asc');

    useEffect(() => {
        const fetchTasks = async () => {
            try {
             
                const userRes = await fetchWithToken('http://localhost:4000/api/user/me', {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                });

                if (!userRes?.user || !userRes.user.companyName) {
                    setSnackbar({
                        open: true,
                        message: 'Nu s-a putut identifica compania utilizatorului.',
                        severity: 'error',
                    });
                    setLoading(false);
                    return;
                }

                const companyName = userRes.user.companyName;

            
                const taskRes = await fetchWithToken(`http://localhost:4000/api/task/company/${companyName}`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                });

                if (Array.isArray(taskRes)) {
                    setTasks(taskRes);
                    setFilteredTasks(taskRes);
                    
                 
                    const uniqueTeams = [...new Set(taskRes.map(task => task.team?.name || 'Fără echipă'))];
                    const uniqueAssignees = [...new Set(taskRes.map(task => task.user?.name || 'Neasignat'))];
                    const uniqueStatuses = [...new Set(taskRes.map(task => task.status))];
                    
                    setTeams(uniqueTeams);
                    setAssignees(uniqueAssignees);
                    setStatuses(uniqueStatuses);
                } else {
                    setSnackbar({ open: true, message: 'Nu s-au găsit task-uri.', severity: 'info' });
                }

            } catch (error) {
                console.error('Eroare la fetch:', error);
                setSnackbar({ open: true, message: 'Eroare la încărcarea task-urilor.', severity: 'error' });
            } finally {
                setLoading(false);
            }
        };

        fetchTasks();
    }, []);

 
    useEffect(() => {
        const filtered = tasks.filter(task => {
         
            const matchesSearch = 
                task.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                task.description.toLowerCase().includes(searchTerm.toLowerCase());
            
       
            const matchesStatus = 
                statusFilter === 'all' || 
                task.status.toLowerCase() === statusFilter.toLowerCase();
            
         
            const taskTeam = task.team?.name || 'Fără echipă';
            const matchesTeam = 
                teamFilter === 'all' || 
                taskTeam === teamFilter;
            
 
            const taskAssignee = task.user?.name || 'Neasignat';
            const matchesAssignee = 
                assigneeFilter === 'all' || 
                taskAssignee === assigneeFilter;
            
            return matchesSearch && matchesStatus && matchesTeam && matchesAssignee;
        });
        

        const sortedTasks = [...filtered].sort((a, b) => {
            let aValue, bValue;
            
            switch(sortField) {
                case 'title':
                    aValue = a.title.toLowerCase();
                    bValue = b.title.toLowerCase();
                    break;
                case 'status':
                    aValue = a.status.toLowerCase();
                    bValue = b.status.toLowerCase();
                    break;
                case 'team':
                    aValue = (a.team?.name || 'Fără echipă').toLowerCase();
                    bValue = (b.team?.name || 'Fără echipă').toLowerCase();
                    break;
                case 'assignee':
                    aValue = (a.user?.name || 'Neasignat').toLowerCase();
                    bValue = (b.user?.name || 'Neasignat').toLowerCase();
                    break;
                case 'time':
                    aValue = parseFloat(a.time_logged) || 0;
                    bValue = parseFloat(b.time_logged) || 0;
                    break;
                default:
                    aValue = a.title.toLowerCase();
                    bValue = b.title.toLowerCase();
            }
            
            if (sortDirection === 'asc') {
                return aValue > bValue ? 1 : -1;
            } else {
                return aValue < bValue ? 1 : -1;
            }
        });
        
        setFilteredTasks(sortedTasks);
        setPage(0); 
    }, [tasks, searchTerm, statusFilter, teamFilter, assigneeFilter, sortField, sortDirection]);

    const handleCloseSnackbar = () => {
        setSnackbar(prev => ({ ...prev, open: false }));
    };

    const handleTaskClick = (taskId) => {
        navigate(`/task/${taskId}`);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleSort = (field) => {
        if (sortField === field) {
           
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
       
            setSortField(field);
            setSortDirection('asc');
        }
    };

    const handleClearFilters = () => {
        setSearchTerm('');
        setStatusFilter('all');
        setTeamFilter('all');
        setAssigneeFilter('all');
        setSortField('title');
        setSortDirection('asc');
    };

    const getStatusColor = (status) => {
        const statusMap = {
            'in progress': '#2196f3',
            'todo': '#ff9800',
            'done': '#4caf50',
            'blocked': '#f44336'
        };
        
        return statusMap[status.toLowerCase()] || '#757575';
    };

    if (loading) {
        return (
            <div className="loading-container">
                <CircularProgress />
                <Typography variant="h6" sx={{ mt: 2 }}>Se încarcă task-urile...</Typography>
            </div>
        );
    }

    return (
        <div className="all-tasks-container">
            <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', mb: 3, display: 'flex', alignItems: 'center' }}>
                <AssignmentIcon sx={{ mr: 1 }} />
                Toate Task-urile din Companie
            </Typography>

        
            <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2, mb: 2 }}>
                    <TextField
                        fullWidth
                        label="Caută task-uri"
                        variant="outlined"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon />
                                </InputAdornment>
                            ),
                            endAdornment: searchTerm && (
                                <InputAdornment position="end">
                                    <IconButton size="small" onClick={() => setSearchTerm('')}>
                                        <ClearIcon />
                                    </IconButton>
                                </InputAdornment>
                            )
                        }}
                    />
                    
                    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', flexGrow: 1 }}>
                        <FormControl sx={{ minWidth: 120, flexGrow: 1 }}>
                            <InputLabel>Status</InputLabel>
                            <Select
                                value={statusFilter}
                                label="Status"
                                onChange={(e) => setStatusFilter(e.target.value)}
                            >
                                <MenuItem value="all">Toate</MenuItem>
                                {statuses.map(status => (
                                    <MenuItem key={status} value={status}>{status}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        
                        <FormControl sx={{ minWidth: 120, flexGrow: 1 }}>
                            <InputLabel>Echipă</InputLabel>
                            <Select
                                value={teamFilter}
                                label="Echipă"
                                onChange={(e) => setTeamFilter(e.target.value)}
                            >
                                <MenuItem value="all">Toate</MenuItem>
                                {teams.map(team => (
                                    <MenuItem key={team} value={team}>{team}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        
                        <FormControl sx={{ minWidth: 120, flexGrow: 1 }}>
                            <InputLabel>Asignat</InputLabel>
                            <Select
                                value={assigneeFilter}
                                label="Asignat"
                                onChange={(e) => setAssigneeFilter(e.target.value)}
                            >
                                <MenuItem value="all">Toți</MenuItem>
                                {assignees.map(assignee => (
                                    <MenuItem key={assignee} value={assignee}>{assignee}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <FilterListIcon sx={{ mr: 1 }} />
                        <Typography variant="body2">
                            {filteredTasks.length} task-uri găsite
                        </Typography>
                    </Box>
                    
                    <Box>
                        <IconButton color="primary" onClick={handleClearFilters} title="Resetează filtrele">
                            <ClearIcon />
                        </IconButton>
                    </Box>
                </Box>
            </Paper>

      
            {filteredTasks.length === 0 ? (
                <Paper sx={{ p: 3, textAlign: 'center', bgcolor: '#f5f5f5' }}>
                    <Typography variant="h6">
                        Nu s-au găsit task-uri care să corespundă filtrelor.
                    </Typography>
                </Paper>
            ) : (
                <Paper elevation={3}>
                    <TableContainer>
                        <Table sx={{ minWidth: 650 }} aria-label="tabel task-uri">
                            <TableHead>
                                <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                                    <TableCell 
                                        onClick={() => handleSort('title')}
                                        sx={{ fontWeight: 'bold', cursor: 'pointer' }}
                                    >
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            Titlu
                                            {sortField === 'title' && (
                                                <SortIcon sx={{ 
                                                    fontSize: 'small', 
                                                    ml: 0.5,
                                                    transform: sortDirection === 'desc' ? 'rotate(180deg)' : 'none'
                                                }} />
                                            )}
                                        </Box>
                                    </TableCell>
                                    <TableCell 
                                        onClick={() => handleSort('status')}
                                        sx={{ fontWeight: 'bold', cursor: 'pointer' }}
                                    >
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            Status
                                            {sortField === 'status' && (
                                                <SortIcon sx={{ 
                                                    fontSize: 'small', 
                                                    ml: 0.5,
                                                    transform: sortDirection === 'desc' ? 'rotate(180deg)' : 'none'
                                                }} />
                                            )}
                                        </Box>
                                    </TableCell>
                                    <TableCell 
                                        onClick={() => handleSort('team')}
                                        sx={{ fontWeight: 'bold', cursor: 'pointer' }}
                                    >
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            Echipă
                                            {sortField === 'team' && (
                                                <SortIcon sx={{ 
                                                    fontSize: 'small', 
                                                    ml: 0.5,
                                                    transform: sortDirection === 'desc' ? 'rotate(180deg)' : 'none'
                                                }} />
                                            )}
                                        </Box>
                                    </TableCell>
                                    <TableCell 
                                        onClick={() => handleSort('assignee')}
                                        sx={{ fontWeight: 'bold', cursor: 'pointer' }}
                                    >
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            Asignat
                                            {sortField === 'assignee' && (
                                                <SortIcon sx={{ 
                                                    fontSize: 'small', 
                                                    ml: 0.5,
                                                    transform: sortDirection === 'desc' ? 'rotate(180deg)' : 'none'
                                                }} />
                                            )}
                                        </Box>
                                    </TableCell>
                                    <TableCell 
                                        onClick={() => handleSort('time')}
                                        sx={{ fontWeight: 'bold', cursor: 'pointer' }}
                                    >
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            Timp Logat
                                            {sortField === 'time' && (
                                                <SortIcon sx={{ 
                                                    fontSize: 'small', 
                                                    ml: 0.5,
                                                    transform: sortDirection === 'desc' ? 'rotate(180deg)' : 'none'
                                                }} />
                                            )}
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredTasks
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((task) => (
                                    <TableRow
                                        key={task._id}
                                        hover
                                        onClick={() => handleTaskClick(task._id)}
                                        sx={{ cursor: 'pointer', '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell component="th" scope="row">
                                            <Typography variant="body1" fontWeight="medium">
                                                {task.title}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                                {task.description.length > 70 
                                                    ? `${task.description.substring(0, 70)}...` 
                                                    : task.description}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Chip 
                                                label={task.status} 
                                                size="small"
                                                sx={{ 
                                                    bgcolor: getStatusColor(task.status),
                                                    color: 'white',
                                                    fontWeight: 'medium'
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell>{task.team?.name || 'Fără echipă'}</TableCell>
                                        <TableCell>
                                            <Typography variant="body2">
                                                {task.user?.name || 'Neasignat'}
                                            </Typography>
                                            {task.user?.email && (
                                                <Typography variant="caption" color="text.secondary">
                                                    {task.user.email}
                                                </Typography>
                                            )}
                                        </TableCell>
                                        <TableCell>{task.time_logged}h</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25, 50]}
                        component="div"
                        count={filteredTasks.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        labelRowsPerPage="Rânduri pe pagină:"
                        labelDisplayedRows={({ from, to, count }) => `${from}-${to} din ${count}`}
                    />
                </Paper>
            )}

            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert severity={snackbar.severity} onClose={handleCloseSnackbar}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </div>
    );
};

export default AllTasksComponent;