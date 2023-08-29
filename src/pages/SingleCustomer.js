import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Button, Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
} from '@windmill/react-ui';
import Icon from "../components/Icon";

import {
    EditIcon,

} from "../icons";
import PageTitle from "../components/Typography/PageTitle";
import labelsFile from "../assets/xlxs/за етикети.xlsx";
import json2xls from 'json2xls'; // Import json2xls
import { saveAs } from "file-saver"; // Import saveAs function
import * as XLSX from 'xlsx';
import ExcelJS from 'exceljs';
import { config } from '../Constants';
import { fa } from 'faker/lib/locales';


const SingleCustomer = ({ match }) => {
    const apiBaseUrl = config.url.API_BASE_URL;
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [customer, setCustomer] = useState(null);
    const [editingDiscount, setEditingDiscount] = useState(false);
    const [newDiscount, setNewDiscount] = useState(0); const customerId = match.params.id; // Get the customerId from the route parameter
    const token = localStorage.getItem('accessToken')
    const loggedUser = JSON.parse(localStorage.getItem('user'))
    function closeModal() {
        setIsModalOpen(false);
    }
    const options = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };

    const handleSaveDiscount = () => {
        if (newDiscount !== customer.appliedDiscount) {
            // Call the API to update the discount
            // Make sure to import axios
            axios
                .post(apiBaseUrl + `/api/customers/${customerId}/set-discount/${newDiscount}`, null, options)
                .then(() => {
                    window.location.reload();

                })
                .catch(error => {
                    console.error('Error updating discount:', error);
                });
        }
        setEditingDiscount(false);
    };


    const handleDiscountChange = (event) => {
        setNewDiscount(event.target.value);
        closeModal();
    };



    useEffect(() => {
        const fetchUser = async () => {
            try {


                const response = await axios.get(`${apiBaseUrl}/api/customers/${customerId}`, options);
                setCustomer(response.data);
            } catch (error) {
                console.error('Error fetching customer:', error);
            }
        };

        fetchUser();
    }, [customerId, token, apiBaseUrl]);


    if (!customer) {
        return <div>Loading...</div>; // Add a loading indicator while data is being fetched
    }


    return (
        console.log(apiBaseUrl + `/api/customers/${customerId}`),
        console.log(customer),
        <><div>
            {customer ? ( // Check if customer is not null before rendering
                <>
                    <div className='text-center '>
                        <PageTitle>Клиент :<span> {customer.companyName}</span></PageTitle>
                    </div>
                    <div className='grid grid-cols-2 h-10 mb-4 '>
                        <div className='text-center border'>
                            <div className='mb-2'>Име: {customer.communicationName}</div>

                            <p className='mr-3'>ЕИК: {customer.bulstat}</p>
                        </div>
                        <div className=' text-center border'>
                            <p className='ml-3'>Email: {customer.email}</p>
                            <p className='ml-3'>Телефон: {customer.phone}</p>
                        </div>
                    </div>
                    <div className='grid grid-cols-2 border mb-4 '>
                        <div className='grid grid-cols-1 ml-3 mt-3 mb-3 space-y-[5px]'>

                            <div className='mb-2'>МОЛ: {customer.mol}</div>
                            <div className='mb-2'>Град: {customer.city}</div>
                            <div className='mb-2'>Адрес: {customer.companyAddress}</div>


                        </div>

                    </div>


                    <Modal isOpen={isModalOpen} onClose={closeModal}>
                        <ModalHeader className="flex items-center">
                            <Icon icon={EditIcon} className="w-6 h-6 mr-3" />
                            Промяна на отстъпка
                        </ModalHeader>
                        <ModalBody>
                            Отстъпката ще бъде променена на {" "}
                            {/* {selectedStatus && `"${selectedStatus}"`} */}
                            <b> {newDiscount} %</b>

                        </ModalBody>
                        <ModalFooter> <div className="hidden sm:block">
                            <Button onClick={() => { handleSaveDiscount(); } }>
                                Потвърждаване
                            </Button></div>
                            <div className="hidden sm:block">
                                <Button layout="outline" onClick={closeModal}>
                                    Отказ
                                </Button>
                            </div>
                        </ModalFooter></Modal>

                </>
            ) : (
                <p>Loading...</p> // Display a loading message while fetching data
            )}
        </div><div className='ml-4 font-bold justify-center mt-4 text-left'>
                <span className='text-xl'>
                    Отстъпка :{' '}
                    {editingDiscount ? (
                        <>
                            <input
                                type='number'
                                value={newDiscount}
                                onChange={handleDiscountChange}
                                className='border rounded p-1' />
                            <Button className='ml-4 text-s' onClick={() => { setIsModalOpen(true); } }>
                                Готово
                            </Button>
                            <Button layout="outline" className='ml-4 text-s' onClick={() => { setEditingDiscount(false); } }>
                                Отказ
                            </Button>
                        </>
                    ) : (
                        <>
                            <span>{customer.appliedDiscount !== null ? customer.appliedDiscount + '%' : '0%'}</span>
                            <Button className='ml-4 text-s' onClick={() => setEditingDiscount(true)}>
                                Промени
                            </Button>
                        </>
                    )}
                </span>
            </div></>
    );
};

export default SingleCustomer;
