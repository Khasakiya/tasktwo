import {useState, useEffect} from 'react';
import './App.css';
import { MdDelete } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";

function App() {

  const [user, setUser]=useState({
    username:"",
    password:"",
    role:""
  });

  const [users, setUsers] = useState([]);

  const [editingUserId, setEditingUserId] = useState(null);


  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:8000/login');
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error( error);
    }
  };

    useEffect(() => {
      fetchUsers();
    }, []);

  const handleInput = (e) =>{
    console.log(e);
    let name = e.target.name;
    let value = e.target.value;

    setUser({
      ...user,
      [name]: value,
    })
  }

  const handleSubmit = async(e) =>{
    e.preventDefault();
    console.log(user);
    try {
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
        await fetch('http://localhost:8000/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(user),
        });
      }
      setUser({ username: '', password: '', role: '' }); 
      fetchUsers();
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:8000/login/${id}`, {
        method: 'DELETE',
      });
      fetchUsers(); 
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = async(user) =>{
    setUser({username: user.username, password: user.password, role: user.role});
    setEditingUserId(user._id);
  }

  return (
    <div class="container logincontainer">
        <div class="itemcenter">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
            <div class="form-group">
                <label for="username">Username:</label>
                <input type="text" id="username" name="username"
                value={user.username}
                onChange={handleInput} required />
            </div>
            <div class="form-group">
                <label for="password">Password:</label>
                <input type="password" id="password" name="password"
                 value={user.password}
                 onChange={handleInput}required/>
            </div>
            <div class="form-group">
                <label for="role">Role:</label>
                <input type="text" id="role" name="role" 
                 value={user.role}
                 onChange={handleInput}required/>
            </div>
            <button type="submit">{editingUserId ? 'Update' : 'Login'}</button>
        </form>
      </div>
      <div class="itemcenter">
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
                    <td style={{textAlign:'center'}}>
                      <MdDelete onClick={() => handleDelete(user._id)} />
                      <FaRegEdit onClick={() => handleEdit(user)} />
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