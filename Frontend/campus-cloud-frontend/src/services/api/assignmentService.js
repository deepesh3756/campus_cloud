import api from './axios.config';

export const assignmentService = {
  getPendingAssignments: async () => {
    const response = await api.get('/api/assignments/student/pending');
    return response.data?.data ?? response.data;
  },

  getStudentSubjectAssignments: async () => {
    const response = await api.get('/api/assignments/student');
    return response.data?.data ?? response.data;
  },

  getStudentStatusSummary: async () => {
    const response = await api.get('/api/assignments/student/status-summary');
    return response.data?.data ?? response.data;
  },

  getAssignmentsBySubject: async (batchCourseSubjectId, status) => {
    const qs = status ? `?status=${encodeURIComponent(status)}` : '';
    const response = await api.get(`/api/assignments/subject/${batchCourseSubjectId}${qs}`);
    return response.data?.data ?? response.data;
  },

  getAssignmentById: async (assignmentId) => {
    const response = await api.get(`/api/assignments/${assignmentId}`);
    return response.data?.data ?? response.data;
  },

  getMySubmissions: async () => {
    const response = await api.get('/api/assignments/student/my-submissions');
    return response.data?.data ?? response.data;
  },

  getMySubmission: async (assignmentId) => {
    const response = await api.get(`/api/assignments/${assignmentId}/my-submission`);
    return response.data?.data ?? response.data;
  },

  submitAssignmentFile: async (assignmentId, file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post(`/api/assignments/${assignmentId}/submit`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data?.data ?? response.data;
  },

  getAssignments: async () => {
    const response = await api.get('/api/assignments');
    return response.data?.data ?? response.data;
  },

  createAssignment: async (assignmentData) => {
    const response = await api.post('/api/assignments', assignmentData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data?.data ?? response.data;
  },

  updateAssignment: async (id, assignmentData) => {
    const response = await api.put(`/api/assignments/${id}`, assignmentData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data?.data ?? response.data;
  },

  deleteAssignment: async (id) => {
    const response = await api.delete(`/api/assignments/${id}`);
    return response.data?.data ?? response.data;
  },

  getSubmissions: async (assignmentId) => {
    const response = await api.get(`/api/assignments/${assignmentId}/submissions`);
    return response.data?.data ?? response.data;
  },

  submitAssignment: async (assignmentId, submissionData) => {
    const formData = new FormData();
    formData.append('file', submissionData.file);
    formData.append('comment', submissionData.comment);

    const response = await api.post(`/api/assignments/${assignmentId}/submit`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data?.data ?? response.data;
  },

  evaluateSubmission: async (submissionId, evaluationData) => {
    const response = await api.post(`/api/assignments/submissions/${submissionId}/evaluate`, evaluationData);
    return response.data?.data ?? response.data;
  },

  getAssignmentAnalytics: async (assignmentId) => {
    const response = await api.get(`/api/assignments/${assignmentId}/analytics`);
    return response.data?.data ?? response.data;
  },

  getSubmissionDownloadUrl: async (submissionId) => {
    const response = await api.get(`/api/assignments/submissions/${submissionId}/download`);
    return response.data?.data ?? response.data;
  },
};

export default assignmentService;
