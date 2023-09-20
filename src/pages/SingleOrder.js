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


const SingleOrder = ({ match }) => {
    const apiBaseUrl = config.url.API_BASE_URL;

    const [order, setOrder] = useState(null);
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
            pdf.addImage(Logo,'PNG',0,0,100,90);
            pdf.addImage(imgData, 'PNG',0, 120, 610, 350); 
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
        
        <>           <div className='hidden' id='title'><h1 >Поръчка</h1></div>
        <div className='border mr-10' >
            
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
                    <TableHeader>
                        <tr>
                            <TableCell>Модел</TableCell>
                            <TableCell>Вид</TableCell>
                            <TableCell>Фолио</TableCell>
                            <TableCell>Профил</TableCell>
                            <TableCell>Дръжка</TableCell>
                            <TableCell>Вис.,мм</TableCell>
                            <TableCell>Шир., мм</TableCell>
                            <TableCell>Дъл.,мм</TableCell>
                            <TableCell>Брой</TableCell>
                            <TableCell>Цена Дръжка, бр.</TableCell>
                            <TableCell>Двустр. лам.</TableCell>
                            <TableCell>Ст-ст</TableCell>

                            {/* Add more table headers for other fields */}
                        </tr>
                    </TableHeader>
                    <TableBody>
                        {order.groups.map((group, j) => (
                            console.log(group.bothSidesLaminated),

                            <TableRow key={j}>
                                <TableCell>{group.model.name}</TableCell>
                                <TableCell>
                                    {group.detailType.material}{' '}
                                    {group.detailType.type !== null ? `(${group.detailType.type})` : ''}
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

                    </TableBody>

                </Table>
                <div><div><p className=' ml-3  content-end text-left mr-3 grid '><span className=' font-semibold content-end text-left mr-3 mt-3 mb-3'>Забележка :</span> <span>{order.note}</span></p> </div><p className='font-semibold content-end text-right mr-3 mt-3 mb-3'>Обща стойност: <span>{order.totalPrice}лв.</span></p></div>
            </TableContainer>
</div>
        </div></>
    );
};

export default SingleOrder;
