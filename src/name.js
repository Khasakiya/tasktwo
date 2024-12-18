import { useState, useEffect } from 'react';
import './App.css';

function App() {
  // State for form input
  const [user, setUser] = useState({
    username: '',
    password: '',
    role: '',
  });

  // State for users list
  const [users, setUsers] = useState([]);

  // State for editing
  const [editingUserId, setEditingUserId] = useState(null);

  // Fetch users from the backend
  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:8000/login');
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  // Handle input changes
  const handleInput = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // If editing, make a PATCH request
      if (editingUserId) {
        await fetch(`http://localhost:8000/login/${editingUserId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(user),
        });
        setEditingUserId(null);
      } else {
        // Otherwise, make a POST request
        await fetch('http://localhost:8000/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(user),
        });
      }

      setUser({ username: '', password: '', role: '' }); // Reset form
      fetchUsers(); // Refresh the users list
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  // Handle delete action
  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:8000/login/${id}`, {
        method: 'DELETE',
      });
      fetchUsers(); // Refresh the users list
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  // Handle edit action
  const handleEdit = (user) => {
    setUser({ username: user.username, password: user.password, role: user.role });
    setEditingUserId(user._id); // Store the ID of the user being edited
  };

  return (
    <div className="container logincontainer">
      <div className="itemcenter">
        <h2>{editingUserId ? 'Edit User' : 'Login'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              name="username"
              value={user.username}
              onChange={handleInput}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={user.password}
              onChange={handleInput}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="role">Role:</label>
            <input
              type="text"
              id="role"
              name="role"
              value={user.role}
              onChange={handleInput}
              required
            />
          </div>
          <button type="submit">{editingUserId ? 'Update' : 'Login'}</button>
        </form>

        {/* Display the users in a table */}
        {users.length > 0 && (
          <div>
            <h3>User Data</h3>
            <table>
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Password</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id}>
                    <td>{user.username}</td>
                    <td>{user.password}</td>
                    <td>{user.role}</td>
                    <td>
                      <button onClick={() => handleEdit(user)}>Edit</button>
                      <button onClick={() => handleDelete(user._id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
