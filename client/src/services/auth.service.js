import axiosInstance from './axiosConfig';

class AuthService {
  async register(userData) {
    const response = await axiosInstance.post('/auth/register', userData);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  }

  async login(credentials) {
    const response = await axiosInstance.post('/auth/login', credentials);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      const userData = await this.getMe();
      localStorage.setItem('user', JSON.stringify(userData.data));
    }
    return response.data;
  }

  async getMe() {
    const response = await axiosInstance.get('/auth/me');
    return response.data;
  }

  async logout() {
    await axiosInstance.get('/auth/logout');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  async updateDetails(userData) {
    const response = await axiosInstance.put('/auth/updatedetails', userData);
    return response.data;
  }

  async updatePassword(passwordData) {
    const response = await axiosInstance.put('/auth/updatepassword', passwordData);
    return response.data;
  }

  async forgotPassword(email) {
    const response = await axiosInstance.post('/auth/forgotpassword', { email });
    return response.data;
  }

  async resetPassword(resetToken, password) {
    const response = await axiosInstance.put(`/auth/resetpassword/${resetToken}`, { password });
    return response.data;
  }
}

export default new AuthService();