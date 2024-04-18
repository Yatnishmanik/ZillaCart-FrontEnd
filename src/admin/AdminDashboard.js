import React, { useEffect, useState } from 'react';
import { Box, Button, Paper, Typography, Dialog, DialogTitle, DialogContent, TextField } from '@mui/material';
import { DataGrid, gridClasses } from '@mui/x-data-grid';
import { Link } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import moment from 'moment';
import axios from 'axios';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { toast } from 'react-toastify';
import config from '../config'

const AdminDashboard = () => {
    const [posts, setPosts] = useState([]);
    const [showAddCategoryDialog, setShowAddCategoryDialog] = useState(false);
    const [categoryName, setCategoryName] = useState('');
    const [categoryDescription, setCategoryDescription] = useState('');

    const displayPost = async () => {
        try {
            const { data } = await axios.get(`${config.URL}/api/posts/show`);
            setPosts(data.posts);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        displayPost();
    }, []);

    // Function to open the add category dialog
    const openAddCategoryDialog = () => {
        setShowAddCategoryDialog(true);
    };

    // Function to close the add category dialog
    const closeAddCategoryDialog = () => {
        setShowAddCategoryDialog(false);
        // Optionally, reset the form fields
        setCategoryName('');
        setCategoryDescription('');
    };

    // Function to handle category form submission
    const handleAddCategorySubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${config.URL}/api/post/category`, {
                name: categoryName,
                description: categoryDescription
            });
            toast.success('Category added successfully!');
            closeAddCategoryDialog();
            // Optionally, refresh the list of categories
            displayPost();
        } catch (error) {
            console.error('Error adding category:', error);
            toast.error('Already Exist');
        }
    };

    // Function to handle category name change
    const handleCategoryNameChange = (e) => {
        setCategoryName(e.target.value);
    };

    // Function to handle category description change
    const handleCategoryDescriptionChange = (e) => {
        setCategoryDescription(e.target.value);
    };

    // Delete post by Id
    const deletePostById = async (e, id) => {
        if (window.confirm("Are you sure you want to delete this post?")) {
            try {
                const { data } = await axios.delete(`${config.URL}/api/delete/post/${id}`);
                if (data.success === true) {
                    toast.success(data.message);
                    displayPost();
                }
            } catch (error) {
                console.log(error);
                toast.error(error);
            }
        }
    };

    const columns = [

        {
            field: '_id',
            headerName: 'Post ID',
            width: 150,
            editable: true,
        },
        {
            field: 'title',
            headerName: 'Post title',
            width: 150,
        },

        {
            field: 'image',
            headerName: 'Image',
            width: 150,
            renderCell: (params) => (
                <img width="40%" src={params.row.image.url} />
            )

        },
        {
            field: 'likes',
            headerName: 'Likes',
            width: 150,
            renderCell: (params) => (
                params.row.likes.length
            )
        },
        {
            field: 'comments',
            headerName: 'Comments',
            width: 150,
            renderCell: (params) => (
                params.row.comments.length
            )
        },
        {
            field: 'postedBy',
            headerName: 'Posted by',
            width: 150,
            valueGetter: (data) => data.row.postedBy.name
        },
        {
            field: 'category',
            headerName: 'category',
            width: 150,
            valueGetter: (data) => data.row.category
        },
        {
            field: 'createdAt',
            headerName: 'Create At',
            width: 150,
            renderCell: (params) => (
                moment(params.row.createdAt).format('YYYY-MM-DD HH:MM:SS')
            )
        },

        {
            field: "Actions",
            width: 100,
            renderCell: (value) => (
                <Box sx={{ display: "flex", justifyContent: "space-between", width: "170px" }}>
                    <Link to={`/admin/post/edit/${value.row._id}`}>
                        <IconButton aria-label="edit" >
                            <EditIcon sx={{ color: '#1976d2' }} />
                        </IconButton>
                    </Link>
                    <IconButton aria-label="delete" onClick={(e) => deletePostById(e, value.row._id)} >
                        <DeleteIcon sx={{ color: 'red' }} />
                    </IconButton>

                </Box>
            )
        }
    ];

    return (
        <Box>
            <Typography variant="h4" sx={{ color: "black", pb: 3 }}>
                Posts
            </Typography>
            <div className='flex space-x-10 justify-end'>
                <div className='flex space-x-10 justify-end'>
                    <Button variant='contained' color="info" startIcon={<AddIcon />} onClick={openAddCategoryDialog}>
                        Add Category
                    </Button>
                    
                <Button variant='contained' color="success" startIcon={<AddIcon />}><Link style={{ color: 'white', textDecoration: 'none' }} to='/admin/post/create'>Create Post</Link> </Button>
            
                </div>
            </div>
            <Paper sx={{ bgcolor: "white" }} >
                {/* Add Category Dialog */}
                <Dialog open={showAddCategoryDialog} onClose={closeAddCategoryDialog}>
                    <DialogTitle>Add Category</DialogTitle>
                    <DialogContent>
                        <form onSubmit={handleAddCategorySubmit}>
                            <TextField
                                label="Name"
                                value={categoryName}
                                onChange={handleCategoryNameChange}
                                required
                                fullWidth
                                margin="normal"
                            />
                            <TextField
                                label="Description"
                                value={categoryDescription}
                                onChange={handleCategoryDescriptionChange}
                                fullWidth
                                margin="normal"
                            />
                            <Button type="submit" variant="contained" color="primary">
                                Add
                            </Button>
                            <Button onClick={closeAddCategoryDialog} color="secondary">
                                Cancel
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>

                <Box sx={{ height: 400, width: '100%' }}>
                    <DataGrid
                        getRowId={(row) => row._id}
                        sx={{

                            '& .MuiTablePagination-displayedRows': {
                                color: 'black',
                            },
                            color: 'black',
                            [`& .${gridClasses.row}`]: {
                                bgcolor: "white"
                            },

                        }}
                        rows={posts}
                        columns={columns}
                        pageSize={3}
                        rowsPerPageOptions={[3]}
                        checkboxSelection
                    />
                </Box>
            </Paper>
        </Box>
    );
};

export default AdminDashboard;
