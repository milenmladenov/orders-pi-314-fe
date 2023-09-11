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






const EditOrder = ({ match }) => {
    const apiBaseUrl = config.url.API_BASE_URL;

    const [order, setOrder] = useState(null);
    const orderId = match.params.id; // Get the orderId from the route parameter
    const token = localStorage.getItem('accessToken')
    const loggedUser = JSON.parse(localStorage.getItem('user'))
    const [totalPrice, setTotalPrice] = useState('0лв.');
    const [groupPrices, setGroupPrices] = useState('0');
    const [totalGroupPrices, setTotalGroupPrices] = useState('0');
    const [groupSqrt, setGroupSqrt] = useState('0');
    const [totalSqrt, setTotalSqrt] = useState('0');
    const [modalOpen, setModalOpen] = useState(false);
    const [orderUrl, setOrderUrl] = useState();
    const [orderPreflightUrl, setOrderPreflightUrl] = useState();
    const [handlePrice, setHandlePrice] = useState(0);
    const [handleNumber, setHandleNumber] = useState(0);
    const [data, setData] = useState([]);
    const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false)
    const [orderData, setOrderData] = useState({
    });
    const [doorName,setDoorName] = useState('')
   
    const initialFormState = {
        doorName: "",
        modelName: "Без",
        folioName: "Без",
        handleName: 'Без Дръжка',
        profilName: 'R1',
        height: 400,
        width: 400,
        length: 2360,
        number: 1,
        bothSidesLaminated: "false",
        detailType: {
            material: "",
            type: ""
        },
        deliveryAddress: '',
        discount: 0,
        note: ''
    };
    const [groupForms, setGroupForms] = useState([
        { ...initialFormState }
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
                setData(orderData)
                setOrderData(orderData);
                console.log(response.data)
                setTotalPrice(orderData.totalPrice + ' лв. с ДДС')
                
                orderData.groups.forEach((group) => {
                    setGroupPrices(group.groupTotalPrice)
                    setDoorName(group.door.name)
                    
                })
            } catch (error) {
                console.error('Error fetching order:', error);
            }
        };

        fetchOrder();
    }, [orderId]);
    const handlematerialChange = (event, index) => {
        const updatedGroupForms = orderData.groups.map((orderData, i) => {
            if (i === index) {
                return { ...orderData, detailType: { material: event.target.value } };
            }
            return orderData;
        });
        setOrder(updatedGroupForms);
    };

    useEffect(() => {
        handlePreflight();
    }, [groupForms]);

    const handleSubmit = () => {
    //     const groupsArray = [{
    //         door: {
    //             name: orderData.doorName,
    //         },
    //         model: {
    //             name: modelName,
    //         },
    //         folio: {
    //             name: orderData.folioName,
    //         },
    //         handle: {
    //             name: orderData.handleName,
    //         },
    //         profil: {
    //             name: orderData.profilName,
    //         },
    //         height: parseInt(height),
    //         width: parseInt(orderData.width),
    //         length: parseInt(orderData.length),
    //         number: parseInt(orderData.number),
    //         detailType: {
    //             material: orderData.detailType.material,
    //             type: type
    //         }
    //     }
    //     ]
    //     const token = localStorage.getItem('accessToken')
    //     // Send the data to the backend using AJAX
    //     fetch(orderUrl, {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json',
    //             Authorization: `Bearer ${token}`,
    //         },
    //         body: JSON.stringify({
    //             groups: groupsArray,
    //         }),
    //     })
    //         .then((response) => response.json())
    //         .then((data) => {
    //             console.log(data);

    //             // Get the groupTotalPrice for every group in the response
    //             const groupPrices = data.groups.map((group) => group.groupTotalPrice);
    //             const groupSqrt = data.groups.map((group) => {
    //                 console.log("Height:", group.height);
    //                 console.log("Width:", group.width);
    //                 console.log("Number:", group.number);

    //                 const result = (group.height * group.width) * group.number;
    //                 console.log("Result:", result);

    //                 return result;
    //             });
    //             // Set the total price as the sum of all groupTotalPrices
    //             const totalPrice = data.totalPrice;

    //             // Render the response data
    //             setTotalPrice(`${totalPrice}лв. с ДДС`);
    //             setGroupPrices(groupPrices);
    //             setGroupSqrt(groupSqrt);
    //             console.log(groupSqrt)
    //             window.location.reload();


    //         })
    //         .catch((error) => {
    //             setTotalPrice('Error: ' + error.message);
    //         });
    // };
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
                setHandlePrice(orderData.handlePrice);
                setGroupPrices();
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

                    {orderData && orderData.groups && orderData.groups.map((order) => (
                        groupForms.map((formData,index) => (
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
                                            value={doorName}
                                            onChange={(event) => { handleChange(event, index) ; setDoorName(event.target.value)}} 
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
                                            value={formData.detailType.material !== '' ? formData.detailType.material : order.detailType.material}
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
                                                    value={formData.detailType.type !== '' ? formData.detailType.type : order.detailType.type}
                                                    onChange={(event) => {handleTypeChange(event,index)}}
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
                                                    value={formData.detailType.type !== '' ? formData.detailType.type : order.detailType.type}
                                                    onChange={(event) => { handleTypeChange(event,index) }}
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
                                                    value={formData.detailType.type !== '' ? formData.detailType.type : order.detailType.type}

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
                                            onChange={(event) => { handleChange(event, index);}}
                                            disabled={(doorName === '' || formData.detailType.material === "Пиластър" || formData.detailType.material === "Корниз")}
                                            required
                                        >

                                            <option value="" selected="selected">-Изберете Модел-</option>
                                            <option value="А1108">А1108</option>
                                            <option value="Без модел A100">Без модел A100</option>
                                            <option value="A1201">A1201</option>
                                            <option value="A1202">A1202</option>
                                            <option value="A1203">A1203</option>
                                            <option value="A1204">A1204</option>
                                            <option value="A1205">A1205</option>
                                            <option value="A1206">A1206</option>
                                            <option value="A801">A801</option>
                                            <option value="A802">A802</option>
                                            <option value="A803">A803</option>
                                            <option value="A804">A804</option>
                                            <option value="A805">A805</option>
                                            <option value="A806">A806</option>
                                            <option value="A807">A807</option>
                                            <option value="A808">A808</option>
                                            <option value="A809">A809</option>
                                            <option value="A811">A811</option>
                                            <option value="A812">A812</option>
                                            <option value="A813">A813</option>
                                            <option value="A814">A814</option>
                                            <option value="A815">A815</option>
                                            <option value="A816">A816</option>
                                            <option value="A817">A817</option>
                                            <option value="A818">A818</option>
                                            <option value="A819">A819</option>
                                            <option value="A820">A820</option>
                                            <option value="A821">A821</option>
                                            <option value="A822">A822</option>
                                            <option value="A823">A823</option>
                                            <option value="A824">A824</option>
                                            <option value="A825">A825</option>
                                            <option value="A826">A826</option>
                                            <option value="A827">A827</option>
                                            <option value="A828">A828</option>
                                            <option value="A829">A829</option>
                                            <option value="A830">A830</option>
                                            <option value="B201">B201</option>
                                            <option value="B204">B204</option>
                                            <option value="B205">B205</option>
                                            <option value="B206">B206</option>
                                            <option value="B503">B503</option>
                                            <option value="B504">B504</option>
                                            <option value="B505">B505</option>
                                            <option value="B506">B506</option>
                                            <option value="B507">B507</option>
                                            <option value="B508">B508</option>
                                            <option value="B509">B509</option>
                                            <option value="B601">B601</option>
                                            <option value="B602">B602</option>
                                            <option value="B603">B603</option>
                                            <option value="B604">B604</option>
                                            <option value="B605">B605</option>
                                            <option value="B606">B606</option>
                                            <option value="B607">B607</option>
                                            <option value="B608">B608</option>
                                            <option value="B609">B609</option>
                                            <option value="B701">B701</option>
                                            <option value="B702">B702</option>
                                            <option value="B703">B703</option>
                                            <option value="B704">B704</option>
                                            <option value="B705">B705</option>
                                            <option value="B706">B706</option>
                                            <option value="B707">B707</option>
                                            <option value="B708">B708</option>
                                            <option value="B710">B710</option>
                                            <option value="B711">B711</option>
                                            <option value="B712">B712</option>
                                            <option value="B713">B713</option>
                                            <option value="B714">B714</option>
                                            <option value="B715">B715</option>
                                            <option value="B716">B716</option>
                                            <option value="B717">B717</option>
                                            <option value="B718">B718</option>
                                            <option value="B810">B810</option>
                                            <option value="C202">C202</option>
                                            <option value="C203">C203</option>
                                            <option value="C207">C207</option>
                                            <option value="C208">C208</option>
                                            <option value="C209">C209</option>
                                            <option value="C210">C210</option>
                                            <option value="C211">C211</option>
                                            <option value="C212">C212</option>
                                            <option value="C301">C301</option>
                                            <option value="C302">C302</option>
                                            <option value="C303">C303</option>
                                            <option value="C304">C304</option>
                                            <option value="C305">C305</option>
                                            <option value="C306">C306</option>
                                            <option value="C307">C307</option>
                                            <option value="C308">C308</option>
                                            <option value="C309">C309</option>
                                            <option value="C310">C310</option>
                                            <option value="C311">C311</option>
                                            <option value="C312">C312</option>
                                            <option value="C313">C313</option>
                                            <option value="C314">C314</option>
                                            <option value="C315">C315</option>
                                            <option value="C401">C401</option>
                                            <option value="C403">C403</option>
                                            <option value="C404">C404</option>
                                            <option value="C405">C405</option>
                                            <option value="C406">C406</option>
                                            <option value="C407">C407</option>
                                            <option value="C408">C408</option>
                                            <option value="C409">C409</option>
                                            <option value="C501">C501</option>
                                            <option value="C502">C502</option>
                                            <option value="C709">C709</option>
                                            <option value="C901">C901</option>
                                            <option value="C902">C902</option>
                                            <option value="C903">C903</option>
                                            <option value="C904">C904</option>
                                            <option value="C905">C905</option>
                                            <option value="C906">C906</option>
                                            <option value="C907">C907</option>
                                            <option value="C908">C908</option>
                                            <option value="C909">C909</option>
                                            <option value="D1105">D1105</option>
                                            <option value="D1104">D1104</option>
                                            <option value="D1106">D1106</option>
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
                                            onChange={(event) => { handleChange(event, index)}}
                                            disabled={formData.modelName === '' || doorName === 'Двустранно грундиран МДФ' || doorName === 'Фурнирован МДФ'}
                                            required
                                        >
                                            <option value="" selected="selected">-Изберете Фолио-</option>
                                            <option value="U1001-2">U1001-2</option>
                                            <option value="U1003-2 не е налично.">U1003-2 не е налично.</option>
                                            <option value="U1004-2 не е налично.">U1004-2 не е налично.</option>
                                            <option value="U1006-2 не е налично">U1006-2 не е налично</option>
                                            <option value="U1008-2">U1008-2</option>
                                            <option value="U1010-2">U1010-2</option>
                                            <option value="U2005-2">U2005-2</option>
                                            <option value="U2006-2">U2006-2</option>
                                            <option value="U2009-2">U2009-2</option>
                                            <option value="U2010-2">U2010-2</option>
                                            <option value="U2011-2">U2011-2</option>
                                            <option value="U2012-1- спрян от производство">U2012-1- спрян от производство</option>
                                            <option value="U2013-2">U2013-2</option>
                                            <option value="U2014-2">U2014-2</option>
                                            <option value="U2015-2">U2015-2</option>
                                            <option value="U2017-2">U2017-2</option>
                                            <option value="V1007-2">V1007-2</option>
                                            <option value="V1012-2-не е наличен.">V1012-2-не е наличен.</option>
                                            <option value="V1013-2">V1013-2</option>
                                            <option value="V1014-2">V1014-2</option>
                                            <option value="V2018-2">V2018-2</option>
                                            <option value="V4091-2">V4091-2</option>
                                            <option value="V4092-2">V4092-2</option>
                                            <option value="V4094-2">V4094-2</option>
                                            <option value="V4095-2 ниска наличност">V4095-2 ниска наличност</option>
                                            <option value="V4096-2">V4096-2</option>
                                            <option value="V4099-2 не е налично">V4099-2 не е налично</option>
                                            <option value="V6001-2">V6001-2</option>
                                            <option value="V6028-2 ">V6028-2 </option>
                                            <option value="V6033-2-спрян от производство">V6033-2-спрян от производство</option>
                                            <option value="W1002-2">W1002-2</option>
                                            <option value="W1005-2">W1005-2</option>
                                            <option value="W1009-2 не е налично">W1009-2 не е налично</option>
                                            <option value="W1015-2">W1015-2</option>
                                            <option value="W1016-2">W1016-2</option>
                                            <option value="W2004-2">W2004-2</option>
                                            <option value="W2008-2-не е налично">W2008-2-не е налично</option>
                                            <option value="W2016-2-спрян от производство.">W2016-2-спрян от производство.</option>
                                            <option value="W4090-2">W4090-2</option>
                                            <option value="W4093-2">W4093-2</option>
                                            <option value="W4097-2">W4097-2</option>
                                            <option value="W4098-2">W4098-2</option>
                                            <option value="W5050-2">W5050-2</option>
                                            <option value="W5051-2">W5051-2</option>
                                            <option value="W5052-2">W5052-2</option>
                                            <option value="W5059-2">W5059-2</option>
                                            <option value="W5060-2">W5060-2</option>
                                            <option value="W5061-2">W5061-2</option>
                                            <option value="W5062-2 не е налично">W5062-2 не е налично</option>
                                            <option value="W5063-2">W5063-2</option>
                                            <option value="W5064-2">W5064-2</option>
                                            <option value="W5065-2">W5065-2</option>
                                            <option value="W5066-2 няма наличност;">W5066-2 няма наличност;</option>
                                            <option value="W5067-2">W5067-2</option>
                                            <option value="W6002-2">W6002-2</option>
                                            <option value="W6003-2">W6003-2</option>
                                            <option value="W6004-2 ">W6004-2 </option>
                                            <option value="W6015-2">W6015-2</option>
                                            <option value="W6016-2">W6016-2</option>
                                            <option value="W6019-2">W6019-2</option>
                                            <option value="W6020-2">W6020-2</option>
                                            <option value="W6021-2">W6021-2</option>
                                            <option value="W6022-2">W6022-2</option>
                                            <option value="W6023-2">W6023-2</option>
                                            <option value="W6024-2">W6024-2</option>
                                            <option value="W6025-2">W6025-2</option>
                                            <option value="W6026-2 ">W6026-2 </option>
                                            <option value="W6027-2">W6027-2</option>
                                            <option value="W6029-2">W6029-2</option>
                                            <option value="W6031-2">W6031-2</option>
                                            <option value="W6034-2 ">W6034-2 </option>
                                            <option value="W6035-2">W6035-2</option>
                                            <option value="W6036-2">W6036-2</option>
                                            <option value="W6040-2">W6040-2</option>
                                            <option value="W6041-2">W6041-2</option>
                                            <option value="W6042-2">W6042-2</option>
                                            <option value="W6043-2">W6043-2</option>
                                            <option value="W6044-2">W6044-2</option>
                                            <option value="W6045-2">W6045-2</option>
                                            <option value="W6046-2">W6046-2</option>
                                            <option value="W6047-2">W6047-2</option>
                                            <option value="W6048-2">W6048-2</option>
                                            <option value="W6049-2">W6049-2</option>
                                            <option value="W6051-2">W6051-2</option>
                                            <option value="W6052-2">W6052-2</option>
                                            <option value="W6053-2">W6053-2</option>
                                            <option value="W6054-2">W6054-2</option>
                                            <option value="W6055-2-ниска наличност">W6055-2-ниска наличност</option>
                                            <option value="W6056-2">W6056-2</option>
                                            <option value="W6057-2">W6057-2</option>
                                            <option value="W6066-2">W6066-2</option>
                                            <option value="X1011-1">X1011-1</option>
                                            <option value="X2001-1">X2001-1</option>
                                            <option value="X2002-1">X2002-1</option>
                                            <option value="X2003-1">X2003-1</option>
                                            <option value="X2007-1">X2007-1</option>
                                            <option value="X3001-1">X3001-1</option>
                                            <option value="X3004-1">X3004-1</option>
                                            <option value="X5030-1">X5030-1</option>
                                            <option value="X5031-1">X5031-1</option>
                                            <option value="X5033-1">X5033-1</option>
                                            <option value="X5034-1-ниска наличност">X5034-1-ниска наличност</option>
                                            <option value="X5035-1">X5035-1</option>
                                            <option value="X5036-1">X5036-1</option>
                                            <option value="X5037-1">X5037-1</option>
                                            <option value="X5040-1">X5040-1</option>
                                            <option value="X5041-1">X5041-1</option>
                                            <option value="X5042-1-не е налично">X5042-1-не е налично</option>
                                            <option value="X5053-1">X5053-1</option>
                                            <option value="X5055-1">X5055-1</option>
                                            <option value="X5056-1">X5056-1</option>
                                            <option value="X5057-2">X5057-2</option>
                                            <option value="X5058-2">X5058-2</option>
                                            <option value="X6017-2">X6017-2</option>
                                            <option value="X6018-2">X6018-2</option>
                                            <option value="X6037-2">X6037-2</option>
                                            <option value="X6038-2">X6038-2</option>
                                            <option value="Y5044-1">Y5044-1</option>
                                            <option value="Y5045-1- спрян от производство">Y5045-1- спрян от производство</option>
                                            <option value="Y5046-1-няма наличност">Y5046-1-няма наличност</option>
                                            <option value="Y5047-1">Y5047-1</option>
                                            <option value="Y5048-1-няма наличност">Y5048-1-няма наличност</option>
                                            <option value="Y5049-1-ниска наличност">Y5049-1-ниска наличност</option>
                                            <option value="Y6030-2">Y6030-2</option>
                                            <option value="Y6032-2-не е налично">Y6032-2-не е налично</option>
                                            <option value="Y6097-1-не е налично">Y6097-1-не е налично</option>
                                            <option value="Y6098-1">Y6098-1</option>
                                            <option value="Y6099-1">Y6099-1</option>
                                            <option value="Y7076-1">Y7076-1</option>
                                            <option value="Y7077-1">Y7077-1</option>
                                            <option value="Z3006-2">Z3006-2</option>       </Select>
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
                                            onChange={(event) => { handleChange(event, index)}}
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
                                                    onChange={(event) => { handleChange(event, index)}}
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
                                                        onChange={(event) => { handleChange(event, index)}}
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
                                                    value={formData.height !== '' ? formData.height : order.height}
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
                                                    value={formData.width !== '' ? formData.width : order.width}
                                                    onChange={(event) => { handleChange(event, index)}}
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
                                            value={formData.number !== '' ? formData.number : order.number}
                                            onChange={(event) => { handleChange(event, index)}}
                                            required disabled={formData.detailType.material == 'Пиластър'}
                                        />
                                    </div>
                                    <div>
                                        <Label>Ламиниране:</Label>
                                        <Select className="mt-1 w-full p-2 border rounded-md shadow-sm"
                                            type="boolean"
                                            id={`bothSidesLaminated${index}`}
                                            name="bothSidesLaminated"
                                            value={formData.bothSidesLaminated !== '' ? formData.bothSidesLaminated : order.bothSidesLaminated}
                                            onChange={(event) => { handleChange(event, index)}}
                                            disabled={doorName === 'Двустранно грундиран МДФ' || doorName === 'Фурнирован МДФ'}
                                        >
                                            <option value="false">Едностранно ламиниране</option>
                                            <option value="true">Двустранно ламиниране</option>
                                        </Select>





                                    </div>


                                </form>
                                {/* <div className='grid md:grid-cols-4'>
                                    <div className='grid md:grid-rows-2 text-center border'><div>Вратичка на кв.м.</div><div className=''> <b>{groupSqrt[index]} кв.м/ {groupPrices[index]}лв. с ДДС</b></div> </div>
                                    <div className='grid md:grid-rows-2 text-center border'><div>Дръжка, бр.</div><div className=''> <b>{orderData.handleName !== "Без Дръжка"
                                        ? `1бр. / ${handlePrice}лв.`
                                        : "0бр./ 0лв."} </b></div> </div>

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

                                </div> */}
                            </div>

                        </div>
                        
                    ))))}
                </div></div ></>)
}

export default EditOrder;