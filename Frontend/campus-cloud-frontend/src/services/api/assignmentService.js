import api from './axios.config';

export const assignmentService = {
  getAssignments: async () => {
    const response = await api.get('/assignments');
    return response.data?.data ?? response.data;
  },

  getAssignmentById: async (id) => {
    const response = await api.get(`/assignments/${id}`);
    return response.data?.data ?? response.data;
  },

  createAssignment: async (assignmentData) => {
    const response = await api.post('/assignments', assignmentData);
    return response.data?.data ?? response.data;
  },

  updateAssignment: async (id, assignmentData) => {
    const response = await api.put(`/assignments/${id}`, assignmentData);
    return response.data?.data ?? response.data;
  },

  deleteAssignment: async (id) => {
    const response = await api.delete(`/assignments/${id}`);
    return response.data?.data ?? response.data;
  },

  getSubmissions: async (assignmentId) => {
    const response = await api.get(`/assignments/${assignmentId}/submissions`);
    return response.data?.data ?? response.data;
  },

  submitAssignment: async (assignmentId, submissionData) => {
    const formData = new FormData();
    formData.append('file', submissionData.file);
    formData.append('comment', submissionData.comment);

    const response = await api.post(
      `/assignments/${assignmentId}/submissions`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data?.data ?? response.data;
  },

  evaluateSubmission: async (submissionId, evaluationData) => {
    const response = await api.post(
      `/submissions/${submissionId}/evaluate`,
      evaluationData
    );
    return response.data?.data ?? response.data;
  },

  getPendingAssignments: async () => {
    const response = await api.get('/api/assignments/student/pending');
    return response.data?.data ?? response.data;
  },
};

export default assignmentService;
