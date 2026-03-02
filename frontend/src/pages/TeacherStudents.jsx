import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { studentsAPI, classesAPI } from '../../services/api';

const TeacherStudents = () => {
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    uid: '',
    email: '',
    phone: '',
    classId: '',
  });
  const [bulkData, setBulkData] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchClasses();
  }, []);

  useEffect(() => {
    if (selectedClass) {
      fetchStudents();
    }
  }, [selectedClass]);

  const fetchClasses = async () => {
    try {
      const response = await classesAPI.getAll();
      setClasses(response.data.classes || []);
      if (response.data.classes?.length > 0) {
        setSelectedClass(response.data.classes[0]._id);
      }
    } catch (error) {
      console.error('Error fetching classes:', error);
    }
  };

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const response = await studentsAPI.getAll({ classId: selectedClass });
      setStudents(response.data.students || []);
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingStudent) {
        await studentsAPI.update(editingStudent._id, formData);
      } else {
        await studentsAPI.create(formData);
      }
      setShowModal(false);
      setEditingStudent(null);
      setFormData({ name: '', uid: '', email: '', phone: '', classId: '' });
      fetchStudents();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to save student');
    } finally {
      setSaving(false);
    }
  };

  const handleBulkSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const lines = bulkData.trim().split('\n');
      const students = lines.map((line) => {
        const [name, uid, email, phone] = line.split(',').map((s) => s.trim());
        return { name, uid, email, phone, classId: selectedClass };
      });
      await studentsAPI.bulkCreate(students);
      setShowBulkModal(false);
      setBulkData('');
      fetchStudents();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to bulk create students');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (student) => {
    setEditingStudent(student);
    setFormData({
      name: student.name,
      uid: student.uid,
      email: student.email || '',
      phone: student.phone || '',
      classId: student.classId,
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this student?')) return;
    try {
      await studentsAPI.delete(id);
      fetchStudents();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to delete student');
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
          <h1 className="text-2xl font-bold text-gray-900">Students</h1>
          <p className="text-gray-600">Manage your students</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowBulkModal(true)} className="btn btn-secondary">
            Bulk Import
          </button>
          <button
            onClick={() => {
              setEditingStudent(null);
              setFormData({ name: '', uid: '', email: '', phone: '', classId: selectedClass });
              setShowModal(true);
            }}
            className="btn btn-primary"
          >
            + Add Student
          </button>
        </div>
      </div>

      {/* Class Filter */}
      <div className="card">
        <label className="label">Select Class</label>
        <select
          className="input max-w-md"
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
        >
          {classes.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Students Table */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      ) : students.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-600 mb-4">No students in this class</p>
          <button onClick={() => setShowModal(true)} className="btn btn-primary">
            Add Your First Student
          </button>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">UID</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Name</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Email</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Phone</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {students.map((student) => (
                  <tr key={student._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-mono text-gray-900">{student.uid}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{student.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{student.email || '-'}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{student.phone || '-'}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleEdit(student)}
                        className="text-primary-600 hover:text-primary-700 text-sm mr-3"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(student._id)}
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
              {editingStudent ? 'Edit Student' : 'Add New Student'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label">Student Name</label>
                <input
                  type="text"
                  className="input"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="label">UID</label>
                <input
                  type="text"
                  className="input font-mono"
                  value={formData.uid}
                  onChange={(e) => setFormData({ ...formData, uid: e.target.value.toUpperCase() })}
                  placeholder="SCH2026-0001"
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
                />
              </div>
              <div>
                <label className="label">Phone</label>
                <input
                  type="tel"
                  className="input"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
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
                  {saving ? 'Saving...' : editingStudent ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Bulk Import Modal */}
      {showBulkModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="bg-white rounded-2xl p-6 w-full max-w-md mx-4"
          >
            <h2 className="text-xl font-bold mb-4">Bulk Import Students</h2>
            <p className="text-sm text-gray-600 mb-4">
              Enter one student per line in format: name, uid, email, phone
            </p>
            <form onSubmit={handleBulkSubmit}>
              <textarea
                className="input font-mono text-sm h-48"
                placeholder="John Doe, SCH2026-0001, john@school.edu, 1234567890&#10;Jane Smith, SCH2026-0002, jane@school.edu, 0987654321"
                value={bulkData}
                onChange={(e) => setBulkData(e.target.value)}
                required
              />
              <div className="flex gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setShowBulkModal(false)}
                  className="flex-1 btn btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="flex-1 btn btn-primary">
                  {saving ? 'Importing...' : 'Import'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default TeacherStudents;
