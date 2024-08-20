import React, { useState, useEffect } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import { Link } from 'react-router-dom';
import { Table, notification, Button } from 'antd';
import { EyeOutlined } from '@ant-design/icons';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const usersResponse = await axiosInstance.get('/users');
        const recipesResponse = await axiosInstance.get('/recipe');
        setUsers(usersResponse.data);
        setRecipes(recipesResponse.data);
      } catch (error) {
        notification.error({ message: 'Failed to fetch data' });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const userColumns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    {
      title: 'Actions',
      key: 'actions',
      render: (text, record) => (
        <div>
          <Link to={`/admin/user-details/${record._id}`}>
            <Button type="primary" size="small">View Details</Button>
          </Link>
        </div>
      ),
    },
  ];

  const recipeColumns = [
    {
      title: 'Image',
      dataIndex: 'recipeImg',
      key: 'recipeImg',
      render: (text, record) => (
        <img
          src={record.recipeImg}
          alt={record.title}
          style={{ width: '50px', height: '50px', objectFit: 'cover' }}
        />
      ),
    },
    { title: 'Title', dataIndex: 'title', key: 'title' },
    {
      title: 'Created By',
      dataIndex: 'creator',
      key: 'creator',
      render: (creator) => creator?.name || 'Unknown',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text, record) => (
        <div>
          <Link to={`/recipes/${record._id}`}>
            <Button type="primary" style={{ marginRight: 8 }}>
              <EyeOutlined style={{ marginRight: 4 }} />
              View Details
            </Button>
          </Link>
        </div>
      ),
    },
  ];

  return (
    <div className="container mt-5">
      <h1>Admin Dashboard</h1>
      <div className="mt-4">
        <h2>Manage Users</h2>
        <Table
          columns={userColumns}
          dataSource={users}
          rowKey="_id"
          loading={loading}
        />
      </div>

      <div className="mt-4">
        <h2>Manage Recipes</h2>
        <Table
          columns={recipeColumns}
          dataSource={recipes}
          rowKey="_id"
          loading={loading}
        />
      </div>
    </div>
  );
};

export default AdminDashboard;
