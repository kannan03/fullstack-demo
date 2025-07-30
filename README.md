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
