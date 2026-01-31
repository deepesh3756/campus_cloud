import api from './axios.config';

export const academicService = {
  getBatches: async () => {
    const response = await api.get('/api/academic/batches');
    return response.data?.data ?? response.data;
  },

  getBatchById: async (batchId) => {
    const response = await api.get(`/api/academic/batches/${batchId}`);
    return response.data?.data ?? response.data;
  },

  createBatch: async (payload) => {
    const response = await api.post('/api/academic/batches', payload);
    return response.data?.data ?? response.data;
  },

  updateBatch: async (batchId, payload) => {
    const response = await api.put(`/api/academic/batches/${batchId}`, payload);
    return response.data?.data ?? response.data;
  },

  deleteBatch: async (batchId) => {
    const response = await api.delete(`/api/academic/batches/${batchId}`);
    return response.data?.data ?? response.data;
  },

  getCourses: async (status) => {
    const response = await api.get('/api/academic/courses', {
      params: status ? { status } : undefined,
    });
    return response.data?.data ?? response.data;
  },

  getCourseById: async (courseId) => {
    const response = await api.get(`/api/academic/courses/${courseId}`);
    return response.data?.data ?? response.data;
  },

  createCourse: async (payload) => {
    const response = await api.post('/api/academic/courses', payload);
    return response.data?.data ?? response.data;
  },

  updateCourse: async (courseId, payload) => {
    const response = await api.put(`/api/academic/courses/${courseId}`, payload);
    return response.data?.data ?? response.data;
  },

  getCoursesByBatch: async (batchId) => {
    const response = await api.get(`/api/academic/batch-courses/batch/${batchId}`);
    return response.data?.data ?? response.data;
  },

  getBatchCourseById: async (batchCourseId) => {
    const response = await api.get(`/api/academic/batch-courses/${batchCourseId}`);
    return response.data?.data ?? response.data;
  },

  createBatchCourse: async (payload) => {
    const response = await api.post('/api/academic/batch-courses', payload);
    return response.data?.data ?? response.data;
  },

  deleteBatchCourse: async (batchCourseId) => {
    const response = await api.delete(`/api/academic/batch-courses/${batchCourseId}`);
    return response.data?.data ?? response.data;
  },

  addSubjectsToBatchCourse: async (payload) => {
    const response = await api.post('/api/academic/batch-courses/subjects', payload);
    return response.data?.data ?? response.data;
  },

  getSubjects: async () => {
    const response = await api.get('/api/academic/subjects');
    return response.data?.data ?? response.data;
  },

  createSubject: async (payload) => {
    const response = await api.post('/api/academic/subjects', payload);
    return response.data?.data ?? response.data;
  },

  updateSubject: async (subjectId, payload) => {
    const response = await api.put(`/api/academic/subjects/${subjectId}`, payload);
    return response.data?.data ?? response.data;
  },

  deleteSubject: async (subjectId) => {
    const response = await api.delete(`/api/academic/subjects/${subjectId}`);
    return response.data?.data ?? response.data;
  },

  getSubjectsByBatchAndCourse: async (batchId, courseId) => {
    const response = await api.get(`/api/academic/batch-courses/batch/${batchId}/course/${courseId}/subjects`);
    return response.data?.data ?? response.data;
  },

  getSubjectsByBatchCourseId: async (batchCourseId) => {
    const response = await api.get(`/api/academic/batch-courses/${batchCourseId}/subjects`);
    return response.data?.data ?? response.data;
  },

  getBatchCourseSubjectById: async (batchCourseSubjectId) => {
    const response = await api.get(`/api/academic/batch-courses/subjects/${batchCourseSubjectId}`);
    return response.data?.data ?? response.data;
  },

  deleteBatchCourseSubject: async (batchCourseSubjectId) => {
    const response = await api.delete(`/api/academic/batch-courses/subjects/${batchCourseSubjectId}`);
    return response.data?.data ?? response.data;
  },

  getSubjectsByFaculty: async (facultyId) => {
    const response = await api.get(`/api/academic/faculty-assignments/faculty/${facultyId}`);
    return response.data?.data ?? response.data;
  },

  getFacultiesBySubject: async (batchCourseSubjectId) => {
    const response = await api.get(`/api/academic/faculty-assignments/subject/${batchCourseSubjectId}`);
    return response.data?.data ?? response.data;
  },

  getFacultyIdsByBatchCourse: async (batchCourseId) => {
    const response = await api.get(`/api/academic/faculty-assignments/batch-course/${batchCourseId}/faculty-ids`);
    return response.data?.data ?? response.data;
  },

  assignFaculty: async (payload) => {
    const response = await api.post('/api/academic/faculty-assignments', payload);
    return response.data?.data ?? response.data;
  },

  getSubjectsByStudent: async (studentId) => {
    const response = await api.get(`/api/academic/enrollments/student/${studentId}`);
    return response.data?.data ?? response.data;
  },

  getStudentEnrollments: async (userId) => {
    const response = await api.get(`/api/academic/enrollments/student/${userId}`);
    return response.data?.data ?? response.data;
  },

  getEnrolledStudentIds: async (batchCourseId) => {
    const response = await api.get(`/api/academic/enrollments/batch-course/${batchCourseId}/students`);
    return response.data?.data ?? response.data;
  },

  enrollStudent: async (payload) => {
    const response = await api.post('/api/academic/enrollments', payload);
    return response.data?.data ?? response.data;
  },
};

export default academicService;
