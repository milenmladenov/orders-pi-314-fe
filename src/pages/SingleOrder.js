import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, TableContainer, Table, TableHeader, TableCell, TableRow, TableBody, HelperText } from '@windmill/react-ui';
import PageTitle from "../components/Typography/PageTitle";
import labelsFile from "../assets/xlxs/за етикети.xlsx";
import { saveAs } from "file-saver"; // Import saveAs function
import ExcelJS from 'exceljs';
import { config } from '../Constants';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'
import html2canvas from 'html2canvas';
import Logo from '../assets/img/logo-white-frame.png';
import font from '../assets/fonts/font';
import { Tab } from 'semantic-ui-react';
import { useLocation } from 'react-router-dom/cjs/react-router-dom.min';
import ThemedSuspense from '../components/ThemedSuspense';


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
        const pdf = new jsPDF('p', 'pt', [297 * 72 / 25.4, 210 * 72 / 25.4]); // Convert mm to pt
        const componentToCapture = document.getElementById('singleOrderComponent');
      
        // Get the component's dimensions
        const componentWidth = componentToCapture.offsetWidth;
        const componentHeight = componentToCapture.offsetHeight;
      
        // Calculate the image's dimensions based on the page size and the component's dimensions
        const imageWidth = pdf.internal.pageSize.getWidth() * 0.8; // 90% of the page width
        const imageAspectRatio = componentWidth / componentHeight;
        const imageHeight = imageWidth / imageAspectRatio;
      
        // Convert the component to an image
        html2canvas(componentToCapture).then((canvas) => {
          const imgData = canvas.toDataURL('image/png');
      
          // Check if the image height is greater than the available space on a single page
          if (imageHeight > pdf.internal.pageSize.height ) {
            // Calculate the number of pages needed
            const numPages = Math.ceil(imageHeight / (pdf.internal.pageSize.height));
      
            // Loop through each page
            for (let i = 0; i < numPages; i++) {
              // Calculate the height of the current page
              const pageHeight = (pdf.internal.pageSize.height) * (i === numPages - 1? (imageHeight % (pdf.internal.pageSize.height)) / imageHeight : 1);
      
              // Create a new page
              pdf.addPage();
      
              // Set the image's dimensions based on the current page's height
              const currentImageHeight = Math.min(pageHeight, imageHeight);
              const currentImageWidth = (currentImageHeight / imageHeight) * imageWidth;
      
              // Add the image to the current page
              pdf.addImage(Logo, 'JPEG', 40, 0, 50, 50);
              pdf.addImage(imgData, 'JPEG', 40,50, currentImageWidth, currentImageHeight);
            }
          } else {
            // Add the image to the PDF
            pdf.addImage(Logo, 'JPEG', 40, 0, 50, 50);

            pdf.addImage(imgData, 'JPEG' ,40,50, imageWidth, imageHeight);
          }
      
          // Save the PDF
          pdf.save(order.orderUuid + '.pdf');
        });
      };

    const isHashFromUrl = () => {
        const hashFromUrl = window.location.hash
        if (hashFromUrl === '#pdf-button') {
            captureScreenshotAndConvertToPDF();
        }
    }

    const savePdf = () => {
        const doc = new jsPDF()
        doc.setFont('Roboto-Regular', 'normal')
        autoTable(doc, {
            head: [['nomer', 'etiket', 'model', 'Vid', 'folio', 'profil', 'drujka', 'visochina', 'shirina', 'duljina', 'broi', 'dryjka stojnost', 'dwustr lam', 'stoinost']],
            body: [
                ['1', '4-2', 'Sweden', '1', '4-2', 'Sweden', '1', '4-2', 'Sweden', '1', '4-2', 'Sweden', '4-2', 'Sweden']

                // ...
            ],
        })

        doc.save('table.pdf')

    }
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
                isHashFromUrl();
            } catch (error) {
                console.error('Error fetching order:', error);
            }
        };

        fetchOrder();
    }, [orderId]);

    if (!order) {
        return <ThemedSuspense />;
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

        <><br></br>
            <div className='border border-black mr-10 w-full'  >

                <div className='text-center border border-black' >
                    <PageTitle>Статус на поръчката: <span className={getStatusColor(order.status)}>{order.status === "WORKING_ON" ? "Изпълнява се" : order.status === "CREATED" ? "Създадена" : order.status === "SEND" ? "Изпратена" : order.status === "DONE" ? "Изпълнена" : order.status}</span>
                        <div className='text-right mr-3'> {loggedUser.data.role === '[ADMIN]' && (
                            <>

                                <Button onClick={exportToExcel} className="">
                                    Генериране на етикети
                                </Button>



                            </>
                        )}   <Button id="pdf-button" onClick={captureScreenshotAndConvertToPDF}>PDF</Button></div>
                    </PageTitle>        </div>
                <div id="singleOrderComponent">
                    <div id='header-1' className='pdf-component grid grid-cols-2 h-10 mb-4 border-black  border'><div className='text-right border'><p className='mr-3'>От дата: {order.createdAt}</p></div><div className='  text-left border-l border-black'><p className='ml-3'>Номер: {order.orderUuid}</p></div></div>

                    <div id='header-1' className='pdf-component grid grid-cols-2 border border-black mb-4 '><div className='grid grid-cols-1 ml-3 mt-3 mb-3 space-y-[5px]'><div className='mb-2'>Фирма: {order.user.companyName}</div><div className='mb-2'>Град: {order.user.city}</div><div className='mb-2'>Адрес: {order.user.companyAddress}</div><div className='mb-2'>ЕИК/ВАТ: {order.user.bulstat}</div><div>МОЛ: {order.user.mol}</div></div><div className='grid grid-cols-1 border'><div className='ml-3 mt-3'>Телефон: {order.user.phone}</div><div className='ml-3'>Адрес на доставка: {order.deliveryAddress}</div></div></div>
                    <div id='header-1' className='pdf-component grid grid-cols-2 border-l border-r border-black mb-5'><h1 className='ml-3'>Материал: <span className='font-semibold'> {order.groups[0].door.name}</span></h1>
                    </div>
                    <TableContainer>

                        <Table id="my-table" className='border border-black pdf-component' >
                            <TableHeader >
                                <tr className='text-m'>
                                    <TableCell className='border-r border-black'>Номер</TableCell>
                                    <TableCell className='border-r border-black'>Етикет</TableCell>
                                    <TableCell className='border-r border-black'>Модел</TableCell>
                                    <TableCell className='border-r border-black'>Вид</TableCell>
                                    <TableCell className='border-r border-black'>Фолио</TableCell>
                                    <TableCell className='border-r border-black'>Профил</TableCell>
                                    <TableCell className='border-r border-black'>Дръжка</TableCell>
                                    <TableCell className='border-r border-black'>Вис.,мм</TableCell>
                                    <TableCell className='border-r border-black'>Шир., мм</TableCell>
                                    <TableCell className='border-r border-black'>Дъл.,мм</TableCell>
                                    <TableCell className='border-r border-black'>Брой</TableCell>
                                    <TableCell className='border-r border-black'>Дръжка бр./лв.</TableCell>
                                    <TableCell className='border-r border-black'>Двустр. лам.</TableCell>
                                    <TableCell>Ст-ст</TableCell>

                                </tr>
                            </TableHeader>
                            <TableBody className='border border-black   font-bold'>
                                {order.groups.map((group, j) => (

                                    <TableRow className='border border-black text-l' key={j}>
                                        <TableCell className='border-r   border-black'>{j + 1}</TableCell>
                                        <TableCell className='border-r border-black'>{order.id}-{j + 1}</TableCell>
                                        <TableCell className='border-r border-black'>{group.model.name}</TableCell>
                                        <TableCell className='border-r border-black'>
                                            {group.detailType.material}{' '}
                                            {group.detailType.type !== null ? <><hr /><span> ({group.detailType.type})</span></> : ''}
                                        </TableCell>
                                        <TableCell className='border-r border-black'>{group.folio.name}</TableCell>
                                        <TableCell className='border-r border-black'>{group.profil.name}</TableCell>
                                        <TableCell className='border-r border-black'>{group.handle.name}</TableCell>
                                        {group.detailType.material === 'Корниз' ? (
                                            <>
                                                <TableCell className='border-r border-black'>{group.length}</TableCell>
                                                <TableCell className='border-r border-black'></TableCell>
                                                <TableCell className='border-r border-black'></TableCell>  {/* Leave this cell empty */}
                                            </>
                                        ) : (
                                            <> <TableCell className='border-r border-black'></TableCell>
                                                <TableCell className='border-r border-black'>{group.height}</TableCell>
                                                <TableCell className='border-r border-black'>{group.width}</TableCell>
                                            </>
                                        )}
                                        <TableCell className='border-r border-black'>{group.number}</TableCell>

                                        <TableCell className='border-r border-black'>{group.handle.price} лв.</TableCell>
                                        <TableCell className='border-r border-black'>{group.bothSidesLaminated === true ? ("Да") : ("Не")}</TableCell>
                                        <TableCell className='border-r border-black'>{group.groupTotalPrice}лв.</TableCell>
                                    </TableRow>
                                ))}
                                {/* <TableRow ><hr className="customeDivider mx-4 my-5" /></TableRow> */}


                                <TableRow className='border-t border-b font-bold text-l' >
                                    <TableCell colspan='9'>Общо:</TableCell>
                                    <TableCell className='border-r border-l  border-black'>Oбщо кв.м. <hr />{totalSqrt} кв.м.</TableCell>
                                    <TableCell className='border-r border-l  border-black'>
                                        {elementNumber}бр.</TableCell>
                                    <TableCell colspan='2' className='border-r border-l border-black'>{handleNumber}бр. /{handlePrice}лв.</TableCell>

                                    <TableCell className='border-r border-l  border-black'>{totalGroupPrices}лв.</TableCell>


                                </TableRow>
                                <TableRow className='border-t border-b border-black font-bold text-m' >
                                    <TableCell colspan='13'>Всичко:</TableCell>

                                    <TableCell className='border border-black  '>{totalGroupPrices}лв.</TableCell>


                                </TableRow>
                                {order.type === 'BY_USER' && order.discount === 0 && (
                                    <TableRow className='border-t border-b font-bold text-m' >
                                        <TableCell colspan='11'>Отстъпка при онлайн поръчка:</TableCell>
                                        <TableCell >5%</TableCell>
                                        <TableCell >{(totalGroupPrices * 0.05).toFixed(2)}лв.</TableCell>
                                    </TableRow>)}
                                {order.type === 'BY_USER' && order.discount !== 0 && (
                                    <TableRow className='border-t border-b font-bold text-m' >
                                        <TableCell colspan='11'>Отстъпка:</TableCell>
                                        <TableCell >{order.discount}%</TableCell>
                                        <TableCell >{(totalGroupPrices * (order.discount / 100).toFixed(2)).toFixed(2)}лв.</TableCell>
                                    </TableRow>)}

                                {order.type === 'BY_HAND' && order.discount !== 0 && (
                                    <TableRow className='border-t border-b font-bold text-m' >
                                        <TableCell colspan='12'>Отстъпка:</TableCell>
                                        <TableCell >{order.discount}%</TableCell>
                                        <TableCell >{(totalGroupPrices * (order.discount / 100).toFixed(2)).toFixed(2)}лв.</TableCell>
                                    </TableRow>)}

                                <TableRow className='border-t border-b font-bold text-m' >
                                    <TableCell colspan='13' className='border border-black  '>За Плащане:</TableCell>

                                    <TableCell className='border border-black  '>{order.totalPrice}лв.</TableCell>


                                </TableRow>
                            </TableBody>

                        </Table>

                    </TableContainer>
                    <div className='text-right mt-4 mr-4'>{totalSqrt <= 1.5 &&
                        (<HelperText className=' text-sm text-red-600'>
                            <b>Общата квадратура на поръчката е под 1.5 кв.м. Добавена е 30% надценка !</b>
                        </HelperText>)}</div>

                    <TableContainer>
                        <Table>
                            <TableBody>

                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TableContainer>
                        <Table>

                        </Table>
                        <div id='notes'><div><p className=' ml-3  content-end text-left mr-3 grid '><span className=' font-semibold content-end text-left mr-3 mt-3 mb-3'>Забележка : <span className='font-normal'>{order.note}</span></span> </p> </div></div>

                    </TableContainer>
                    <div></div>
                </div>

            </div><div><br></br></div></>
            
    );
};

export default SingleOrder;
