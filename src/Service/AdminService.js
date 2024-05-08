
import axios from 'axios';

import { Url } from './CategoriesServer';

const AdminService= {
  
    getAllStores: async (login, password) => {
        try {
          const response = await axios.get(`${Url}/auth/all`);
     
          return response.data;
        } catch (error) {
          throw error.response.data.error;
        }
      },
      AjoutStores: async (data) => {
        try {
        
          const response = await axios.post(`${Url}/auth/signup`, { Nom:data.Nom, Login:data.Login, Password:data.Password, Tel: data.Tel, idCRM:data.idCRM ,Email: data.Email });
      
          return response.data;
        } catch (error) {
          throw error.response.data.error;
        }
      }
      ,
      UpdateLicence: async (idCRM,action) => {
        try {
       
          const response = await axios.get(`${Url}/UpdateLicence/${idCRM}/${action}`);
   
          return response.data;
        } catch (error) {
          throw error.response.data.error;
        }
      }
      ,
      UpdateStore: async (_id,Nom, Login, Password, idCRM ,Email,Tel ) => {
        try {
  
          const response = await axios.put(`${Url}/auth/modifyUser/${_id}`, {Nom, Login, Password, idCRM ,Email,Tel});
    
          return response.data;
        } catch (error) {
          throw error.response.data.error;
        }
      }



  };

export default AdminService;
