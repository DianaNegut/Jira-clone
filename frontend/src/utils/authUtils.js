
export const getCurrentUser = () => {
    const token = localStorage.getItem('token');
    if (!token) return null;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return {
        id: payload.id,

      };
    } catch (e) {
      console.error("Error decoding token:", e);
      return null;
    }
  };
  
  export const fetchWithToken = async (url, options = {}) => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Authentication required');
  
    const response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': `Bearer ${token}`
      }
    });
  
    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }
  
    return response.json();
  };