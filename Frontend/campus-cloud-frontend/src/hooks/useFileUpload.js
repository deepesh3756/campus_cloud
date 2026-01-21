import { useState } from 'react';
import { validateFile } from '../utils/fileValidator';

export const useFileUpload = (options = {}) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) {
      setFile(null);
      setError(null);
      return;
    }

    const validation = validateFile(selectedFile, options);
    if (!validation.isValid) {
      setError(validation.error);
      setFile(null);
      return;
    }

    setError(null);
    setFile(selectedFile);
  };

  const reset = () => {
    setFile(null);
    setError(null);
    setUploading(false);
  };

  return {
    file,
    uploading,
    error,
    handleFileChange,
    reset,
  };
};

export default useFileUpload;
