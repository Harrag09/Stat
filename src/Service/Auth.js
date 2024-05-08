// Client-side (AuthService.js)
import axios from 'axios';

import { Url } from './CategoriesServer';

const AuthService= {
  
    signIn: async (login, password) => {
        try {
          const response = await axios.post(`${Url}/auth/signin`, { Login: login, Password: password });
          
          return response.data;
        } catch (error) {
          throw error.response.data.error;
        }
      }

  



  };

export default AuthService;
