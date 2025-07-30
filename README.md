=============== reactjs crud ===============
// src/components/UserForm.js
import React, { useState, useEffect } from 'react';

const UserForm = ({ onSave, editingUser }) => {
  const [form, setForm] = useState({ name: '', email: '' });

  useEffect(() => {
    if (editingUser) setForm(editingUser);
  }, [editingUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
    setForm({ name: '', email: '' });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>{editingUser ? 'Edit' : 'Add'} User</h3>
      <input name="name" value={form.name} onChange={handleChange} placeholder="Name" required />
      <input name="email" value={form.email} onChange={handleChange} placeholder="Email" required />
      <button type="submit">{editingUser ? 'Update' : 'Create'}</button>
    </form>
  );
};

export default UserForm;


// src/components/UserList.js
import React from 'react';

const UserList = ({ users, onEdit, onDelete }) => (
  <div>
    <h3>User List</h3>
    <ul>
      {users.map((user) => (
        <li key={user.id}>
          {user.name} ({user.email})
          <button onClick={() => onEdit(user)}>Edit</button>
          <button onClick={() => onDelete(user.id)}>Delete</button>
        </li>
      ))}
    </ul>
  </div>
);

export default UserList;


// src/App.js
import React, { useEffect, useState } from 'react';
import UserForm from './components/UserForm';
import UserList from './components/UserList';
import axios from 'axios';

const App = () => {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);

  const fetchUsers = async () => {
    const res = await axios.get('http://localhost:3000/api/users');
    setUsers(res.data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSave = async (user) => {
    if (user.id) {
      await axios.put(`http://localhost:3000/api/users/${user.id}`, user);
    } else {
      await axios.post('http://localhost:3000/api/users', user);
    }
    setEditingUser(null);
    fetchUsers();
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:3000/api/users/${id}`);
    fetchUsers();
  };

  return (
    <div className="App">
      <UserForm onSave={handleSave} editingUser={editingUser} />
      <UserList users={users} onEdit={setEditingUser} onDelete={handleDelete} />
    </div>
  );
};

export default App;


// nodejs
// db/connection.js
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'yourpassword',
  database: 'testdb',
  waitForConnections: true,
  connectionLimit: 10,
});

module.exports = pool;

// services/userService.js
const db = require('../db/connection');

exports.getAllUsers = async () => {
  const [rows] = await db.query('SELECT * FROM users');
  return rows;
};

exports.getUserById = async (id) => {
  const [rows] = await db.query('SELECT * FROM users WHERE id = ?', [id]);
  return rows[0];
};

exports.createUser = async (user) => {
  const { name, email } = user;
  const [result] = await db.query('INSERT INTO users (name, email) VALUES (?, ?)', [name, email]);
  return { id: result.insertId, name, email };
};

exports.updateUser = async (id, user) => {
  const { name, email } = user;
  await db.query('UPDATE users SET name = ?, email = ? WHERE id = ?', [name, email, id]);
  return { id, name, email };
};

exports.deleteUser = async (id) => {
  await db.query('DELETE FROM users WHERE id = ?', [id]);
  return { message: 'User deleted' };
};


// controllers/userController.js
const userService = require('../services/userService');

exports.getUsers = async (req, res) => {
  const users = await userService.getAllUsers();
  res.json(users);
};

exports.getUser = async (req, res) => {
  const user = await userService.getUserById(req.params.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user);
};

exports.createUser = async (req, res) => {
  const newUser = await userService.createUser(req.body);
  res.status(201).json(newUser);
};

exports.updateUser = async (req, res) => {
  const updated = await userService.updateUser(req.params.id, req.body);
  res.json(updated);
};

exports.deleteUser = async (req, res) => {
  const result = await userService.deleteUser(req.params.id);
  res.json(result);
};



// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/', userController.getUsers);
router.get('/:id', userController.getUser);
router.post('/', userController.createUser);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

module.exports = router;


// app.js
const express = require('express');
const app = express();
const userRoutes = require('./routes/userRoutes');

app.use(express.json());
app.use('/api/users', userRoutes);

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
