
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
        console.log("data",data);
          const response = await axios.post(`${Url}/auth/signup`, { Nom:data.Nom, Login:data.Login, Password:data.Password, Tel: data.Tel, idCRM:data.idCRM ,Email: data.Email ,Setting :false,BaseName:"DefaultBase"});
      
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
      UpdateStore: async (_id,Nom, Login, Password, idCRM ,Email,Tel,Setting ) => {
        try {
  
          const response = await axios.put(`${Url}/auth/modifyUser/${_id}`, {Nom, Login, Password, idCRM ,Email,Tel,Setting});
    
          return response.data;
        } catch (error) {
          throw error.response.data.error;
        }
      },
      getUserByIDcrm: async (idCRM) => {
        try {
  
          const response = await axios.get(`${Url}/auth/getUserByIdcrm/${idCRM}`);
    
          return response.data;
        } catch (error) {
          throw error.response.data.error;
        }
      },
      DeleteUsers: async (_id) => {
        try {
     
          const response = await axios.delete(`${Url}/auth/deleteUser/${_id}`);
      
          return response.data;
        } catch (error) {
          throw error.response.data.error;
        }
      }



  };

export default AdminService;
