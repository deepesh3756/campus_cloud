import api from './axios.config';

export const academicService = {
  getBatches: async () => {
    const response = await api.get('/academic/batches');
    return response.data;
  },

  getCourses: async () => {
    const response = await api.get('/academic/courses');
    return response.data;
  },

  getSubjects: async () => {
    const response = await api.get('/academic/subjects');
    return response.data;
  },

  getSubjectsByFaculty: async (facultyId) => {
    const response = await api.get(`/academic/subjects/faculty/${facultyId}`);
    return response.data;
  },

  getSubjectsByStudent: async (studentId) => {
    const response = await api.get(`/academic/subjects/student/${studentId}`);
    return response.data;
  },
};

export default academicService;
