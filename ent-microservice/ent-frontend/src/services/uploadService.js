export const uploadFile = async (formData, token) => {
  const response = await fetch('http://localhost:8005/upload/', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.detail || 'Failed to upload file.');
  }
  return data;
};