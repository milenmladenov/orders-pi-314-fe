

import React, { useState, useEffect } from 'react';
import axios from 'axios';

import {
  Card,
  CardBody,
  Image,
  Button,
  Label,
  Input,
} from '@windmill/react-ui';
import { config } from '../Constants';


const ProfilePage = () => {

    const token = localStorage.getItem('accessToken')
    const [customer, setCustomer] = useState(null);
    const apiBaseUrl = config.url.API_BASE_URL;
    const options = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    useEffect(() => {
        console.log('useEffect running');
    
        const fetchUser = async () => {
          try {
            const response = await fetch(`${apiBaseUrl}/api/customers/logged-user`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            const data = await response.json();
            console.log('Response:', data);
            setCustomer(data);
          } catch (error) {
            console.error('Error fetching customer:', error);
          }
        };
        fetchUser();
      }, []);



  return (
    <div className="flex  justify-center ">
      <Card className="w-full max-w-sm mx-auto">
       
        <CardBody>
          <h2 className="text-xl font-semibold text-center">{customer?.companyName}</h2>
          <p className="text-center text-gray-600">{customer?.email}</p>

 <div className="mt-4 grid text-center border">
              <div>ЕИК : {customer?.bulstat}</div>

              <div>Телефон : {customer?.phone}</div>

              <div>Адрес : {customer?.companyAddress}</div>
              <div>Пощенски код : {customer?.postCode}</div>

       
          </div>

 
        
         
        </CardBody>
      </Card>
    </div>
  );
};

export default ProfilePage;
