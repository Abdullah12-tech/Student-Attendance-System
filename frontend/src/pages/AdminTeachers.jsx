import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { adminAPI } from '../services/api';

const AdminTeachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    setLoading(true);
    try {
      const response = await adminAPI.getTeachers();
      setTeachers(response.data.teachers || []);
    } catch (error) {
      console.error('Error fetching teachers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingTeacher) {
        await adminAPI.updateTeacher(editingTeacher._id, formData);
      } else {
        await adminAPI.createTeacher(formData);
      }
      setShowModal(false);
      setEditingTeacher(null);
      setFormData({ name: '', email: '', password: '' });
      fetchTeachers();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to save teacher');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (teacher) => {
    setEditingTeacher(teacher);
    setFormData({
      name: teacher.name,
      email: teacher.email,
      password: '',
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this teacher?')) return;
    try {
      await adminAPI.deleteTeacher(id);
      fetchTeachers();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to delete teacher');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Teachers</h1>
          <p className="text-gray-600">Manage teacher accounts</p>
        </div>
        <button
          onClick={() => {
            setEditingTeacher(null);
            setFormData({ name: '', email: '', password: '' });
            setShowModal(true);
          }}
          className="btn btn-primary"
        >
          + Add Teacher
        </button>
      </div>

      {/* Teachers Table */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      ) : teachers.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-600 mb-4">No teachers yet</p>
          <button onClick={() => setShowModal(true)} className="btn btn-primary">
            Add Your First Teacher
          </button>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Name</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Email</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Created</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Classes</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {teachers.map((teacher) => (
                  <tr key={teacher._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-900">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center mr-3">
                          <span className="text-primary-600 font-medium">
                            {teacher.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        {teacher.name}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{teacher.email}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {new Date(teacher.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {teacher.classCount || 0} classes
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleEdit(teacher)}
                        className="text-primary-600 hover:text-primary-700 text-sm mr-3"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(teacher._id)}
                        className="text-red-600 hover:text-red-700 text-sm"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="bg-white rounded-2xl p-6 w-full max-w-md mx-4"
          >
            <h2 className="text-xl font-bold mb-4">
              {editingTeacher ? 'Edit Teacher' : 'Add New Teacher'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label">Name</label>
                <input
                  type="text"
                  className="input"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="label">Email</label>
                <input
                  type="email"
                  className="input"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="label">
                  {editingTeacher ? 'New Password (optional)' : 'Password'}
                </label>
                <input
                  type="password"
                  className="input"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required={!editingTeacher}
                  minLength={6}
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 btn btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="flex-1 btn btn-primary">
                  {saving ? 'Saving...' : editingTeacher ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default AdminTeachers;
