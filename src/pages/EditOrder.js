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
import { Link } from 'react-router-dom';
import ThemedSuspense from "../components/ThemedSuspense";







const EditOrder = ({ match }) => {
    const apiBaseUrl = config.url.API_BASE_URL;
    const [mainDropdownValue, setMainDropdownValue] = useState();
    const [note, setNote] = useState('');
    const [errorModalOpen, setErrorModalOpen] = useState(false);
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
    const [orderPreflightUrl, setOrderPreflightUrl] = useState(apiBaseUrl + '/api/orders/new-order/preflight');
    const [orderUrl, setOrderUrl] = useState();
    const [isDataLoadModalOpen, setIsDataLoadModalOpen] = useState(false);
    const [elementNumber, setElementNumber] = useState(0);
    const [groupButtonVisibility, setGroupButtonVisibility] = useState([true]);
    const [selectedDoor, setSelectedDoor] = useState('');
    const [successfulEditModalOpen, setSuccessfulEditModalOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(true);



    const [handleNumber, setHandleNumber] = useState(0);
    const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false)
    const [orderData, setOrderData] = useState({
    });
    const [doorName, setDoorName] = useState('')
    const [handlePrice, setHandlePrice] = useState(0);
    const [data, setData] = useState('')
    const [width, setWidth] = useState('')


    const [groupForms, setGroupForms] = useState([
    ]);
    const [preflightGroupForms, setPreflightGroupForms] = useState([
    ]);

    useEffect(() => {
        setOrderPreflightUrl(apiBaseUrl + '/api/orders/new-order/preflight');
        setOrderUrl(apiBaseUrl + `/api/orders/${orderId}`);
    }, []);

    useEffect(() => {
        handlePreflight();
    }, [groupForms]);

    const handlePreflight = async () => {
        try {
            const groupsArray = groupForms.map((formData) => ({
                door: {
                    name: mainDropdownValue,
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

            const token = localStorage.getItem('accessToken');

            const response = await fetch(orderPreflightUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    groups: groupsArray,
                }),
            });

            if (!response.ok) {
                throw new Error('Нещо се обърка! Статус на грешката :' + response.status);
            }

            const data = await response.json();
            setElementNumber(data.totalElements);
            setSelectedDoor(data.doorName)

            let totalSqrt = 0;
            let totalGroupPrices = 0;

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
            data.groups.forEach((group) => {
                if (group.handle.name !== 'Без Дръжка') {
                    handleNumber += 1;
                    setHandleNumber(handleNumber);
                }
            });

            const totalPrice = data.totalPrice;

            setTotalPrice(`${totalPrice}лв. с ДДС`);
            setGroupPrices(groupPrices);
            setGroupSqrt(groupSqrt);

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

            setSubmitButtonDisabled(isButtonDisabled);
        } catch (error) {
            console.log('Error: ' + error.message);
        }
    };


    useEffect(() => {
        const fetchOrder = async () => {

            try {
                await handlePreflight();

                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                };
                const response = await axios.get(apiBaseUrl + `/api/orders/${orderId}`, config);
                const orderData = response.data;
                setOrderData(orderData);
                setHandlePrice(orderData.handlePrice);
                setTotalPrice(orderData.totalPrice + ' лв. с ДДС')
                setMainDropdownValue(orderData.groups[0].door.name);
                setNote(orderData.note)
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
                    note: note
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
                const groupPrices = orderData.groups.map((group) => {
                    setDoorName(group.door.name)
                    setWidth(group.width)
                    const result = group.groupTotalPrice;
                    totalGroupPrices += result;
                    setTotalGroupPrices(totalGroupPrices.toFixed(2))
                    return result;
                });

                setGroupPrices(groupPrices)
                setIsLoading(false);


            } catch (error) {
                console.error('Error fetching order:', error);
            }
        };
        fetchOrder();
        openModal()



    }, [orderId]);


    useEffect(() => {
        handlePreflight();
    }, [groupForms]);

    function openModal() {
        setIsDataLoadModalOpen(false)        // window.location.reload();
    }
    const handleMainDropdownChange = (event) => {

        const selectedValue = event.target.value;
        setMainDropdownValue(selectedValue);
        const updatedGroupForms = groupForms.map((formData) => ({
            ...formData,
            door: {
                name: selectedValue
            },
        }));
        setGroupForms(updatedGroupForms);
    };

    const handleNote = (event) => {

        const selectedValue = event.target.value;
        setNote(selectedValue);

    };
    const handleSubmit = () => {
        try {
            const token = localStorage.getItem('accessToken');
            const updatedGroups = groupForms.map((formData) => ({
                door: {
                    name: mainDropdownValue,
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
            fetch(apiBaseUrl + '/api/orders/edit-order/' + orderId, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    groups: updatedGroups,
                    note: note
                }
                ),
            }).then(response => {
                setIsLoading(true)
                if (response.ok) {
                    setIsLoading(false)
                    setSuccessfulEditModalOpen(true)
                }
                
            }).catch(error => {
                setIsLoading(false)
                setErrorModalOpen(true);
            console.log("Greshka:" + error)})
           

        } catch (error) {

            console.error("329" + error)
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
        setGroupForms(updatedGroupForms);
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
    function closeModal() {
        setIsDataLoadModalOpen(false);
        setModalOpen(false);
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



    const handleAddGroup = (event) => {
        setGroupButtonVisibility((prevVisibility) => [...prevVisibility, true]);
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




    if (isLoading) {
        return <><ThemedSuspense /></>;
    }

    return (
        <>
            <div className="grid gap-2 mb-12 md:grid-cols-2">
                <div className="col-span-12 text-center sticky-top ">
                    <PageTitle>Редактиране на поръчка</PageTitle>

                    <div>

                        <div className="grid md:grid-cols-1 ml-20 ">
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
                            <Modal isOpen={isDataLoadModalOpen}>
                                <ModalHeader className="flex items-center">
                                    Редактиране на поръчка !
                                </ModalHeader>
                                <ModalBody>

                                    Ще редактирате поръчка с номер {orderData.id}, създадена на {orderData.createdAt} !
                                </ModalBody>
                                <ModalFooter>
                                    <div className="hidden sm:block">
                                        <Button onClick={() => { handlePreflight(); closeModal(); }}>
                                            Зареждане на Данни
                                        </Button>
                                    </div>

                                </ModalFooter>
                            </Modal>
                            <Modal isOpen={errorModalOpen}>
                                <ModalHeader className="flex items-center">
                                    Възникна сървърна грешка при опит за редактиране. Моля презаредете страницата и опитайте отново.
                                </ModalHeader>
                                <ModalBody>
                                </ModalBody>
                                <ModalFooter>
                                    <div className="hidden sm:block">
                                        <Button onClick={() => { window.location.reload() }}>
                                            Презареждане на страницата!
                                        </Button>
                                    </div>

                                </ModalFooter>
                            </Modal>
                            <Modal isOpen={successfulEditModalOpen}>
                                <ModalHeader className="flex items-center">
                                    Редактирането на поръчката е успешно!
                                </ModalHeader>
                                <ModalBody>

                                </ModalBody>
                                <ModalFooter>
                                    <div className="hidden sm:block">
                                        <Button className='mr-3'>
                                            <Link
                                                to={`/app/orders`}
                                            >
                                                Назад към всички поръчки</Link>
                                        </Button>
                                        <Button
                                            onClick={() => { window.location.reload(); setSuccessfulEditModalOpen(false) }}>
                                            Повторно редактиране
                                        </Button>
                                    </div>

                                </ModalFooter>
                            </Modal>

                            <div className='grid md:grid-cols-2 '>
                                <div className='text-right'>
                                    <Button
                                        className="w-full px-4 py-2 text-black bg-green-400 rounded-md shadow-md hover:bg-green-700"
                                        onClick={(event) => handleAddGroup(event)}
                                        style={{ width: '150px', margin: '10px' }}
                                        disabled={(submitButtonDisabled)}
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

                                <Modal isOpen={modalOpen}>
                                    <ModalHeader className="flex items-center">
                                        Потвърждавате ли направените промени?
                                    </ModalHeader>
                                    <ModalBody>

                                    </ModalBody>
                                    <ModalFooter>
                                        <div className="hidden sm:block">
                                            <Button onClick={() => { handleSubmit(); closeModal() }}>
                                                Потвърждаване                          </Button>
                                            <Button className='ml-3' layout="outline" onClick={() => { closeModal() }}>
                                                Отказ                                        </Button>
                                        </div>

                                    </ModalFooter>
                                </Modal>
                                {/* <ConfirmationModal
                                    isOpen={modalOpen}
                                    onClose={() => setModalOpen(false)}
                                    onConfirm={handleSubmit}
                                /> */}
                            </div>
                            {totalSqrt <= 1.5 && (<div className='text-center '>
                                <HelperText className='text-lg text-yellow-600'> <b><u>Общата квадратура на поръчката е под 1.5 кв.м. Добавена е 30% надценка !</u></b></HelperText><p><HelperText className='text-lg text-red-600'> <b><u>Доставката се поема от клиента !</u></b></HelperText></p></div>)}
                            {loggedUser.data.role === '[USER]' && orderData.appliedDiscount === null && (<div className='text-center'><HelperText className='text-lg text-green-600'> <b><u>Добавена е отстъпка от 5% </u></b></HelperText></div>)}
                            {loggedUser.data.role === '[USER]' && orderData.appliedDiscount != null && (<div className='text-center'><HelperText className='text-lg text-green-600'> <b><u>Добавена е отстъпка от {orderData.appliedDiscount + 5}% </u></b></HelperText></div>)}
                        </div>
                    </div>

                    <hr className="customeDivider mx-4 my-5" />
                    <div className='grid md:grid-cols-2 gap-10'>
                        <div className='  h-15 border-r pr-5 ml-3 border-black '>
                            <Label htmlFor="doorName" className="  mr-3 font-medium"><b>Материал на поръчката:</b></Label>
                            <Select className="text-center  mr-3 rounded shadow-sm w-24 "
                                id="mainDropdown"
                                name="mainDropdown"
                                value={mainDropdownValue}
                                onChange={(event) => handleMainDropdownChange(event)}
                                required

                            >
                                <option value="">-Изберете Материал-</option>
                                <option value="Мембранна вратичка">Мембранна вратичка</option>
                                <option value="Двустранно грундиран МДФ">Двустранно грундиран МДФ</option>
                                <option value="Фурнирован МДФ">Фурнирован МДФ</option>
                            </Select>
                            <HelperText className='text-s text-center text-yellow-500'> <b><u>Промямата ще бъде отразена за всички групи !</u></b></HelperText>

                        </div>
                        <div className=''>
                            <div className='border-l'></div>

                            <Label htmlFor="note" className="font-medium text-center   "><span><b>Забележка:</b></span></Label>
                            <Textarea
                                className="mt-1 border w-full"
                                type="text"
                                id={`note`}
                                name="note"
                                value={note}
                                onChange={(event) => { handleNote(event) }}
                            />
                        </div>
                    </div>
                </div>

                <div className="grid  md:grid-cols-1 gap-10">

                    {groupForms.map((formData, index) => (
                        <div className=''>
                            <div>
                                <div></div>
                            </div>
                            <div key={index} className="grid grid-cols-1 md:grid-cols-1 gap-2 cols-span-3 pl-5 ">
                                <div>

                                    <form

                                        id={`orderForm${index}`}
                                        className="grid grid-cols-4 gap-4  hover:border"
                                        style={{ padding: '20px', width: '1230px' }}
                                    >

                                        <div>
                                            <Label htmlFor="doorName" className=" font-medium">Материал:</Label>
                                            <Select className="mt-1 w-full p-2 border rounded-md shadow-sm"
                                                id="doorName"
                                                name="doorName"
                                                value={mainDropdownValue}
                                                onChange={(event) => { handleMainDropdownChange(event) }}
                                                disabled
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
                                            <div className='ml-20 '>

                                                <Button
                                                    onClick={(event, index) => handleAddGroup(event, index)}
                                                    className="text-center w-10 h-10 bg-green-400 hover:bg-green-600 rounded-md"
                                                    disabled={(submitButtonDisabled)}
                                                    layout="outline"
                                                >
                                                    +
                                                </Button>





                                                {index > 0 && (

                                                    <Button
                                                        onClick={(event) => handleDeleteGroup(index)}
                                                        className="border w-10 h-10 ml-10 bg-red-500 hover:bg-red-800 rounded-md

                                                    "
                                                        type="button"
                                                        layout="outline"
                                                    >
                                                        -
                                                    </Button>
                                                )}</div>

                                        </div>
                                    </form>
                                    <div className='grid md:grid-cols-4 h-100 pb-5'>
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
                        </div>


                    ))}

                </div></div ></>)
}

export default EditOrder;