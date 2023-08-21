import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  TableBody,
  TableContainer,
  Table,
  TableHeader,
  TableCell,
  TableRow,
  TableFooter,
  Avatar,
  Badge,
  Pagination,
  Button, Select, Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from "@windmill/react-ui";
import {
  EditIcon,
  EyeIcon,
  GridViewIcon,
  HomeIcon,
  ListViewIcon,
  TrashIcon,
} from "../icons";
import { Link } from 'react-router-dom'
import json2xls from 'json2xls'; // Import json2xls
import { saveAs } from "file-saver"; // Import saveAs function
import * as XLSX from 'xlsx';
import ExcelJS from 'exceljs';
import Icon from "../components/Icon";
import { config } from '../Constants';







const OrdersTable = ({ resultsPerPage, filter }) => {
  const [page, setPage] = useState(1);
  const [data, setData] = useState([]);
  const [totalResults, setTotalResults] = useState(0);
  const token = localStorage.getItem('accessToken')
  const loggedUser = JSON.parse(localStorage.getItem('user'))
  const [selectedStatus, setSelectedStatus] = useState(undefined);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null); // Define selectedOrderId state
  const apiBaseUrl = config.url.API_BASE_URL;



  const handleChange = (event,order) => {
    const newStatus = event.target.value;
    order.selectedStatus = newStatus;
    if (newStatus !== selectedStatus) {
      setSelectedStatus(newStatus);
      setIsModalOpen(true);
    }
  };

  const fetchData = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.get(apiBaseUrl + "/api/orders/all", config);
      const ordersData = response.data;

      // Apply filters if necessary
      let filteredData = ordersData;
      if (filter === "изпратена") {
        filteredData = ordersData.filter(order => order.status === "Paid");
      } else if (filter === "създадена") {
        filteredData = ordersData.filter(order => order.status === "CREATED");
      } else if (filter === "изпълнява се") {
        filteredData = ordersData.filter(order => order.status === "WORKING_ON");
      } else if (filter === "изпълнена") {
        filteredData = ordersData.filter(order => order.status === "Paid");
      }

      // Flatten the groups and update the totalResults and data state
      const flattenedGroups = filteredData.flatMap(order => order);
      setTotalResults(flattenedGroups.length);
      setData(flattenedGroups.slice((page - 1) * resultsPerPage, page * resultsPerPage));
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const handleConfirmChange = (order) => {
    // Make API call to change the order status
    fetch(apiBaseUrl + `/orders/${order.id}/change-status?orderStatus=${selectedStatus}`, {
      method: 'POST',
    })
      .then((response) => {
        // Handle response as needed
      })
      .catch((error) => {
        // Handle error
      });

    // Close the confirmation modal
    closeModal()
  };
  function closeModal() {
    setIsModalOpen(false);
  }
  // pagination change control
  function onPageChange(p) {
    setPage(p);
  }

  const formatDateWithoutDashes = (dateString) => {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return date.toLocaleDateString('en-US', options).replace(/\//g, ''); // Remove slashes
  };



  const exportToExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Справка');

    const headerRow = [
      "ПОРЕДЕН НОМЕР", "Група", "ДАТА", "ПОРЪЧКА", "КЛИЕНТ", "ВИД", "ГРАД",
      "ЕТИКЕТ", "МОДЕЛ", "ВИСОЧИНА", "ШИРИНА", "БРОЙ КОЛИЧЕСТВО",
      "МЕРНА ЕДИНИЦА", "ДРЪЖКА", "ЕДИНИЧНА ЦЕНА", "ЦЕНА НА ДРЪЖКА",
      "ДВУСТРАННО ФОЛИРАНЕ", "СТОЙНОСТ", "ФОЛИО", "ПРОФИЛ",
    ];

    worksheet.addRow(headerRow);

    data.forEach(order => {
      order.groups.forEach(group => {
        const rowData = [
          formatDateWithoutDashes(order.createdAt) + order.id, "Група", order.createdAt, order.id, order.user.companyName, order.type === "BY_HAND" ? "Ръчно - от Администратор" : "От клиент",
          order.user.city, order.detailType, group.model.name, group.height, group.width, group.number,
          "квадратен метър", group.handle.name, group.handle.price, "Цена на Дръжка",
          group.bothSidesLaminated ? "ДВУСТРАННО" : "", order.totalPrice, group.folio.name, group.profil.name
        ];
        const newRow = worksheet.addRow(rowData);

        // Check if order status is CREATED and set row color to red
        if (order.status === "CREATED") {
          newRow.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FF00FF00' }, // Green colornpom 
          };
        } else if (order.status === "WORKING_ON") {
          newRow.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFFFFF00' }, // Yellow color
          };
        }
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

    saveAs(blob, 'Справка - ' + new Date().toLocaleDateString() + '.xlsx');
  };


  useEffect(() => {
    fetchData();
  }, [page, resultsPerPage, filter]);
  return (
    <div>
      {loggedUser.data.role === '[ADMIN]' && (
        <>
          <div className="mt-4 ">
            <Button layout="outline" onClick={exportToExcel} className="btn btn-primary">
              Експорт на справка
            </Button>
          </div>
          <hr className="customeDivider mx-4 my-5" />
        </>
      )}
      
      {/* Table */}
      <TableContainer className="mb-8">
        <Table>
          <TableHeader>
            <tr>
              <TableCell>Номер</TableCell>
              <TableCell>Oт дата</TableCell>
              <TableCell>Статус</TableCell>
              <TableCell>Потребител</TableCell>
              <TableCell>Крайна сума</TableCell>
              <TableCell>Тип поръчка</TableCell>
              <TableCell>Отстъпка</TableCell>
            </tr>
          </TableHeader>
          <TableBody>
          
            {data.map((order, i) => (
             <TableRow key={i}>
                  <TableCell>
                    <div className="flex items-center text-sm">
                      <div>
                        <p className="font-semibold">{formatDateWithoutDashes(order.createdAt) + order.id}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center text-sm">
                      <div>
                        <p className="font-semibold">{order.createdAt}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Modal isOpen={isModalOpen} onClose={closeModal}>
                      <ModalHeader className="flex items-center">
                        <Icon icon={EditIcon} className="w-6 h-6 mr-3" />
                        Промяна на статус
                      </ModalHeader>
                      <ModalBody>
                        Сигурни ли сте, че искате да промените статуса на{" "}
                        {selectedStatus && `"${selectedStatus}"`}
                      </ModalBody>
                      <ModalFooter>
                        <div className="hidden sm:block">
                          <Button onClick={() => handleConfirmChange(order)}>
                            Потвърждаване
                          </Button>
                        </div>
                        <div className="hidden sm:block">
                          <Button layout="outline" onClick={closeModal}>
                            Отказ
                          </Button>
                        </div>
                      </ModalFooter>
                    </Modal>
                  
                    <Select value={selectedStatus}  >
                      <option value={order.status}>
                        {order.status === "WORKING_ON" ? "Изпълнява се" : order.status === "CREATED" ? "Създадена  " : order.status === "SEND" ? "Изпратена" : order.status === "DONE" ? "Изпълнена" : order.status}
                      </option>
                      {order.status !== "CREATED" && (
                        <option value="CREATED">Създадена</option>
                      )}
                      {order.status !== "SEND" && (
                        <option value="SEND">Изпратена</option>
                      )}
                      {order.status !== "WORKING_ON" && (
                        <option value="WORKING_ON">Изпълнява се</option>
                      )}
                      {order.status !== "DONE" && (
                        <option value="DONE">Изпълнена</option>
                      )}


                    </Select>

                  </TableCell>
                  <TableCell>

                    <div className="flex items-center text-sm">
                      <div>
                        <p className="font-semibold">{order.user.companyName}</p>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center text-sm">
                      <div>
                        <span className="font-semibold">{order.totalPrice}</span><span>лв.</span>
                      </div>
                    </div>
                  </TableCell>


                  <TableCell>
                    {order.type === "BY_HAND" ? "Ръчно - от Администратор" : "От клиент"}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center text-sm">
                      <div>
                        <span className="font-semibold">0</span><span>%</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="w-1/12 text-center">
                    <Link
                      to={`orders/${order.id}`}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      Детайли
                    </Link>
                  </TableCell>
                </TableRow>
            ))}
          </TableBody>
        </Table>
        <TableFooter>

          <Pagination
            totalResults={totalResults}
            resultsPerPage={resultsPerPage}
            label="Table navigation"
            onChange={onPageChange}
          />
        </TableFooter>
      </TableContainer>
    </div>
  );
};

export default OrdersTable;
