import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { classesAPI, attendanceAPI } from '../services/api';

const TeacherClasses = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingClass, setEditingClass] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    allowedRadius: 100,
    schedule: '',
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const response = await classesAPI.getAll();
      setClasses(response.data.classes || []);
    } catch (error) {
      console.error('Error fetching classes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingClass) {
        await classesAPI.update(editingClass._id, formData);
      } else {
        await classesAPI.create(formData);
      }
      setShowModal(false);
      setEditingClass(null);
      setFormData({ name: '', subject: '', allowedRadius: 100, schedule: '' });
      fetchClasses();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to save class');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (classItem) => {
    setEditingClass(classItem);
    setFormData({
      name: classItem.name,
      subject: classItem.subject || '',
      allowedRadius: classItem.allowedRadius || 100,
      schedule: classItem.schedule || '',
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this class?')) return;
    try {
      await classesAPI.delete(id);
      fetchClasses();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to delete class');
    }
  };

  const handleStartSession = async (classId) => {
    try {
      const response = await attendanceAPI.createSession({ classId });
      alert(`Session started! Code: ${response.data.session.code}`);
      fetchClasses();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to start session');
    }
  };

  const handleEndSession = async (sessionId) => {
    try {
      await attendanceAPI.endSession(sessionId);
      fetchClasses();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to end session');
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
          <h1 className="text-2xl font-bold text-gray-900">My Classes</h1>
          <p className="text-gray-600">Manage your classes</p>
        </div>
        <button
          onClick={() => {
            setEditingClass(null);
            setFormData({ name: '', subject: '', allowedRadius: 100, schedule: '' });
            setShowModal(true);
          }}
          className="btn btn-primary"
        >
          + Add Class
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      ) : classes.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-600 mb-4">No classes yet</p>
          <button onClick={() => setShowModal(true)} className="btn btn-primary">
            Create Your First Class
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classes.map((classItem) => (
            <motion.div
              key={classItem._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold text-lg text-gray-900">{classItem.name}</h3>
                  <p className="text-sm text-gray-600">{classItem.subject || 'General'}</p>
                </div>
                <span className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-600">
                  {classItem.studentCount || 0} students
                </span>
              </div>

              {classItem.schedule && (
                <p className="text-sm text-gray-500 mb-4">📅 {classItem.schedule}</p>
              )}

              {classItem.activeSession ? (
                <div className="bg-green-50 rounded-lg p-4 mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-green-700">Active Session</span>
                    <span className="text-xs text-green-600">
                      {classItem.activeSession.checkedInCount || 0} checked in
                    </span>
                  </div>
                  <div className="text-2xl font-mono font-bold text-green-700 text-center">
                    {classItem.activeSession.code}
                  </div>
                  <button
                    onClick={() => handleEndSession(classItem.activeSession._id)}
                    className="w-full btn btn-secondary text-sm mt-2"
                  >
                    End Session
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => handleStartSession(classItem._id)}
                  className="w-full btn btn-primary mb-2"
                >
                  Start Attendance
                </button>
              )}

              <div className="flex justify-between mt-4 pt-4 border-t">
                <button
                  onClick={() => handleEdit(classItem)}
                  className="text-sm text-primary-600 hover:text-primary-700"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(classItem._id)}
                  className="text-sm text-red-600 hover:text-red-700"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="bg-white rounded-2xl p-6 w-full max-w-md mx-4"
          >
            <h2 className="text-xl font-bold mb-4">
              {editingClass ? 'Edit Class' : 'Add New Class'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label">Class Name</label>
                <input
                  type="text"
                  className="input"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="label">Subject</label>
                <input
                  type="text"
                  className="input"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                />
              </div>
              <div>
                <label className="label">Allowed Radius (meters)</label>
                <input
                  type="number"
                  className="input"
                  value={formData.allowedRadius}
                  onChange={(e) => setFormData({ ...formData, allowedRadius: parseInt(e.target.value) })}
                  min={10}
                  max={1000}
                />
              </div>
              <div>
                <label className="label">Schedule</label>
                <input
                  type="text"
                  className="input"
                  placeholder="e.g., Mon,Wed,Fri 9:00 AM"
                  value={formData.schedule}
                  onChange={(e) => setFormData({ ...formData, schedule: e.target.value })}
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
                  {saving ? 'Saving...' : editingClass ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default TeacherClasses;
