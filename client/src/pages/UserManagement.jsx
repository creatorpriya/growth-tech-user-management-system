
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Pencil,
  Trash2,
  X,
  Search,
  RefreshCw,
  ArrowLeft
} from "lucide-react";
import API from "../services/api";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [editingUser, setEditingUser] = useState(null);
  const [saving, setSaving] = useState(false);

  // Fetch all users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await API.get("/users");
      setUsers(response.data.users);
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to load users"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Open edit form
  const handleEdit = (user) => {
    setEditingUser({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status
    });
  };

  // Update user
  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!editingUser.name.trim() || !editingUser.email.trim()) {
      setError("Name and email are required");
      return;
    }

    try {
      setSaving(true);
      setError("");

      await API.put(`/users/${editingUser._id}`, {
        name: editingUser.name.trim(),
        email: editingUser.email.trim(),
        role: editingUser.role,
        status: editingUser.status
      });

      setEditingUser(null);
      await fetchUsers();
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to update user"
      );
    } finally {
      setSaving(false);
    }
  };

  // Delete user
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this user?"
    );

    if (!confirmed) return;

    try {
      setError("");
      await API.delete(`/users/${id}`);
      await fetchUsers();
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to delete user"
      );
    }
  };

  // Search users
  const filteredUsers = users.filter((user) =>
    `${user.name} ${user.email} ${user.role} ${user.status}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="management-container">

      {/* Page Header */}
      <div className="management-header">
        <div>
          <h1>User Management</h1>
          <p>View and manage all registered users.</p>
        </div>

        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <Link
            to="/admin"
            className="refresh-button"
            style={{
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: "6px"
            }}
          >
            <ArrowLeft size={16} />
            Back to Dashboard
          </Link>

          <button
            onClick={fetchUsers}
            className="refresh-button"
            disabled={loading}
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>
      </div>

      {/* Search Toolbar */}
      <div className="table-toolbar">
        <div className="search-box">
          <Search size={18} />

          <input
            type="text"
            placeholder="Search by name, email, role or status..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <span>{filteredUsers.length} users found</span>
      </div>

      {/* Error Message */}
      {error && <div className="error-message">{error}</div>}

      {/* Users Table */}
      {loading ? (
        <p className="loading-text">Loading users...</p>
      ) : (
        <div className="table-wrapper">
          <table className="users-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user._id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>

                    <td>
                      <span className="role-badge">
                        {user.role}
                      </span>
                    </td>

                    <td>
                      <span className={`status-badge ${user.status}`}>
                        {user.status}
                      </span>
                    </td>

                    <td>
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>

                    <td>
                      <div className="action-buttons">
                        <button
                          className="edit-button"
                          onClick={() => handleEdit(user)}
                          title="Edit user"
                        >
                          <Pencil size={16} />
                        </button>

                        <button
                          className="delete-button"
                          onClick={() => handleDelete(user._id)}
                          title="Delete user"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="empty-message">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit User Modal */}
      {editingUser && (
        <div className="modal-overlay">
          <div className="edit-modal">

            <div className="modal-header">
              <h2>Edit User</h2>

              <button
                type="button"
                className="close-button"
                onClick={() => setEditingUser(null)}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleUpdate}>
              <div className="form-group">
                <label>Full Name</label>

                <input
                  type="text"
                  value={editingUser.name}
                  onChange={(e) =>
                    setEditingUser({
                      ...editingUser,
                      name: e.target.value
                    })
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label>Email</label>

                <input
                  type="email"
                  value={editingUser.email}
                  onChange={(e) =>
                    setEditingUser({
                      ...editingUser,
                      email: e.target.value
                    })
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label>Role</label>

                <select
                  value={editingUser.role}
                  onChange={(e) =>
                    setEditingUser({
                      ...editingUser,
                      role: e.target.value
                    })
                  }
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div className="form-group">
                <label>Status</label>

                <select
                  value={editingUser.status}
                  onChange={(e) =>
                    setEditingUser({
                      ...editingUser,
                      status: e.target.value
                    })
                  }
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              <button
                type="submit"
                className="save-button"
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};

export default UserManagement;
