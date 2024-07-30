import React, { useState, useEffect } from 'react';
import PageTitle from "../components/Typography/PageTitle";
import "../assets/css/groups-in-rows.css"
import AuthContext, { useAuth } from '../components/context/AuthContext';
import ConfirmationModal from '../components/ConfirmationModal';
import { citiesInBulgaria } from '../cities/citiesData';
import { config } from '../Constants';
import {
    Select, Input, Label, HelperText, Button, Modal,
    ModalHeader,
    ModalBody,
    ModalFooter, Textarea
} from "@windmill/react-ui";
import { Link } from 'react-router-dom'
import FolioOptions from '../components/FolioOptions';
import modelOptions from '../components/modelOptions';





const NewOrderForm = () => {
    const { userLogout } = useAuth()
    const logout = () => {
        userLogout()
    }

    const loggedUser = JSON.parse(localStorage.getItem("user"))
    const apiBaseUrl = config.url.API_BASE_URL;

    const initialFormState = {
        doorName: '',
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

    const [totalPrice, setTotalPrice] = useState('0лв.');
    const [groupPrices, setGroupPrices] = useState('0');
    const [totalGroupPrices, setTotalGroupPrices] = useState('0');
    const [groupSqrt, setGroupSqrt] = useState('0');
    const [totalSqrt, setTotalSqrt] = useState('0');
    const [modalOpen, setModalOpen] = useState(false);
    const [errorModalOpen, setErrorModalOpen] = useState(false);
    const [orderUrl, setOrderUrl] = useState();
    const [orderPreflightUrl, setOrderPreflightUrl] = useState();
    const [handlePrice, setHandlePrice] = useState(0);
    const [handleNumber, setHandleNumber] = useState(0);
    const [data, setData] = useState([]);
    const [submitButtonDisabled, setSubmitButtonDisabled] = useState(true)
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [deliveryAddress, setDeliveryAddress] = useState('');
    const [discount, setDiscount] = useState(0);
    const [note, setNote] = useState('');
    const [city, setCity] = useState('');
    const [isTextareaVisible, setTextareaVisible] = useState(false);
    const [groupButtonVisibility, setGroupButtonVisibility] = useState([true]);
    const [createdOrderId, setCreatedOrderId] = useState(0)
    const [orderUuid, setOrederUuid] = useState('');
    const [createdOrderModalOpen, isCreatedOrderModalOpen] = useState(false);
    const [elementNumber, setElementNumber] = useState(0);
    const [selectedDoor, setSelectedDoor] = useState('');
    const [selectedMaterialType, setSelectedMaterialType] = useState('');
    const [groupForms, setGroupForms] = useState([
        { ...initialFormState }
    ]);




    useEffect(() => {
        setOrderPreflightUrl(apiBaseUrl + '/api/orders/new-order/preflight');
        setOrderUrl(apiBaseUrl + '/api/orders/new-order');
    }, []);





    function closeModal() {
        setIsModalOpen(false);
        // window.location.reload();
    }
    function closeCreatedorderModal() {
        isCreatedOrderModalOpen(false);
        window.location.reload();
    }



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

    const handleMaterialChange = (event, index) => {
        const updatedGroupForms = groupForms.map((formData, i) => {
            if (i === index) {
                return { ...formData, detailType: { material: event.target.value } };
            }
            return formData;
        });
        setGroupForms(updatedGroupForms);
    };

    useEffect(() => {
        handlePreflight();
    }, [groupForms]);

    const handleTypeChange = (event, index) => {
        const updatedGroupForms = groupForms.map((formData, i) => {
            if (i === index) {

                return {

                    ...formData,
                    detailType: {
                        ...formData.detailType, // Keep the existing material
                        type: event.target.value,
                    },
                };
            }
            return formData;
        });
        setGroupForms(updatedGroupForms);
    };





    const handleDeleteGroup = (indexToDelete) => {
        setGroupForms((prevGroupForms) =>
            prevGroupForms.filter((_, index) => index !== indexToDelete)
        );
    };

    const handleSubmit = () => {
        const groupsArray = groupForms.map((formData) => ({
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
            height: parseInt(formData.height),
            width: parseInt(formData.width),
            length: parseInt(formData.length),
            number: parseInt(formData.number),
            bothSidesLaminated: formData.bothSidesLaminated,
            detailType: {
                material: formData.detailType.material,
                type: formData.detailType.type
            }
        }
        ));
        const token = localStorage.getItem('accessToken')
        // Send the data to the backend using AJAX
        fetch(orderUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                groups: groupsArray,
                deliveryAddress: `${city} , ${deliveryAddress}`,
                discount: discount,
                note: note
            }),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                setCreatedOrderId(data.createdOrderId);
                setOrederUuid(data.orderUuid)
                // Get the groupTotalPrice for every group in the response
                const groupPrices = data.groups.map((group) => group.groupTotalPrice);
                const groupSqrt = data.groups.map((group) => {
                    console.log("Height:", group.height);
                    console.log("Width:", group.width);
                    console.log("Number:", group.number);

                    const result = (group.height * group.width) * group.number;
                    console.log("Result:", result);

                    return result;
                });
                // Set the total price as the sum of all groupTotalPrices
                const totalPrice = data.totalPrice;

                // Render the response data
                setTotalPrice(`${totalPrice}лв. с ДДС`);
                setGroupPrices(groupPrices);
                setGroupSqrt(groupSqrt);
                console.log(groupSqrt)
                isCreatedOrderModalOpen(true);
            })
            .catch((error) => {
                setTotalPrice('Error: ' + error.message);
            });
    };



    const handlePreflight = () => {
        // Create an array of groups from the groupForms state
        const groupsArray = groupForms.map((formData) => ({
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
                deliveryAddress: `${city},${deliveryAddress}`,
                discount: discount,
                note: note
            }),
        })
            .then((response) => response.json())
            .then((data) => {
                setData(data);
                if (data.type === 'BY_USER') {
                    setDeliveryAddress(data.deliveryAddress);
                }
                console.log(loggedUser.data.role);
                console.log(data);
                console.log(data.deliveryAddress)
                let totalSqrt = 0;
                let totalGroupPrices = 0;
                // Get the groupTotalPrice for every group in the response
                const groupPrices = data.groups.map((group) => {
                    const result = group.groupTotalPrice;
                    totalGroupPrices += result;
                    setTotalGroupPrices(totalGroupPrices.toFixed(2))


                    return result;
                });

                setElementNumber(data.totalElements);

                const groupSqrt = data.groups.map((group) => {
                    const result = ((group.height / 1000) * (group.width / 1000)) * group.number;
                    totalSqrt += result;
                    setTotalSqrt(totalSqrt.toFixed(2))


                    return result.toFixed(2);
                });
                setSelectedDoor(data.doorName)
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
                setHandlePrice(data.handlePrice);
                setGroupPrices(groupPrices);
                setGroupSqrt(groupSqrt);
                console.log(groupSqrt)
                // Set the total price as the sum of all groupTotalPrices

                // Render the response data
                const isButtonDisabled = groupForms.some((formData) => (
                    ((formData.detailType.material !== 'Чекмедже' && !(formData.modelName === 'A100' || formData.modelName === 'B503' || formData.modelName === 'B505' || formData.modelName === 'B810' || formData.modelName === 'A811' || formData.modelName === 'Без модел А100') && (formData.width < 200)) && (formData.detailType.material === 'Пиластър' && formData.width < 40)) ||
                    (formData.width > 1160) || (formData.doorName === '') ||
                    (formData.detailType.material === 'Пиластър' && formData.width > 300) ||
                    (formData.detailType.material === 'Чекмедже' && formData.width < 60) ||
                    (formData.detailType.material === 'Чекмедже' && formData.height < 60) ||
                    (formData.detailType.material !== 'Чекмедже' && !(formData.modelName === 'Без модел A100' || formData.modelName === 'B503' || formData.modelName === 'B505' || formData.modelName === 'B810' || formData.modelName === 'A811') && (formData.height < 200)) ||
                    (formData.height > 2400) ||
                    ((formData.modelName === 'Без модел A100' || formData.modelName === 'B503' || formData.modelName === 'B505' || formData.modelName === 'B810' || formData.modelName === 'A811') && (formData.height < 60)) || (formData.detailType.material !== "" && formData.detailType.type === "") || (formData.detailType.material !== "Вратичка") && (formData.detailType.type !== "P1" && formData.detailType.type !== "P2" && formData.detailType.type !== "P3") &&
                    (formData.detailType.type !== "Обща фрезовка" && formData.detailType.type !== "Изчистен детайл" && formData.detailType.type !== "Корекция на рамка") &&
                    (formData.detailType.type !== "К1 – 68мм височина" && formData.detailType.type !== "К2 – 70мм височина" && formData.detailType.type !== "К3 – 80мм височина")

                ));
                setSubmitButtonDisabled(isButtonDisabled)



            })

            .catch((error) => {
                console.log('Error: ' + error.message);
            });


    }
    const handleAddGroup = (event, index) => {
        setGroupButtonVisibility((prevVisibility) => [...prevVisibility, true]);
        handlePreflight();
        const lastGroupForm = groupForms[groupForms.length - 1];
        setGroupForms((prevGroupForms) => [
            ...prevGroupForms,
            {
                doorName: lastGroupForm.doorName,
                modelName: lastGroupForm.modelName,
                folioName: lastGroupForm.folioName,
                handleName: lastGroupForm.handleName,
                profilName: lastGroupForm.profilName,
                height: 0,
                width: 0,
                length: 0,
                number: 1,
                bothSidesLaminated: lastGroupForm.bothSidesLaminated,
                detailType: {
                    material: lastGroupForm.detailType.material,
                    type: lastGroupForm.detailType.type,
                },
            },
        ]);
    };

    



    return (


        <>
         
            <div className="">
                <div className="grid md:grid-cols-1 gap-10 justify-center">
                    <div className="text-center "><PageTitle >Създаване на нова поръчка</PageTitle></div>
                    {groupForms.map((formData, index) => (

                        <>
                            <Modal isOpen={createdOrderModalOpen}>
                                <ModalHeader className="flex items-center">
                                    Вашата поръчка е създадена!
                                </ModalHeader>
                                <ModalBody>
                                    Създадена е поръчка с номер {orderUuid}.
                                </ModalBody>
                                <ModalFooter className="flex items-right">
                                    <div className="hidden sm:block">
                                        <Button  >
                                            <Link
                                                to={`orders/${createdOrderId}`}
                                            >
                                                Преглед</Link>
                                        </Button>
                                    </div>
                                    <div className="hidden sm:block">
                                        <Button >
                                            <Link
                                                to={`orders`}
                                            >
                                                Виж всички</Link>
                                        </Button>
                                    </div>
                                    <div className="hidden sm:block ">
                                        <Button layout="outline" onClick={() => { closeCreatedorderModal() }}>
                                            Създаване на нова
                                        </Button>
                                    </div>

                                </ModalFooter>
                            </Modal><><Modal isOpen={isModalOpen} onClose={closeModal}>
                                <ModalHeader className="grid items-center">
                                    Допълнителна информация
                                </ModalHeader>
                                <ModalBody>
                                    <hr className="customeDivider " />
                                    <div className='mb-5 mt-5'>
                                        {/* Number */}
                                        <Label htmlFor="note" className="font-medium "><span>Забележка:</span></Label>
                                        <Textarea
                                            className="mt-1 border w-full"
                                            type="text"
                                            id={`note${index}`}
                                            name="note"
                                            value={note}
                                            onChange={(event) => { setNote(event.target.value); }}
                                            required />
                                    </div>
                                    <hr className="customeDivider " />
                                    {loggedUser.data.role === '[USER]' && (
                                        <>
                                            <div className='mb-5 mt-5'>
                                                <Label htmlFor="deliveryAddress" className="font-large mt-3 mb-3"><span>Адрес за доставка:</span></Label>
                                                <Label htmlFor="city" className="font-medium mt-3 mb-3"><span>Град:</span></Label>

                                                <Select
                                                    name="city"
                                                    className={`mt-1 border w-full`} // Toggle hidden class
                                                    id="city"
                                                    value={city}
                                                    onChange={(event) => { setCity(event.target.value); }}
                                                    required
                                                ><option key={city} value="">
                                                        --Изберете Град--
                                                    </option>
                                                    {citiesInBulgaria.map((city) => (
                                                        <><option key={city} value={city}>
                                                            {city}
                                                        </option></>
                                                    ))}

                                                </Select>

                                                <Label htmlFor="deliveryAddress" className="font-medium mt-3 mb-3"><span>Адрес:</span></Label>
                                                <div className={`mt-1 w-full ${isTextareaVisible ? 'hidden' : ''}`}>
                                                    <Select
                                                        value={deliveryAddress}
                                                        onChange={(event) => { setDeliveryAddress(event.target.value); }}>
                                                        <option key={deliveryAddress} value={deliveryAddress}>
                                                            {data.deliveryAddress}
                                                        </option>
                                                    </Select>
                                                </div>
                                                <div className="mb-5 mt-5">
                                                    <Label htmlFor="toggleTextarea" className="font-medium mt-3 mb-3">
                                                        <Input
                                                            type="checkbox"
                                                            id={`toggleTextarea${index}`}
                                                            name="toggleTextarea"
                                                            checked={isTextareaVisible}
                                                            onChange={() => setTextareaVisible(!isTextareaVisible)} /><span className='ml-3'>Въведете друг адрес за доставка:</span>
                                                    </Label>

                                                </div>
                                                <div className={`mt-1 w-full ${!isTextareaVisible ? 'hidden' : ''}`}> {/* Toggle hidden class */}
                                                    <Textarea
                                                        className="mt-1 w-full"
                                                        type="text"
                                                        id="deliveryAddress"
                                                        name="deliveryAddress"
                                                        value={deliveryAddress}
                                                        onChange={(event) => { setDeliveryAddress(event.target); }}
                                                        required />
                                                </div>
                                            </div>


                                        </>
                                    )}

                                    {loggedUser.data.role === '[ADMIN]' && (
                                        <>
                                            <div className='mb-5 mt-5'>
                                                <Label htmlFor="deliveryAddress" className="font-large mt-3 mb-3"><span>Адрес за доставка:</span></Label>
                                                <Label htmlFor="city" className="font-medium mt-3 mb-3"><span>Град:</span></Label>

                                                <Select
                                                    name="city"
                                                    className="mt-1 border w-full "
                                                    type="text"
                                                    id="city"
                                                    value={city}
                                                    onChange={(event) => { handleChange(event, index); setCity(event.target.value); }}
                                                    required
                                                >
                                                    {citiesInBulgaria.map((city) => (
                                                        <option key={city} value={city}>
                                                            {city}
                                                        </option>
                                                    ))}
                                                </Select>

                                                <Label htmlFor="deliveryAddress" className="font-medium mt-3 mb-3"><span>Адрес:</span></Label>
                                                <Textarea
                                                    className="mt-1 w-full"
                                                    type="text"
                                                    id={`deliveryAddress${index}`}
                                                    name="deliveryAddress"
                                                    value={deliveryAddress}
                                                    onChange={(event) => { handleChange(event, index); setDeliveryAddress(event.target.value); }}
                                                    required />
                                            </div>
                                            <hr className="customeDivider " />
                                            <div className='mt-5'>
                                                {/* Number */}
                                                <Label htmlFor="discount" className="font-medium"><span>Отстъпка:</span></Label>
                                                <Input
                                                    className="mt-1 border w-full"
                                                    type="number"
                                                    id="discount"
                                                    name="discount"
                                                    value={discount}
                                                    onChange={(event) => { setDiscount(event.target.value) }}
                                                    required />%
                                            </div>
                                        </>
                                    )}
                                </ModalBody>
                                <ModalFooter>
                                    <div className="hidden sm:block">
                                        <Button onClick={(event) => { handleChange(event, index); setIsModalOpen(false); setModalOpen(true); }}>
                                            Продължи
                                        </Button>
                                    </div>
                                    <div className="hidden sm:block">
                                        <Button layout="outline" onClick={closeModal}>

                                            Отказ
                                        </Button>
                                    </div>
                                </ModalFooter>
                            </Modal><div className=''>
                                    <div>
                                        <div></div>
                                    </div>
                                    <div key={index} className=" ">
                                        <div className=''>

                                            <form

                                                id={`orderForm${index}`}
                                                className="grid grid-cols-4 gap-4 p-5 w-full h-1/4"
                                            >

                                                <div>
                                                    <Label htmlFor="doorName" className="block font-medium">Материал:</Label>
                                                    <Select className="mt-1 w-full p-2 border rounded-md shadow-sm"
                                                        id="doorName"
                                                        name="doorName"
                                                        value={formData.doorName}
                                                        onChange={(event) => handleChange(event, index)}
                                                        disabled={index > 0}
                                                        required

                                                    >
                                                        <option value="">-Изберете Материал-</option>
                                                        <option value="Мембранна вратичка">Мембранна вратичка</option>
                                                        <option value="Двустранно грундиран МДФ">Двустранно грундиран МДФ</option>
                                                        <option value="Фурнирован МДФ">Фурнирован МДФ</option>
                                                    </Select>

                                                    {formData.doorName === "" && (<HelperText valid={false}>Моля изберете материал, за да продължите с поръчката!</HelperText>)}
                                                </div>

                                                <div>
                                                    <Label htmlFor={`materialName${index}`} className="block font-medium">Вид:</Label>
                                                    <Select className="mt-1 w-full p-2 border rounded-md shadow-sm"
                                                        id={`materialName${index}`}
                                                        name={`materialName${index}`}
                                                        value={formData.detailType.material}
                                                        onChange={(event) => handleMaterialChange(event, index)}
                                                        required
                                                        disabled={(formData.doorName === '')}

                                                    >
                                                        <option disabled value="">-Изберете Вид-</option>
                                                        <option value="Вратичка">Вратичка</option>
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
                                                                value={formData.detailType.type}
                                                                onChange={(event) => handleTypeChange(event, index)}
                                                                required
                                                            >
                                                                <option value="">-Изберете Пиластър-</option>
                                                                <option value="P1">P1</option>
                                                                <option value="P2">P2</option>
                                                                <option value="P3">P3</option>
                                                            </Select>
                                                            {(formData.detailType.type !== "P1" && formData.detailType.type !== "P2" && formData.detailType.type !== "P3") && (<HelperText valid={false}>Моля изберете пиластър, за да продължите с поръчката!</HelperText>)}

                                                        </div>
                                                    )}
                                                    {formData.detailType.material === 'Чекмедже' && (
                                                        <><div>
                                                            <Select
                                                                className="mt-1 w-full p-2 border rounded-md shadow-sm"
                                                                id={`typeName${index}`}
                                                                name={`typeName${index}`}
                                                                value={formData.detailType.type}
                                                                onChange={(event) => handleTypeChange(event, index)}
                                                                required
                                                                disabled={formData.doorName === ''}
                                                            >
                                                                <option disabled selected value="">----------</option>
                                                                <option value="Обща фрезовка">Обща фрезовка</option>
                                                                <option value="Изчистен детайл">Изчистен детайл</option>
                                                                <option value="Корекция на рамка">Корекция на рамка</option>
                                                            </Select>
                                                            {(formData.detailType.type !== "Обща фрезовка" && formData.detailType.type !== "Изчистен детайл" && formData.detailType.type !== "Корекция на рамка") && (<HelperText valid={false}>Моля изберете Чекмедже, за да продължите с поръчката!</HelperText>)}

                                                        </div></>
                                                    )}
                                                    {formData.detailType.material === 'Корниз' && (
                                                        <><div>
                                                            <Label htmlFor={`typeName${index}`}>Корниз:</Label>
                                                            <Select
                                                                className="mt-1 w-full p-2 border rounded-md shadow-sm"
                                                                id={`typeName${index}`}
                                                                name={`typeName${index}`}
                                                                value={formData.detailType.type}
                                                                onChange={(event) => handleTypeChange(event, index)}
                                                                required
                                                                disabled={formData.doorName === ''}
                                                            >
                                                                <option value="">-Изберете Корниз-</option>
                                                                <option value="К1 – 68мм височина">К1 – 68мм височина</option>
                                                                <option value="К2 – 70мм височина">К2 – 70мм височина</option>
                                                                <option value="К3 – 80мм височина">К3 – 80мм височина</option>
                                                                {/* Add more options here */}
                                                            </Select>
                                                            {(formData.detailType.type !== "К1 – 68мм височина" && formData.detailType.type !== "К2 – 70мм височина" && formData.detailType.type !== "К3 – 80мм височина") && (<HelperText valid={false}>Моля изберете Корниз, за да продължите с поръчката!</HelperText>)}

                                                        </div></>
                                                    )}

                                                </div>


                                                {/* Model Name */}
                                                <div>
                                                    <Label htmlFor="modelName" className="block font-medium">Модел:</Label>
                                                    <Select className="mt-1 w-full p-2 border rounded-md shadow-sm"
                                                        id="modelName"
                                                        name="modelName"
                                                        value={formData.modelName}
                                                        onChange={(event) => handleChange(event, index)}
                                                        disabled={(formData.doorName === '' || formData.detailType.material === "Пиластър" || formData.detailType.material === "Корниз")}
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
                                                        value={formData.folioName}
                                                        onChange={(event) => handleChange(event, index)}
                                                        disabled={formData.modelName === '' || formData.doorName === 'Двустранно грундиран МДФ' || formData.doorName === 'Фурнирован МДФ'}
                                                        required
                                                    >
                                                        <option value="" selected="selected">-Изберете Фолио-</option>
                                                        {FolioOptions.map((option, index) => (
                                                            <option key={index} value={option}>
                                                                {option}
                                                            </option>
                                                        ))}   </Select>
                                                </div><div>
                                                    {/* Handle Name */}
                                                    <Label htmlFor="handleName" className="block font-medium">Дръжка</Label>
                                                    <Select className="mt-1 w-full p-2 border rounded-md shadow-sm"
                                                        type="text"
                                                        id="handleName"
                                                        name="handleName"
                                                        value={formData.handleName}
                                                        onChange={(event) => handleChange(event, index)}
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
                                                        value={formData.profilName}
                                                        onChange={(event) => handleChange(event, index)}
                                                        required
                                                        disabled={formData.modelName === '' || formData.doorName === 'Фурнирован МДФ' || formData.detailType.material === 'Корниз'}
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
                                                                value={formData.length}
                                                                onChange={(event) => handleChange(event, index)}
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
                                                                value={formData.height}
                                                                onChange={(event) => handleChange(event, index)}
                                                                required />
                                                            {formData.detailType.material !== 'Чекмедже' && !(formData.modelName === 'Без модел A100' || formData.modelName === 'B503' || formData.modelName === 'B505' || formData.modelName === 'B810' || formData.modelName === 'A811') && (formData.height < 200) && (
                                                                <HelperText valid={false}>Минималният допустим размер е 200мм</HelperText>)}
                                                            {formData.height > 2400 && (
                                                                <HelperText valid={false}>Максималният допустим размер е 2400мм</HelperText>)}
                                                            {(formData.modelName === 'Без модел A100' || formData.modelName === 'B503' || formData.modelName === 'B505' || formData.modelName === 'B810' || formData.modelName === 'A811') && (formData.height < 60) && (
                                                                <HelperText valid={false}>Минималният допустим размер е 60мм</HelperText>)}
                                                            {formData.detailType.material === 'Чекмедже' && formData.height < 60 && (
                                                                <HelperText valid={false}>Минималният допустим размер е 60мм</HelperText>
                                                            )}

                                                        </div>
                                                        {formData.detailType.material === 'Пиластър' && (
                                                            <div>
                                                                <Label htmlFor="width" className="block font-medium">Широчина, мм:</Label>
                                                                <Select
                                                                    className="mt-1 w-full p-2 border rounded-md shadow-sm"
                                                                    id='width'
                                                                    name='width'
                                                                    value={formData.width}
                                                                    onChange={(event) => handleChange(event, index)}
                                                                    required
                                                                >   <option
                                                                    selected value="0">--Изберете Широчина--</option>
                                                                    <option value="50">50</option>
                                                                    <option value="60">60</option>
                                                                    <option value="70">70</option>
                                                                    <option value="80">80</option>
                                                                    <option value="90">90</option>
                                                                    <option value="100">100</option>
                                                                    <option value="110">110</option>
                                                                </Select>
                                                                {(formData.detailType.material !== 'Чекмедже' && !(formData.modelName === 'Без модел A100' || formData.modelName === 'B503' || formData.modelName === 'B505' || formData.modelName === 'B810' || formData.modelName === 'A811') && (formData.width < 200)) || (formData.detailType.material === 'Пиластър' && formData.width < 40) && (
                                                                    <HelperText valid={false}>Минималният допустим размер е 200мм</HelperText>)}
                                                                {formData.width > 1160 && (
                                                                    <HelperText valid={false}>Максималният допустим размер е 1160мм</HelperText>)}
                                                                {(formData.modelName === 'Без модел A100' || formData.modelName === 'B503' || formData.modelName === 'B505' || formData.modelName === 'B810' || formData.modelName === 'A811') && (formData.width < 60) && (
                                                                    <HelperText valid={false}>Минималният допустим размер е  60мм</HelperText>)}
                                                                {formData.detailType.material === 'Чекмедже' && formData.width < 60 && (
                                                                    <HelperText valid={false}>Минималният допустим размер е  60мм</HelperText>
                                                                )}
                                                                {formData.detailType.material === 'Пиластър' && formData.width < 40 && (
                                                                    <HelperText valid={false}>Минималният допустим размер е 50мм</HelperText>
                                                                )}
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
                                                                <HelperText valid={false}>Минималният допустим размер е  200мм</HelperText>)}
                                                            {formData.height > 2400 && (
                                                                <HelperText valid={false}>Максималният допустим размер е  2400мм</HelperText>)}
                                                            {(formData.modelName === 'Без модел A100' || formData.modelName === 'B503' || formData.modelName === 'B505' || formData.modelName === 'B810' || formData.modelName === 'A811') && (formData.height < 60) && (
                                                                <HelperText valid={false}>Минималният допустим размер е  60мм</HelperText>)}
                                                            {formData.detailType.material === 'Чекмедже' && formData.height < 60 && (
                                                                <HelperText valid={false}>Минималният допустим размер е  60мм</HelperText>
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
                                                                onChange={(event) => handleChange(event, index)}
                                                                required />
                                                            {formData.detailType.material !== 'Чекмедже' && !(formData.modelName === 'Без модел A100' || formData.modelName === 'B503' || formData.modelName === 'B505' || formData.modelName === 'B810' || formData.modelName === 'A811') && (formData.width < 200) && (
                                                                <HelperText valid={false}>Минималният допустим размер е 200мм</HelperText>)}
                                                            {formData.width > 1160 && (
                                                                <HelperText valid={false}>Максималният допустим размер е  1160мм</HelperText>)}
                                                            {(formData.modelName === 'Без модел A100' || formData.modelName === 'B503' || formData.modelName === 'B505' || formData.modelName === 'B810' || formData.modelName === 'A811') && (formData.width < 60) && (
                                                                <HelperText valid={false}>Минималният допустим размер е 60мм</HelperText>)}
                                                            {formData.detailType.material === 'Чекмедже' && formData.width < 60 && (
                                                                <HelperText valid={false}>Минималният допустим размер е 60мм</HelperText>
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
                                                        onChange={(event) => handleChange(event, index)}
                                                        required />
                                                </div>
                                                <div className=''>
                                                    <Label>Ламиниране:</Label>
                                                    <Select className="mt-1 w-full p-2 border rounded-md shadow-sm"
                                                        type="boolean"
                                                        id={`bothSidesLaminated${index}`}
                                                        name="bothSidesLaminated"
                                                        value={formData.detailType.material === 'Пиластър' || formData.detailType.material === 'Корниз' ? false : formData.bothSidesLaminated}
                                                        onChange={(event) => handleChange(event, index)}
                                                        disabled={formData.doorName === 'Двустранно грундиран МДФ' || formData.doorName === 'Фурнирован МДФ' || formData.detailType.material === 'Пиластър' || formData.detailType.material === 'Корниз'}
                                                    >
                                                        <option value="false">Едностранно ламиниране</option>
                                                        <option value="true">Двустранно ламиниране</option>
                                                    </Select>
                                                </div>
                                                <div><div className='text-center border-l border-r border-black'><PageTitle >Група № {index + 1}</PageTitle>
                                                </div></div>
                                                <div className='mt-5'>
                                                    <div className=''>
                                                        {groupButtonVisibility[index] && (
                                                            <Button
                                                                onClick={(event, index) => handleAddGroup(event, index)}
                                                                className="text-center w-10 h-10 bg-green-400 hover:bg-green-600 rounded-md"
                                                                disabled={(submitButtonDisabled)}
                                                                layout="outline"
                                                            >
                                                                +
                                                            </Button>
                                                        )}




                                                        {index > 0 && (

                                                            <Button
                                                                onClick={(event) => handleDeleteGroup(index)}
                                                                className="border w-10 h-10 ml-5 bg-red-500 hover:bg-red-800 rounded-md

                                                                "
                                                                type="button"
                                                                layout="outline"
                                                            >
                                                                -
                                                            </Button>
                                                        )}</div>

                                                </div>
                                            </form>
                                            <div className='grid md:grid-cols-4 h-100 pb-5 border p-3'>
                                                <div className='grid md:grid-rows-2 text-center border'><div>Вратичка на кв.м.</div><div className=''> <b>{groupSqrt[index]} кв.м/ {groupPrices[index]}лв. с ДДС</b></div> </div>
                                                <div className='grid md:grid-rows-2 text-center border'><div>Дръжка, бр.</div><div className=''> <b>{formData.handleName !== "Без Дръжка"
                                                    ? `1бр. / ${handlePrice}лв.`
                                                    : "0бр./ 0лв."} </b></div> </div>

                                                <div className="grid md:grid-rows-2 text-center border">
                                                    <div>
                                                        {formData.bothSidesLaminated === "false"
                                                            ? "Едностранно ламиниране"
                                                            : "Двустранно ламиниране"}
                                                    </div>
                                                    <div>{selectedDoor === "Двустранно грундиран МДФ" || selectedDoor === "Фурнирован МДФ" ? (<HelperText valid={false}>Не се предлага за този материал</HelperText>) : (

                                                        <div className="">
                                                            <b>{groupSqrt[index]} кв.м</b>
                                                        </div>)
                                                    }</div>

                                                </div>
                                                <div className='border grid md:grid-rows-2 text-center'><div>Цена на групата :</div> <div> <b>{groupPrices[index]}лв. с ДДС</b></div></div>
                                            </div>
                                        </div>
                                    </div>
                                </div></></>
                    ))}


                </div> <div className="col-span-12 text-center  ">

                    <div className="grid md:grid-cols-1 border-t border-black p-5">
                        <div className='grid md:grid-cols-5'>
                            <div className='grid md:grid-rows-2 text-center border'><div>Общо кв.м. вратички</div><div className=''> <b>{totalSqrt} кв.м/ {totalGroupPrices}лв. с ДДС</b></div> </div>
                            <div className='grid md:grid-rows-2 text-center border'><div>Общо бр. детайли</div><div className=''> <b>{elementNumber}</b></div> </div>

                            <div className='grid md:grid-rows-2 text-center border'><div>Общо бр. дръжки.</div><div className=''><b> {handleNumber} бр./ {handlePrice}лв.</b>
                            </div> </div>

                            <div className="grid md:grid-rows-2 text-center border">Общо ламиниране

                                <div>{selectedDoor === "Двустранно грундиран МДФ" || selectedDoor === "Фурнирован МДФ" ? (<HelperText valid={false}>Не се предлага за този материал</HelperText>) : (

                                    <div className="">
                                        <b>{totalSqrt} кв.м</b>
                                    </div>)
                                }</div>
                            </div>
                            <div className='border grid md:grid-rows-2 text-center'><div>Обща цена :</div> <div> <b>{totalPrice}</b></div></div>

                        </div>


                        <div className='grid md:grid-cols-2 '>
                            <div className=''>
                                <Button
                                    className="w-1/3 text-black bg-green-400 rounded-md shadow-md hover:bg-green-700"
                                    onClick={(event, index) => handleAddGroup(event, index + 1)}

                                    disabled={(submitButtonDisabled)}
                                    layout="outline"
                                >
                                    Добави Детайл
                                </Button></div>
                            <div className=''>
                                <Button
                                    type="button"

                                    className="w-1/3  text-white bg-indigo-600 rounded-md shadow-md hover:bg-indigo-700"
                                    disabled={(submitButtonDisabled)}
                                    onClick={() => setIsModalOpen(true)}
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

                        {loggedUser.data.role === '[USER]' && data.appliedDiscount === null && (<div className='text-center'><HelperText className='text-lg text-green-600'> <b><u>Добавена е отстъпка от 5% </u></b></HelperText></div>)}
                        {loggedUser.data.role === '[USER]' && data.appliedDiscount != null && (<div className='text-center'><HelperText className='text-lg text-green-600'> <b><u>Добавена е отстъпка от {data.appliedDiscount}% </u></b></HelperText></div>)}
                    </div>

                    <hr className="customeDivider mx-4 my-5" />

                </div></div ></>)
}
export default NewOrderForm;