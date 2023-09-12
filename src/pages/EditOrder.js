import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Select, Input, Label, HelperText, Button, Modal,
    ModalHeader,
    ModalBody,
    ModalFooter, Textarea
} from "@windmill/react-ui";
import PageTitle from "../components/Typography/PageTitle";
import { config } from '../Constants';
import ConfirmationModal from '../components/ConfirmationModal';
import "../assets/css/groups-in-rows.css"
import modelOptions from '../components/modelOptions';
import FolioOptions from '../components/FolioOptions';





const EditOrder = ({ match }) => {
    const apiBaseUrl = config.url.API_BASE_URL;

    const [order, setOrder] = useState(null);
    const orderId = match.params.id; // Get the orderId from the route parameter
    const token = localStorage.getItem('accessToken')
    const loggedUser = JSON.parse(localStorage.getItem('user'))
    const [totalPrice, setTotalPrice] = useState('0лв.');
    const [groupPrices, setGroupPrices] = useState(0);
    const [totalGroupPrices, setTotalGroupPrices] = useState(0);
    const [groupSqrt, setGroupSqrt] = useState(0);
    const [totalSqrt, setTotalSqrt] = useState(0);
    const [modalOpen, setModalOpen] = useState(false);
    const [orderPreflightUrl, setOrderPreflightUrl] = useState();
    const [handleNumber, setHandleNumber] = useState(0);
    const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false)
    const [orderData, setOrderData] = useState({
    });
    const [doorName, setDoorName] = useState('')
    const [handlePrice, setHandlePrice] = useState(0);



    const [groupForms, setGroupForms] = useState([
    ]);
    useEffect(() => {
        setOrderPreflightUrl(apiBaseUrl + '/api/orders/new-order/preflight');
        setOrderUrl(apiBaseUrl + '/api/orders/new-order');
    }, []);

    useEffect(() => {
        const fetchOrder = async () => {

            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                };
                const response = await axios.get(apiBaseUrl + `/api/orders/${orderId}`, config);
                const orderData = response.data;
                setHandlePrice(response.data.handlePrice);
                setData(orderData)
                setOrderData(orderData);
                setTotalPrice(response.data.totalPrice + ' лв. с ДДС')
                const initialFormState = orderData.groups.map((group) => ({
                    doorName: group.door.name,
                    modelName: group.model.name,
                    folioName: group.folio.name,
                    handleName: group.handle.name,
                    profilName: group.profil.name,
                    height: group.height,
                    width: group.width,
                    length: group.length,
                    number: group.number,
                    bothSidesLaminated: group.bothSidesLaminated.toString(), // Convert to string
                    detailType: {
                        material: group.detailType.material,
                        type: group.detailType.type
                    },
                    deliveryAddress: orderData.deliveryAddress,
                    discount: orderData.discount,
                    note: orderData.note
                }));
                setGroupForms(initialFormState)

                let handleNumber = 0;
                orderData.groups.map((group) => {
                    if (group.handle.name !== 'Без Дръжка') {
                        handleNumber += 1;
                        setHandleNumber(handleNumber);
                    }
                    return handleNumber;
                });
                let totalGroupPrices = 0
                orderData.groups.forEach((group) => {
                    setDoorName(group.door.name)
                    const result = group.groupTotalPrice;
                    totalGroupPrices += result;
                    setTotalGroupPrices(totalGroupPrices.toFixed(2))
                    return result;
                });

                setGroupPrices(groupPrices);

            } catch (error) {
                console.error('Error fetching order:', error);
            }
        };
        fetchOrder();
    }, [orderId]);

    useEffect(() => {
        handlePreflight();
    }, [groupForms]);
    
    useEffect(() => {
        console.log('groupPrices:', JSON.stringify(groupPrices));
        console.log('totalGroupPrices:', JSON.stringify(totalGroupPrices));
    }, [groupPrices, totalGroupPrices]);

    const handleSubmit = async () => {
        try {
            const token = localStorage.getItem('accessToken');
            const updatedGroups = groupForms.map((formData) => ({
                door: {
                    name: formData.doorName,
                },
                model: {
                    name: formData.modelName,
                },
                folio: {
                    name: formData.folioName,
                },
                handle: {
                    name: formData.handleName,
                },
                profil: {
                    name: formData.profilName,
                },
                bothSidesLaminated: formData.bothSidesLaminated,
                height: parseInt(formData.height),
                width: parseInt(formData.width),
                length: parseInt(formData.length),
                number: parseFloat(formData.number),
                detailType: {
                    material: formData.detailType.material,
                    type: formData.detailType.type,
                },
            }));

            // Create an updated order object with the existing orderData properties


            // Send the updated order to the server using a PUT request
            const response = await fetch(apiBaseUrl + '/api/orders/edit-order/' + orderId, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ 
                    groups: updatedGroups }
                ),
            });

            if (response.ok) {
                window.location.reload();

                // Handle success, e.g., show a success message or redirect to another page
            } else {
                // Handle errors, e.g., show an error message
                console.error('Failed to update order');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    const handleTypeChange = (event, index) => {
        const updatedGroupForms = groupForms.map((orderData, i) => {
            if (i === index) {
                return {
                    ...orderData,
                    detailType: {
                        ...orderData.detailType, // Keep the existing formData.detailType.material
                        type: event.target.value,
                    },
                };
            }
            return orderData;
        });
        setOrder(updatedGroupForms);
    };
    const handleMaterialChange = (event, index) => {
        const updatedGroupForms = groupForms.map((formData, i) => {
            if (i === index) {
                return { ...formData, detailType: { material: event.target.value } };
            }
            return formData;
        });
        setGroupForms(updatedGroupForms);
    };

    const handleChange = (event, index) => {
        const { name, value } = event.target;
        const updatedForms = groupForms.map((formData, i) => {
            if (i === index) {
                return { ...formData, [name]: value };
            }
            return formData;
        });
        setGroupForms(updatedForms);

    };

    const handleAddGroup = (event) => {
        setGroupForms((prevGroupForms) => [
            ...prevGroupForms,
            {
                doorName: doorName,
                modelName: groupForms[0].modelName,
                folioName: groupForms[0].folioName,
                handleName: groupForms[0].handleName,
                profilName: groupForms[0].profilName,
                height: 0,
                width: 0,
                length: 0,
                number: 1,
                bothSidesLaminated: groupForms[0].bothSidesLaminated,
                detailType: {
                    material: groupForms[0].detailType.material,
                    type: groupForms[0].detailType.type,
                },
            },
        ]);
    };



    const handleDeleteGroup = (indexToDelete) => {
        setGroupForms((prevGroupForms) =>
            prevGroupForms.filter((_, index) => index !== indexToDelete)
        );
    };

    const handlePreflight = () => {
        const groupsArray = groupForms.map((formData) => ({
            door: {
                name: doorName,
            },
            model: {
                name: formData.modelName,
            },
            folio: {
                name: formData.folioName,
            },
            handle: {
                name: formData.handleName,
            },
            profil: {
                name: formData.profilName,
            },
            bothSidesLaminated: formData.bothSidesLaminated,
            height: parseInt(formData.height),
            width: parseInt(formData.width),
            length: parseInt(formData.length),
            number: parseFloat(formData.number),
            detailType: {
                material: formData.detailType.material,
                type: formData.detailType.type
            }
        }));
        const token = localStorage.getItem('accessToken')
        // Send the data to the backend using AJAX

        fetch(orderPreflightUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                groups: groupsArray,
            }),
        })
            .then((response) => response.json())
            .then((data) => {
                setData(data);
                console.log(loggedUser.data.role);
                console.log(data);
                let totalSqrt = 0;
                let totalGroupPrices = 0;
                // Get the groupTotalPrice for every group in the response
                const groupPrices = data.groups.map((group) => {
                    const result = group.groupTotalPrice;
                    totalGroupPrices += result;
                    setTotalGroupPrices(totalGroupPrices.toFixed(2))
                    return result;
                });
                const groupSqrt = data.groups.map((group) => {
                    const result = ((group.height / 1000) * (group.width / 1000)) * group.number;
                    totalSqrt += result;
                    setTotalSqrt(totalSqrt.toFixed(2))

                    return result.toFixed(2);
                });
                let handleNumber = 0;
                data.groups.map((group) => {
                    if (group.handle.name !== 'Без Дръжка') {
                        handleNumber += 1; // Use += to increment the variable
                        setHandleNumber(handleNumber);
                    }
                    return handleNumber;
                });
                const totalPrice = data.totalPrice;

                setTotalPrice(`${totalPrice}лв. с ДДС`);
                setGroupPrices(groupPrices);
                setGroupSqrt(groupSqrt);
                console.log(groupSqrt)
                // Set the total price as the sum of all groupTotalPrices


                // Render the response data
                const isButtonDisabled = groupForms.some((formData) => (
                    (formData.detailType.material !== 'Чекмедже' && !(formData.modelName === 'A100' || formData.modelName === 'B503' || formData.modelName === 'B505' || formData.modelName === 'B810' || formData.modelName === 'A811' || formData.modelName === 'Без модел А100') && (formData.width < 200)) ||
                    (formData.width > 1160) ||
                    (formData.width < 60) ||
                    (formData.detailType.material === 'Чекмедже' && formData.width < 60) ||
                    (formData.detailType.material !== 'Чекмедже' && !(formData.modelName === 'Без модел A100' || formData.modelName === 'B503' || formData.modelName === 'B505' || formData.modelName === 'B810' || formData.modelName === 'A811') && (formData.height < 200)) ||
                    (formData.height > 2400) ||
                    ((formData.modelName === 'Без модел A100' || formData.modelName === 'B503' || formData.modelName === 'B505' || formData.modelName === 'B810' || formData.modelName === 'A811') && (formData.height < 60)) ||
                    (formData.detailType.material === 'Чекмедже' && formData.height < 60)
                ));

                setSubmitButtonDisabled(isButtonDisabled)
            })

            .catch((error) => {
                console.log('Error: ' + error.message);
            });
    };


    if (!orderData) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <div className="grid gap-2 mb-12 md:grid-cols-2">
                <div className="col-span-12 text-center sticky-top ">
                    <PageTitle>Редактиране на поръчка</PageTitle>

                    <div>

                        <div className="grid md:grid-cols-1 ml-20 ">
                            <div className='grid md:grid-cols-4'>
                                <div className='grid md:grid-rows-2 text-center border'><div>Общо кв.м. вратички</div><div className=''> <b>{totalSqrt} кв.м/ {totalGroupPrices}лв. с ДДС</b></div> </div>
                                <div className='grid md:grid-rows-2 text-center border'><div>Общо бр. дръжки.</div><div className=''><b> {handleNumber} бр./ {handlePrice}лв.</b>
                                </div> </div>

                                <div className="grid md:grid-rows-2 text-center border">
                                    <div>
                                        Общо ламиниране
                                    </div>
                                    <div className="">
                                        <b>{totalSqrt} кв.м</b>
                                    </div>
                                </div>
                                <div className='border grid md:grid-rows-2 text-center'><div>Обща цена :</div> <div> <b>{totalPrice}</b></div></div>

                            </div>


                            <div className='grid md:grid-cols-2 '>
                                <div className='text-right'>
                                    <Button
                                        className="w-full px-4 py-2 text-black bg-green-400 rounded-md shadow-md hover:bg-green-700"
                                        onClick={(event) => handleAddGroup(event)}
                                        style={{ width: '150px', margin: '10px' }}
                                        layout="outline"
                                    >
                                        Добави Детайл
                                    </Button></div>
                                <div className='text-left'>
                                    <Button
                                        type="button"
                                        style={{ width: '150px', margin: '10px' }}
                                        className="w-full py-2 text-white bg-indigo-600 rounded-md shadow-md hover:bg-indigo-700"
                                        disabled={submitButtonDisabled}
                                        onClick={() => setModalOpen(true)}
                                    >
                                        Завърши
                                    </Button>

                                </div>

                                <ConfirmationModal
                                    isOpen={modalOpen}
                                    onClose={() => setModalOpen(false)}
                                    onConfirm={handleSubmit}
                                />
                            </div>
                            {totalSqrt <= 1.5 && (<div className='text-center '>
                                <HelperText className='text-lg text-yellow-600'> <b><u>Общата квадратура на поръчката е под 1.5 кв.м. Добавена е 30% надценка !</u></b></HelperText><p><HelperText className='text-lg text-red-600'> <b><u>Доставката се поема от клиента !</u></b></HelperText></p></div>)}
                            {loggedUser.data.role === '[USER]' && orderData.appliedDiscount === null && (<div className='text-center'><HelperText className='text-lg text-green-600'> <b><u>Добавена е отстъпка от 5% </u></b></HelperText></div>)}
                            {loggedUser.data.role === '[USER]' && orderData.appliedDiscount != null && (<div className='text-center'><HelperText className='text-lg text-green-600'> <b><u>Добавена е отстъпка от {orderData.appliedDiscount + 5}% </u></b></HelperText></div>)}
                        </div>
                    </div>
                    <hr className="customeDivider mx-4 my-5" />

                </div>

                <div className="grid  md:grid-cols-1 gap-10">

                    {groupForms.map((formData, index) => (
                        <div className='' >
                            <div>
                                <div></div>
                            </div>
                            <div key={index} className="grid grid-cols-1 md:grid-cols-1 gap-2 cols-span-3" >

                                <form

                                    id={`orderForm${index}`}
                                    className="grid grid-cols-4 gap-4  hover:border"
                                    style={{ padding: '20px', width: '1230px' }}
                                >
                                    <div></div>
                                    <div></div>
                                    <div></div>
                                    <div className=''>
                                        <div className='ml-20'>
                                            <button type='button' onClick={(event) => handleAddGroup(event)}
                                                className="text-center w-10 h-10 bg-green-400 hover:bg-green-600"
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    strokeWidth={1.5}
                                                    stroke="currentColor"
                                                    className="w-10 h-10"
                                                >
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                                </svg>
                                            </button>


                                            {index > 0 && (

                                                <button
                                                    onClick={(event) => handleDeleteGroup(index)}
                                                    className="border w-10 h-10 ml-10 bg-red-500 hover:bg-red-800"
                                                    type="button"
                                                >
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        strokeWidth={1.5}
                                                        stroke="currentColor"
                                                        className="w-10 h-10"
                                                    >
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" />
                                                    </svg>
                                                </button>
                                            )}</div>

                                    </div>

                                    <div>
                                        <Label htmlFor="doorName" className="block font-medium">Материал:</Label>
                                        <Select className="mt-1 w-full p-2 border rounded-md shadow-sm"
                                            id="doorName"
                                            name="doorName"
                                            value={formData.doorName}
                                            onChange={(event) => { handleChange(event, index); setDoorName(event.target.value) }}
                                            disabled={index > 0}
                                            required

                                        >
                                            <option value="">-Изберете Материал-</option>
                                            <option value="Мембранна вратичка">Мембранна вратичка</option>
                                            <option value="Двустранно грундиран МДФ">Двустранно грундиран МДФ</option>
                                            <option value="Фурнирован МДФ">Фурнирован МДФ</option>
                                        </Select>
                                    </div>
                                    <div>
                                        <Label htmlFor={`materialName${index}`} className="block font-medium">Вид:</Label>
                                        <Select className="mt-1 w-full p-2 border rounded-md shadow-sm"
                                            id={`materialName${index}`}
                                            name={`materialName${index}`}
                                            value={formData.detailType.material !== '' ? formData.detailType.material : formData.detailType.material}
                                            onChange={(event) => handleMaterialChange(event, index)}
                                            required
                                            disabled={(doorName === '')}

                                        >
                                            <option value="">-Изберете Вид-</option>
                                            <option value="Вратичка">Вратичка</option>
                                            <option value="Страница">Страница</option>
                                            <option value="Чекмедже">Чекмедже</option>
                                            <option value="Пиластър">Пиластър</option>
                                            <option value="Корниз">Корниз</option>

                                        </Select>
                                        {formData.detailType.material === 'Пиластър' && (
                                            <div>
                                                <Label htmlFor={`typeName${index}`}>Пиластър:</Label>
                                                <Select
                                                    className="mt-1 w-full p-2 border rounded-md shadow-sm"
                                                    id={`typeName${index}`}
                                                    name={`typeName${index}`}
                                                    value={formData.detailType.type !== '' ? formData.detailType.type : formData.detailType.type}
                                                    onChange={(event) => { handleTypeChange(event, index) }}
                                                    required
                                                >
                                                    <option value="">-Изберете Пиластър-</option>
                                                    <option value="P1">P1</option>
                                                    <option value="P2">P2</option>
                                                    <option value="P3">P3</option>
                                                    {/* Add more options here */}
                                                </Select>
                                            </div>
                                        )}
                                        {formData.detailType.material === 'Чекмедже' && (
                                            <><div>
                                                <Select
                                                    className="mt-1 w-full p-2 border rounded-md shadow-sm"
                                                    id={`typeName${index}`}
                                                    name={`typeName${index}`}
                                                    value={formData.detailType.type !== '' ? formData.detailType.type : formData.detailType.type}
                                                    onChange={(event) => { handleTypeChange(event, index) }}
                                                    required
                                                >
                                                    <option value="">----------</option>
                                                    <option value="Обща фрезовка">Обща фрезовка</option>
                                                    <option value="Изчистен детайл">Изчистен детайл</option>
                                                    <option value="Корекция на рамка">Корекция на рамка</option>
                                                    {/* Add more options here */}
                                                </Select>
                                            </div></>
                                        )}
                                        {formData.detailType.material === 'Корниз' && (
                                            <><div>
                                                <Label htmlFor={`typeName${index}`}>Корниз:</Label>
                                                <Select
                                                    className="mt-1 w-full p-2 border rounded-md shadow-sm"
                                                    id={`typeName${index}`}
                                                    name={`typeName${index}`}
                                                    value={formData.detailType.type !== '' ? formData.detailType.type : formData.detailType.type}

                                                    onChange={(event) => handleTypeChange(event, index)}
                                                    required
                                                >
                                                    <option value="">-Изберете Корниз-</option>
                                                    <option value="К1 – 68мм височина">К1 – 68мм височина</option>
                                                    <option value="К2 – 70мм височина">К2 – 70мм височина</option>
                                                    <option value="К3 – 80мм височина">К3 – 80мм височина</option>
                                                    {/* Add more options here */}
                                                </Select>
                                            </div></>
                                        )}
                                    </div>

                                    {/* Model Name */}
                                    <div>
                                        <Label htmlFor="modelName" className="block font-medium">Модел:</Label>
                                        <Select className="mt-1 w-full p-2 border rounded-md shadow-sm"
                                            id="modelName"
                                            name="modelName"
                                            value={formData.modelName !== '' ? formData.modelName : order.model.name}
                                            onChange={(event) => { handleChange(event, index); }}
                                            disabled={(doorName === '' || formData.detailType.material === "Пиластър" || formData.detailType.material === "Корниз")}
                                            required
                                        >

                                            <option value="" selected="selected">-Изберете Модел-</option>
                                            {modelOptions.map((option, index) => (
                                                <option key={index} value={option}>
                                                    {option}
                                                </option>
                                            ))}
                                        </Select>
                                    </div>
                                    <div>
                                        {/* Folio Name s
*/}
                                        <Label htmlFor="folioName" className="block font-medium">Фолио :</Label>
                                        <Select className="mt-1 w-full p-2 border rounded-md shadow-sm"
                                            id="folioName"
                                            name="folioName"
                                            value={formData.folioName !== '' ? formData.folioName : order.folio.name}
                                            onChange={(event) => { handleChange(event, index) }}
                                            disabled={formData.modelName === '' || doorName === 'Двустранно грундиран МДФ' || doorName === 'Фурнирован МДФ'}
                                            required
                                        >
                                            <option value="" selected="selected">-Изберете Фолио-</option>
                                            {FolioOptions.map((option, index) => (
                                                <option key={index} value={option}>
                                                    {option}
                                                </option>))}
                                        </Select>
                                    </div><div>
                                        {/* Handle Name */}
                                        <Label htmlFor="handleName" className="block font-medium">Дръжка</Label>
                                        <Select className="mt-1 w-full p-2 border rounded-md shadow-sm"
                                            type="text"
                                            id="handleName"
                                            name="handleName"
                                            value={formData.handleName !== '' ? formData.handleName : order.handle.name}
                                            onChange={(event) => { handleChange(event, index) }}
                                            disabled={formData.modelName === '' || formData.detailType.material === 'Корниз'}
                                        >
                                            <option value="Без Дръжка">Без дръжка</option>
                                            <option value="дръжка H1">дръжка H1</option></Select></div>
                                    <div>
                                        {/* Profil Name */}
                                        <Label htmlFor="profilName" className="block font-medium">Профил:</Label>
                                        <Select className="mt-1 w-full p-2 border rounded-md shadow-sm"
                                            type="text"
                                            id="profilName"
                                            name="profilName"
                                            value={formData.profilName !== '' ? formData.profilName : order.profil.name}
                                            onChange={(event) => { handleChange(event, index) }}
                                            required
                                            disabled={formData.modelName === '' || doorName === 'Фурнирован МДФ' || formData.detailType.material === 'Корниз'}
                                        >
                                            <option value="R1">Профил R1</option>
                                            <option value="R2">Профил R2</option>
                                            <option value="R3">Профил R3</option>
                                            <option value="R4">Профил R4</option>
                                            <option value="R5">Профил R5</option></Select>





                                    </div>
                                    {formData.detailType.material === 'Корниз' ? (
                                        <>
                                            <div>
                                                <Label htmlFor="length" className="block font-medium">Дължина, мм:</Label>
                                                <Select
                                                    className="mt-1 w-full p-2 border rounded-md shadow-sm"
                                                    id="length"
                                                    name="length"
                                                    value={formData.length !== '' ? formData.length : order.length}
                                                    onChange={(event) => { handleChange(event, index) }}
                                                    required
                                                >
                                                    <option value="2360">2360мм / 1бр.</option>
                                                    <option value="1160">1160мм / 0.5бр.</option>
                                                </Select>
                                            </div>
                                        </>
                                    ) : formData.detailType.material === 'Пиластър' ? (

                                        <div>
                                            {/* Height */}
                                            <div>
                                                <Label htmlFor="height" className="block font-medium">Височина, мм:</Label>
                                                <Input className="mt-1 p-2 border rounded-md shadow-sm"
                                                    type="number"
                                                    id="height"
                                                    name="height"
                                                    value={formData.height !== '' ? formData.height : order.height}
                                                    onChange={(event) => { handleChange(event, index) }}
                                                    required />
                                            </div>
                                            {formData.detailType.material === 'Пиластър' && (
                                                <div>
                                                    <Label htmlFor="width" className="block font-medium">Широчина, мм:</Label>
                                                    <Select
                                                        className="mt-1 w-full p-2 border rounded-md shadow-sm"
                                                        id={`typeName${index}`}
                                                        name={`typeName${index}`}
                                                        value={formData.width !== '' ? formData.width : order.width}
                                                        onChange={(event) => { handleChange(event, index) }}
                                                        required
                                                    >
                                                        <option value="50">50</option>
                                                        <option value="60">60</option>
                                                        <option value="70">70</option>
                                                        <option value="80">80</option>
                                                        <option value="90">90</option>
                                                        <option value="100">100</option>
                                                        <option value="110">110</option>
                                                    </Select>
                                                </div>
                                            )}
                                        </div>

                                    ) : (
                                        <>
                                            <div>
                                                {/* Height */}
                                                <Label htmlFor="height" className="block font-medium">Височина, мм:</Label>
                                                <Input className="mt-1 p-2 border rounded-md shadow-sm"
                                                    type="number"
                                                    id="height"
                                                    name="height"
                                                    value={formData.height}
                                                    onChange={(event) => handleChange(event, index)}
                                                    required />
                                                {formData.detailType.material !== 'Чекмедже' && !(formData.modelName === 'Без модел A100' || formData.modelName === 'B503' || formData.modelName === 'B505' || formData.modelName === 'B810' || formData.modelName === 'A811') && (formData.height < 200) && (
                                                    <HelperText valid={false}>минимум 200мм</HelperText>)}
                                                {formData.height > 2400 && (
                                                    <HelperText valid={false}>макс 2400мм</HelperText>)}
                                                {(formData.modelName === 'Без модел A100' || formData.modelName === 'B503' || formData.modelName === 'B505' || formData.modelName === 'B810' || formData.modelName === 'A811') && (formData.height < 60) && (
                                                    <HelperText valid={false}>минимум 60мм</HelperText>)}
                                                {formData.detailType.material === 'Чекмедже' && formData.height < 60 && (
                                                    <HelperText valid={false}>минимум 60мм</HelperText>
                                                )}

                                            </div>
                                            <div>
                                                <Label htmlFor="width" className="block font-medium">Широчина, мм:</Label>
                                                <Input
                                                    className="mt-1 p-2 border rounded-md shadow-sm"
                                                    type="number"
                                                    id="width"
                                                    name="width"
                                                    value={formData.width}
                                                    onChange={(event) => { handleChange(event, index) }}
                                                    required />
                                                {formData.detailType.material !== 'Чекмедже' && !(formData.modelName === 'Без модел A100' || formData.modelName === 'B503' || formData.modelName === 'B505' || formData.modelName === 'B810' || formData.modelName === 'A811') && (formData.width < 200) && (
                                                    <HelperText valid={false}>минимум 200мм</HelperText>)}
                                                {formData.width > 1160 && (
                                                    <HelperText valid={false}>макс 1160мм</HelperText>)}
                                                {(formData.modelName === 'Без модел A100' || formData.modelName === 'B503' || formData.modelName === 'B505' || formData.modelName === 'B810' || formData.modelName === 'A811') && (formData.width < 60) && (
                                                    <HelperText valid={false}>минимум 60мм</HelperText>)}
                                                {formData.detailType.material === 'Чекмедже' && formData.width < 60 && (
                                                    <HelperText valid={false}>минимум 60мм</HelperText>
                                                )}
                                            </div>

                                        </>
                                    )}


                                    <div>
                                        {/* Number */}
                                        <Label htmlFor="number" className="block font-medium">Брой:</Label>
                                        <Input
                                            className="mt-1 p-2 border rounded-md shadow-sm"
                                            type="number"
                                            id={`number${index}`}
                                            name="number"
                                            value={formData.number}
                                            onChange={(event) => { handleChange(event, index) }}
                                            required disabled={formData.detailType.material == 'Пиластър'}
                                        />
                                    </div>
                                    <div>
                                        <Label>Ламиниране:</Label>
                                        <Select className="mt-1 w-full p-2 border rounded-md shadow-sm"
                                            type="boolean"
                                            id={`bothSidesLaminated${index}`}
                                            name="bothSidesLaminated"
                                            value={formData.bothSidesLaminated}
                                            onChange={(event) => { handleChange(event, index) }}
                                            disabled={doorName === 'Двустранно грундиран МДФ' || doorName === 'Фурнирован МДФ'}
                                        >
                                            <option value="false">Едностранно ламиниране</option>
                                            <option value="true">Двустранно ламиниране</option>
                                        </Select>





                                    </div>


                                </form>
                                <div className='grid md:grid-cols-4'>
                                    <div className='grid md:grid-rows-2 text-center border'><div>Вратичка на кв.м.</div><div className=''> <b>{groupSqrt[index]} кв.м/ {groupPrices[index]}лв. с ДДС</b></div> </div>
                                    <div className='grid md:grid-rows-2 text-center border'><div>Дръжка, бр.</div><div className=''> <b>{formData.handleName !== "Без Дръжка"
                                        ? `1бр. / ${handlePrice}лв.`
                                        : `0бр. / ${handlePrice}лв.`} </b></div> </div>

                                    <div className="grid md:grid-rows-2 text-center border">
                                        <div>
                                            {orderData.bothSidesLaminated === "false"
                                                ? "Едностранно ламиниране"
                                                : "Двустранно ламиниране"}
                                        </div>
                                        <div className="">
                                            <b>{groupSqrt[index]} кв.м</b>
                                        </div>
                                    </div>
                                    <div className='border grid md:grid-rows-2 text-center'><div>Цена на групата :</div> <div> <b>{groupPrices[index]}лв. с ДДС</b></div></div>

                                </div>
                            </div>

                        </div>

                    ))}
                </div></div ></>)
}

export default EditOrder;