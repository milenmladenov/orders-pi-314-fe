import React, { useState, useEffect, useRef } from 'react';
import PageTitle from "../components/Typography/PageTitle";
import "../assets/css/groups-in-rows.css"
import { orderApi } from '../components/misc/OrderApi'
import AuthContext, { AuthProvider, useAuth } from '../components/context/AuthContext';
import ConfirmationModal from '../components/ConfirmationModal';



const NewOrderForm = () => {
    const { userLogout } = useAuth()
    const logout = () => {
        userLogout()
    }

    const loggedUser = JSON.parse(localStorage.getItem("user"))

    const initialFormState = {
        doorName: '',
        modelName: '',
        folioName: '',
        handleName: 'Без Дръжка',
        profilName: 'R1',
        height: 400,
        width: 400,
        number: 1,
        detailType: ''
    };

    const [totalPrice, setTotalPrice] = useState('0лв. / Добавени са 30% надценка към крайната цена.');
    const [groupPrices, setGroupPrices] = useState('0');
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedMaterial, setSelectedMaterial] = useState('');
    const [selectedPilastur, setSelectedPilastur] = useState('');
    const [orderUrl, setOrderUrl] = useState();
    const [orderPreflightUrl, setOrderPreflightUrl] = useState();


    useEffect(() => {
        setOrderPreflightUrl('http://localhost:8080/api/orders/new-order/preflight');
        setOrderUrl('http://localhost:8080/api/orders/new-order');
      }, []);


    const [groupForms, setGroupForms] = useState([
        { ...initialFormState }
    ]);



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

    const handleChange1 = (event) => {
        const value = event.target.value;
        setSelectedMaterial(value);
        setSelectedPilastur('');
    };

    useEffect(() => {
        handlePreflight();
    }, [groupForms, selectedPilastur]);

    const handlePilasturChange = (event) => {
        setSelectedPilastur(event.target.value);
    };

    const handleAddGroup = () => {

        setGroupForms((prevGroupForms) => [
            ...prevGroupForms,
            {
                doorName: "",
                modelName: "",
                folioName: "",
                handleName: "Без Дръжка",
                profilName: "R1",
                height: 400,
                width: 400,
                number: 1,
                detailType: ''
            },
        ]);
    };

    //     function handleChange(event) {
    //     const { name, value } = event.target;
    //     setFormData({ ...formData, [name]: value });
    // }
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
            number: parseInt(formData.number),
            detailType: `${selectedMaterial} - ${selectedPilastur}`
        }));
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
            }),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log(data);

                // Get the groupTotalPrice for every group in the response
                const groupPrices = data.groups.map((group) => group.groupTotalPrice);

                // Set the total price as the sum of all groupTotalPrices
                const totalPrice = groupPrices.reduce((accumulator, currentValue) => accumulator + currentValue, 0);

                // Render the response data
                setTotalPrice(`${totalPrice}`);
                setGroupPrices(groupPrices);
                window.location.reload();


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
            height: parseInt(formData.height),
            width: parseInt(formData.width),
            number: parseFloat(formData.number),
            detailType: `${selectedMaterial} - ${selectedPilastur}`
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
                console.log(loggedUser.data.role);

                // Get the groupTotalPrice for every group in the response
                const groupPrices = data.groups.map((group) => group.groupTotalPrice);
                setGroupPrices(groupPrices);
                // Set the total price as the sum of all groupTotalPrices
                const totalPrice = data.totalPrice;
                if (loggedUser.data.role === '[ADMIN]') {
                    setTotalPrice(`${totalPrice}лв. / Добавени са 30% надценка към крайната цена.`);
                } else if (loggedUser.data.role === '[USER]') {
                    setTotalPrice(`${totalPrice}лв.`);

                }
                // Render the response data


            })
            .catch((error) => {
                console.log('Error: ' + error.message);
            });
        console.log(orderUrl)
        console.log(orderPreflightUrl)
    };


    return (


        <>
            <div className="grid gap-2 mb-12 md:grid-cols-2">
                <div className="col-span-12 text-center sticky-top ">
                    <PageTitle>Създаване на нова поръчка</PageTitle>
                    <div> {<p className='flex justify-start'>Обща цена на поръчката : {totalPrice}</p>}
                        <div className="col-span-2 flex justify-end">

                            <button
                                className="w-full px-4 py-2 text-white bg-green-600 rounded-md shadow-md hover:bg-green-700"
                                onClick={handleAddGroup}
                                style={{ width: '150px', margin: '10px' }}
                            >
                                Нова Група
                            </button>
                            <button
                                type="button"
                                style={{ width: '150px', margin: '10px' }}
                                className="w-full py-2 text-white bg-indigo-600 rounded-md shadow-md hover:bg-indigo-700"
                                onClick={() => setModalOpen(true)}
                            >
                                Създаване
                            </button>
                            <ConfirmationModal
                                isOpen={modalOpen}
                                onClose={() => setModalOpen(false)}
                                onConfirm={handleSubmit}
                            />
                        </div>
                    </div>
                    <hr className="customeDivider mx-4 my-5" />

                </div>

                <div className="grid  md:grid-cols-1 gap-10">

                    {groupForms.map((formData, index) => (
                        <div >
                            <div key={index} className="grid grid-cols-1 md:grid-cols-1 gap-2 cols-span-3">

                                <form
                                    id={`orderForm${index}`}
                                    className="grid grid-cols-4 gap-4 border"
                                    style={{ padding: '20px', width: '1230px' }}
                                >
                                    <div>
                                        <label htmlFor="doorName" className="block font-medium">Материал:</label>
                                        <select className="mt-1 w-full p-2 border rounded-md shadow-sm"
                                            id="doorName"
                                            name="doorName"
                                            value={formData.doorName}
                                            onChange={(event) => handleChange(event, index)}
                                            required

                                        >
                                            <option value="">-Изберете Материал-</option>
                                            <option value="Мембранна вратичка">Мембранна вратичка</option>
                                            <option value="Двустранно грундиран МДФ">Двустранно грундиран МДФ</option>
                                            <option value="Фурнирован МДФ">Фурнирован МДФ</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label htmlFor="detailName" className="block font-medium">Вид на материала:</label>
                                        <select className="mt-1 w-full p-2 border rounded-md shadow-sm"
                                            id="detailName"
                                            name="detailName"
                                            value={selectedMaterial}
                                            onChange={(event) => handleChange1(event, index)}
                                            required

                                        >
                                            <option value="">-Вид на материала-</option>
                                            <option value="Вратичка">Вратичка</option>
                                            <option value="Страница">Страница</option>
                                            <option value="Чекмедже">Чекмедже</option>
                                            <option value="Пиластър">Пиластър</option>
                                            <option value="Корниз">Корниз</option>

                                        </select>
                                        {selectedMaterial === 'Пиластър' && (
                                            <div>
                                                <label htmlFor="pilasturSelect">Пиластър:</label>
                                                <select
                                                    className="mt-1 w-full p-2 border rounded-md shadow-sm"
                                                    id="pilasturSelect"
                                                    name="pilasturSelect"
                                                    value={selectedPilastur}
                                                    onChange={(event) => handlePilasturChange(event)}
                                                    required
                                                >
                                                    <option value="">-Изберете Пиластър-</option>
                                                    <option value="P1">P1</option>
                                                    <option value="P2">P2</option>
                                                    <option value="P3">P3</option>
                                                    {/* Add more options here */}
                                                </select>
                                            </div>
                                        )}
                                    </div>

                                    {/* Model Name */}
                                    <div>
                                        <label htmlFor="modelName" className="block font-medium">Модел:</label>
                                        <select className="mt-1 w-full p-2 border rounded-md shadow-sm"
                                            id="modelName"
                                            name="modelName"
                                            value={formData.modelName}
                                            onChange={(event) => handleChange(event, index)}
                                            disabled={(formData.doorName === '' || selectedMaterial === "Пиластър" || selectedMaterial === "Корниз") || selectedMaterial === "Чекмедже"}
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
                                        </select>
                                    </div>
                                    <div>
                                        {/* Folio Name s
*/}
                                        <label htmlFor="folioName" className="block font-medium">Фолио :</label>
                                        <select className="mt-1 w-full p-2 border rounded-md shadow-sm"
                                            id="folioName"
                                            name="folioName"
                                            value={formData.folioName}
                                            onChange={(event) => handleChange(event, index)}
                                            disabled={formData.modelName === '' || selectedMaterial == 'Пиластър' || selectedMaterial == 'Чекмедже  '}
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
                                            <option value="Z3006-2">Z3006-2</option>       </select>
                                    </div><div>
                                        {/* Handle Name */}
                                        <label htmlFor="handleName" className="block font-medium">Дръжка</label>
                                        <select className="mt-1 w-full p-2 border rounded-md shadow-sm"
                                            type="text"
                                            id="handleName"
                                            name="handleName"
                                            value={formData.handleName}
                                            onChange={(event) => handleChange(event, index)}
                                            disabled={formData.modelName === '' || selectedMaterial == 'Пиластър' || selectedMaterial == 'Чекмедже'}
                                        >
                                            <option value="Без дръжка">Без дръжка</option>
                                            <option value="дръжка H1">дръжка H1</option></select></div>
                                    <div>
                                        {/* Profil Name */}
                                        <label htmlFor="profilName" className="block font-medium">Профил:</label>
                                        <select className="mt-1 w-full p-2 border rounded-md shadow-sm"
                                            type="text"
                                            id="profilName"
                                            name="profilName"
                                            value={formData.profilName}
                                            onChange={(event) => handleChange(event, index)}
                                            required
                                            disabled={formData.modelName === '' || selectedMaterial == 'Пиластър' || selectedMaterial == 'Чекмедже  '}
                                        >
                                            <option value="R1">Профил R1</option>
                                            <option value="R2">Профил R2</option>
                                            <option value="Профил R3">Профил R3</option>
                                            <option value="Профил R4">Профил R4</option>
                                            <option value="Профил R5">Профил R5</option></select>





                                    </div><div>
                                        {/* Height */}
                                        <label htmlFor="height" className="block font-medium">Височина, мм:</label>
                                        <input className="mt-1 p-2 border rounded-md shadow-sm"
                                            type="number"
                                            id="height"
                                            name="height"
                                            value={formData.height}
                                            onChange={(event) => handleChange(event, index)}
                                            required

                                        />
                                    </div><div>
                                        {/* Width */}
                                        <label htmlFor="width" className="block font-medium">Широчина, мм:</label>
                                        <input className="mt-1 p-2 border rounded-md shadow-sm"
                                            type="number"
                                            id="width"
                                            name="width"
                                            value={formData.width}
                                            onChange={(event) => handleChange(event, index)}
                                            disabled={selectedMaterial == 'Пиластър' || selectedMaterial == 'Чекмедже'}
                                            required />
                                    </div><div>
                                        {/* Number */}
                                        <label htmlFor="number" className="block font-medium">Брой:</label>
                                        <input
                                            className="mt-1 p-2 border rounded-md shadow-sm"
                                            type="number"
                                            id={`number${index}`}
                                            name="number"
                                            value={formData.number}
                                            onChange={(event) => handleChange(event, index)}
                                            required disabled={selectedMaterial == 'Пиластър'}
                                        />
                                    </div>
                                    <div>Цена на групата : {groupPrices[index]}лв.</div>
                                </form>
                            </div>
                        </div>
                    ))}
                </div></div > <div className="grid gap-2 mb-12 md:grid-cols-2">
                <div></div>
                <div className="col-span-2 flex justify-end">

                </div></div></>)
}


export default NewOrderForm;