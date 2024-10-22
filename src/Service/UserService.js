import axios from 'axios';
import { Url } from './CategoriesServer';

const UserService = {
  GetStatFromTableReel: async (idCRM, date1, date2) => {
    try {
   
      const response = await axios.get(`${Url}/SumData2`, {
        params: {
          idCRM: idCRM,
          date1: date1,
          date2: date2
        }
      });
     
      return response.data;
    } catch (error) {
      throw error.response.data.error;
    }
  },
  GetStatFromTableStats: async (idCRM, date1, date2) => {
    try {
      // Append query parameters to the URL string
      const response = await axios.get(`${Url}/SumData`, {
        params: {
          idCRM: idCRM,
          date1: date1,
          date2: date2
        }
      });
     
      return response.data;
    } catch (error) {
      throw error.response.data.error;
    }
  },
  GetBaseDeDonne: async (idCRM) => {
    try {
    
const response = await axios.get(`${Url}/GetBaseName/${idCRM}`);
      return response.data;
    } catch (error) {
      throw error.response.data.error;
    }
  },
  UpdateBaseDeDonne: async (idCRM,action) => {
    try {
      console.log(idCRM,action)
      const response = await axios.get(`${Url}/UpdateBaseDeDonne/${idCRM}/${action}`);

      return response.data;
    } catch (error) {
      throw error.response.data.error;
    }
  }
  
};

export default UserService;
