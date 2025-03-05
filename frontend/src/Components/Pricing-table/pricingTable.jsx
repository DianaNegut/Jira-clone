import React, { useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Paper, Dialog, DialogActions, DialogContent, DialogTitle, Button } from '@mui/material';
import  './pricingTable.css';

const PricingTable = () => {
  const [open, setOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedDescriere, setSelectedDescriere] = useState('');

  const rows = [
    { product: 'Basic Plan', price: '$10', duration: '1 month' , details: 'Unlimited goals, projects, tasks, and forms. Align projects and tasks to goals. Collect data with forms. Backlog, list, board, timeline, calendar, and summary views. Choose from different views to support your way of working.'},
    { product: 'Standard Plan', price: '$25', duration: '3 months', details: 'User roles and permissions. Control what users can create, view, and comment on in Jira. External collaboration. Give people outside your org anonymous access to Jira projects' },
    { product: 'Premium Plan', price: '$50', duration: '6 months', details: 'Cross-team planning and dependency management. Plan and track goals, projects, and dependencies in one place. Customizable approval processes. Add approval steps to your workflows to get required signoffs.' },
    { product: 'Enterprise Plan', price: '$100', duration: '1 year', details: 'Advanced admin controls and security. Manage users and security at scale with advanced governance controls like advanced encryption and Shadow IT controls. Enterprise-grade identity and access management. Get support for multiple identity providers (IdPs) within your central admin console, plus SCIM, enforce SSO, and more with Atlassian Guard Standard included.' }
  ];

  const columns = [
    { field: 'product', headerName: 'Product', flex: 1 },
    { field: 'price', headerName: 'Price', flex: 1 },
    { field: 'duration', headerName: 'Duration', flex: 1 },
  ];

  const paginationModel = { pageSize: 5, page: 0 };

  const handleRowClick = (params) => {
    setSelectedProduct(params.row.product);
    setSelectedDescriere(params.row.details);
    setOpen(true);  
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div style={{ padding: '20px' }}>
      <Paper sx={{ height: 400, width: '100%', padding: '20px' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          initialState={{ pagination: { paginationModel } }}
          pageSizeOptions={[5, 10]}
          getRowId={(row) => `${row.product}-${row.duration}`}
          onRowClick={handleRowClick}
        />
      </Paper>

      <Dialog open={open} onClose={handleClose}>
        
        <DialogContent>
          <h2>{selectedProduct}</h2>
          <p>{selectedDescriere}</p>
        </DialogContent>
        <DialogActions className='dialog-actions-custom'>
          <Button onClick={handleClose} style={{color:'white'}} className="dialog-button-custom">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default PricingTable;
