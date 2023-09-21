import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, TableContainer, Table, TableHeader, TableCell, TableRow, TableBody } from '@windmill/react-ui';
import PageTitle from "../components/Typography/PageTitle";
import labelsFile from "../assets/xlxs/за етикети.xlsx";
import { saveAs } from "file-saver"; // Import saveAs function
import ExcelJS from 'exceljs';
import { config } from '../Constants';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import Logo from '../assets/img/logo-white-frame.png';
import font from '../assets/fonts/font';
import { Tab } from 'semantic-ui-react';


const SingleOrder = ({ match }) => {
    const apiBaseUrl = config.url.API_BASE_URL;



    const [order, setOrder] = useState(null);
    const [totalPrice, setTotalPrice] = useState('0лв.');
    const [groupPrices, setGroupPrices] = useState('0');
    const [totalGroupPrices, setTotalGroupPrices] = useState('0');
    const [groupSqrt, setGroupSqrt] = useState('0');
    const [totalSqrt, setTotalSqrt] = useState('0');
    const [handlePrice, setHandlePrice] = useState(0);
    const [handleNumber, setHandleNumber] = useState(0);
    const [elementNumber, setElementNumber] = useState(0);

    const orderId = match.params.id; // Get the orderId from the route parameter
    const token = localStorage.getItem('accessToken')
    const loggedUser = JSON.parse(localStorage.getItem('user'))
    const formatDateWithoutDashes = (dateString) => {
        const date = new Date(dateString);
        const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
        return date.toLocaleDateString('en-US', options).replace(/\//g, ''); // Remove slashes
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "WORKING_ON":
                return "text-yellow-500"; // Yellow color
            case "CREATED":
                return "text-gray-500";
            case "SEND":
                return "text-blue-500";
            case "DONE":
                return "text-green-500";
                return "";
        }
    };

    const captureScreenshotAndConvertToPDF = () => {
        // Select the component or container to capture
        const componentToCapture = document.getElementById('singleOrderComponent');
        // Use html2canvas to capture the component as an image
        html2canvas(componentToCapture).then(canvas => {
            const pdf = new jsPDF('p', 'pt', 'letter');
            const imgData = canvas.toDataURL('image/png');
            pdf.addFileToVFS('PTSans-Regular-normal.ttf', font);
            pdf.addFont('PTSans-Regular-normal.ttf', 'PTSans-Regular', 'normal');
            // Create a new jsPDF instance
            // Add the captured image to the PDF
            pdf.addImage(Logo, 'PNG', 0, 0, 100, 90);
            pdf.addImage(imgData, 'PNG', 0, 90, 610, 400);
            // Save the PDF
            pdf.save('single_order.pdf');
        })

    };

    useEffect(() => {
        const fetchOrder = async () => {

            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                };
                const response = await axios.get(apiBaseUrl + `/api/orders/${orderId}`, config);
                setOrder(response.data);
                let totalSqrt = 0;
                let totalGroupPrices = 0;
                let elementNumber = 0;
                // Get the groupTotalPrice for every group in the response
                const groupPrices = response.data.groups.map((group) => {
                    const result = group.groupTotalPrice;
                    totalGroupPrices += result;
                    setTotalGroupPrices(totalGroupPrices.toFixed(2))
                    return result;
                });
                const elementNumbers = response.data.groups.map((group) => {
                    const result = group.number;
                    elementNumber += result;
                    setElementNumber(elementNumber);
                    return result;
                });
                const groupSqrt = response.data.groups.map((group) => {
                    const result = ((group.height / 1000) * (group.width / 1000)) * group.number;
                    totalSqrt += result;
                    setTotalSqrt(totalSqrt.toFixed(2))
                    return result.toFixed(2);
                });
                let handleNumber = 0;
                response.data.groups.map((group) => {
                    if (group.handle.name !== 'Без Дръжка') {
                        handleNumber += 1;
                        setHandleNumber(handleNumber);
                    }
                    return handleNumber;
                });
                const totalPrice = response.data.totalPrice;

                setTotalPrice(`${totalPrice}лв. с ДДС`);
                setHandlePrice(response.data.handlePrice);
                setGroupPrices(groupPrices);
                setGroupSqrt(groupSqrt);
            } catch (error) {
                console.error('Error fetching order:', error);
            }
        };

        fetchOrder();
    }, [orderId]);

    if (!order) {
        return <div>Loading...</div>;
    }
    const exportToExcel = async () => {
        try {
            const response = await axios.get(labelsFile, { responseType: 'arraybuffer' });
            const existingWorkbook = new ExcelJS.Workbook();
            await existingWorkbook.xlsx.load(response.data)

            const dataWorksheet = existingWorkbook.getWorksheet('Data')
            let numberToIncrement = 1;

            order.groups.forEach(group => {

                const rowData = ["",
                    order.user.companyName, formatDateWithoutDashes(order.createdAt) + order.id, group.model.name, "", group.height, group.width, group.number, order.id + "-" + numberToIncrement++];

                const newRow = dataWorksheet.addRow(rowData);
            })



            const buffer = await existingWorkbook.xlsx.writeBuffer();
            const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

            saveAs(blob, 'етикети - ' + order.id + '.xlsx');


        } catch (error) {
            console.error('Error exporting to Excel:', error);
        }
    };

    return (
        console.log(order),

        <>
            <div className='border mr-10 w-full' >

                <div className='text-center border' >
                    <PageTitle>Статус на поръчката: <span className={getStatusColor(order.status)}>{order.status === "WORKING_ON" ? "Изпълнява се" : order.status === "CREATED" ? "Създадена" : order.status === "SEND" ? "Изпратена" : order.status === "DONE" ? "Изпълнена" : order.status}</span>
                        <div> {loggedUser.data.role === '[ADMIN]' && (
                            <>
                                <div className='text-right mr-3 mb-4'>
                                    <Button onClick={exportToExcel} className="">
                                        Генериране на етикети
                                    </Button>


                                </div>
                            </>
                        )}   <div className='text-right mr-3'><Button onClick={captureScreenshotAndConvertToPDF}>PDF</Button></div></div>
                    </PageTitle>        </div>
                <div id="singleOrderComponent">
                    <div className='grid grid-cols-2 h-10 mb-4 '><div className='text-right border'><p className='mr-3'>От дата: {order.createdAt}</p></div><div className='  text-left border'><p className='ml-3'>Номер: {order.id}</p></div></div>
                    <div className='grid grid-cols-2 border mb-4 '><div className='grid grid-cols-1 ml-3 mt-3 mb-3 space-y-[5px]'><div className='mb-2'>Фирма: {order.user.companyName}</div><div className='mb-2'>Град: {order.user.city}</div><div className='mb-2'>Адрес: {order.user.companyAddress}</div><div className='mb-2'>ЕИК/ВАТ: {order.user.bulstat}</div><div>МОЛ: {order.user.mol}</div></div><div className='grid grid-cols-1 border'><div className='ml-3 mt-3'>Телефон: {order.user.phone}</div><div className='ml-3'>Адрес на доставка: {order.deliveryAddress}</div></div></div>
                    <div className='grid grid-cols-2 mb-5'><h1 className='ml-3'>Материал: <span className='font-semibold'> {order.groups[0].door.name}</span></h1>
                    </div>
                    <TableContainer>

                        <Table>
                            <TableHeader >
                                <tr className='text-xs'>
                                    <TableCell>Номер</TableCell>
                                    <TableCell>Модел</TableCell>
                                    <TableCell>Вид</TableCell>
                                    <TableCell>Фолио</TableCell>
                                    <TableCell>Профил</TableCell>
                                    <TableCell>Дръжка</TableCell>
                                    <TableCell>Вис.,мм</TableCell>
                                    <TableCell>Шир., мм</TableCell>
                                    <TableCell>Дъл.,мм</TableCell>
                                    <TableCell>Брой</TableCell>
                                    <TableCell>Дръжка бр./лв.</TableCell>
                                    <TableCell>Двустр. лам.</TableCell>
                                    <TableCell>Ст-ст</TableCell>

                                </tr>
                            </TableHeader>
                            <TableBody className='border'>
                                {order.groups.map((group, j) => (
                                    console.log(group.bothSidesLaminated),

                                    <TableRow className=' border-t border-b text-xs' key={j}>
                                        <TableCell>{j + 1}</TableCell>

                                        <TableCell>{group.model.name}</TableCell>
                                        <TableCell>
                                            {group.detailType.material}{' '}
                                            {group.detailType.type !== null ? <><hr /><span> ({group.detailType.type})</span></> : ''}
                                        </TableCell>
                                        <TableCell>{group.folio.name}</TableCell>
                                        <TableCell>{group.profil.name}</TableCell>
                                        <TableCell>{group.handle.name}</TableCell>
                                        {group.detailType.material === 'Корниз' ? (
                                            <>
                                                <TableCell>{group.length}</TableCell>
                                                <TableCell></TableCell>
                                                <TableCell></TableCell>  {/* Leave this cell empty */}
                                            </>
                                        ) : (
                                            <> <TableCell></TableCell>
                                                <TableCell>{group.height}</TableCell>
                                                <TableCell>{group.width}</TableCell>
                                            </>
                                        )}
                                        <TableCell>{group.number}</TableCell>

                                        <TableCell>{group.handle.price} лв.</TableCell>
                                        <TableCell>{group.bothSidesLaminated === true ? ("Да") : ("Не")}</TableCell>
                                        <TableCell>{group.groupTotalPrice}лв.</TableCell>
                                    </TableRow>
                                ))}
                                {/* <TableRow ><hr className="customeDivider mx-4 my-5" /></TableRow> */}

                                
                                <TableRow className='border-t border-b font-bold text-xs' >
                                    <TableCell colspan='8'>Общо:</TableCell>
                                    <TableCell>Oбщо кв.м. <hr />{totalSqrt} кв.м.</TableCell>
                                    <TableCell className='border-t border-b'>
                                        {elementNumber}бр.</TableCell>
                                    <TableCell colspan='2' className='border-t border-b'>{handleNumber}бр. /{handlePrice}лв.</TableCell>

                                    <TableCell >{totalGroupPrices}лв.</TableCell>


                                </TableRow>
                                <TableRow className='border-t border-b font-bold text-xs' >
                                    <TableCell colspan='12'>Всичко:</TableCell>

                                    <TableCell >{totalGroupPrices}лв.</TableCell>


                                </TableRow>
                                {order.type === 'BY_USER' && order.discount === 0 && (
                                    <TableRow className='border-t border-b font-bold text-xs' >
                                        <TableCell colspan='11'>Отстъпка при онлайн поръчка:</TableCell>
                                        <TableCell >5%</TableCell>
                                        <TableCell >{(totalGroupPrices * 0.05).toFixed(2)}лв.</TableCell>
                                    </TableRow>)}
                                {order.type === 'BY_USER' && order.discount !== 0 && (
                                    <TableRow className='border-t border-b font-bold text-xs' >
                                        <TableCell colspan='11'>Отстъпка:</TableCell>
                                        <TableCell >{order.discount}%</TableCell>
                                        <TableCell >{(totalGroupPrices * (order.discount / 100).toFixed(2)).toFixed(2)}лв.</TableCell>
                                    </TableRow>)}
                                
                                <TableRow className='border-t border-b font-bold text-xs' >
                                    <TableCell colspan='12'>За Плащане:</TableCell>
                                            
                                    <TableCell >{order.totalPrice}лв.</TableCell>


                                </TableRow>
                            </TableBody>

                        </Table>

                    </TableContainer>
                    <hr className="customeDivider mx-4 my-5" />

                    <TableContainer>
                        <Table>
                            <TableBody>

                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TableContainer>
                        <Table>

                        </Table>
                        <div><div><p className=' ml-3  content-end text-left mr-3 grid '><span className=' font-semibold content-end text-left mr-3 mt-3 mb-3'>Забележка :</span> <span>{order.note}</span></p> </div></div>

                    </TableContainer>
                </div>
            </div></>
    );
};

export default SingleOrder;
