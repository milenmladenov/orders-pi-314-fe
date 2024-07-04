import React, { useState, useEffect } from "react";
import axios from "axios";
import { config } from '../Constants';
import {
  SearchIcon
} from "../icons";
import {
  Input
} from "@windmill/react-ui";
import {
  TableBody,
  TableContainer,
  Table,
  TableHeader,
  TableCell,
  TableRow,
  TableFooter,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Button,
} from "@windmill/react-ui";
import { Link } from 'react-router-dom'

const UsersTable = ({ resultsPerPage, filter }) => {
  const [page, setPage] = useState(1);
  const token = localStorage.getItem('accessToken')
  const apiBaseUrl = config.url.API_BASE_URL;
  const [searchParam, setSearchParam] = useState('');
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [data, setData] = useState([]);
  const [totalResults, setTotalResults] = useState(0);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showActivateModal, setShowActivateModal] = useState(false);

  const [customerToDelete, setCustomerToDelete] = useState(null);
  const [customerToActivate, setCustomerToActivate] = useState(null);
  
  // pagination change control
  function onPageChange(p) {
    setPage(p);
  }

  const fetchData = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        }}
      const response = await axios.get(apiBaseUrl + "/api/customers", config);
      const userData = response.data
      setTotalResults(userData.length);
      setData(userData.slice((page - 1) * resultsPerPage, page * resultsPerPage));
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  const filterCustomer = async () => {
    try {
      
      
      const response = await axios.get(apiBaseUrl + "/api/customers?searchParam=" + searchParam, config);
      setData(response.data); // Assuming the response is an array of filtered customers
    } catch (error) {
      console.error('Error filtering customers:', error);
    }
  };

  const handleSearchInputChange = (event) => {
    setSearchParam(event.target.value);
  };

  const handleDeleteCustomer = (customer) => {
    setCustomerToDelete(customer);
    setShowDeleteModal(true);
  };

  const handleModalClose = () => {
    setShowDeleteModal(false);
    setShowActivateModal(false)
  };

  const handleDeleteConfirm = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      await axios.delete(apiBaseUrl + `/api/customers/delete/${customerToDelete.id}`, config);
      fetchData(); // Refresh the data after deletion
    } catch (error) {
      console.error('Error deleting customer:', error);
    }
    setShowDeleteModal(false);
  };

  const handleActivateUser = (user) => {
    setCustomerToActivate(user);
    setShowActivateModal(true);
  };

  const handleActivateConfirm = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      
      await axios.post(apiBaseUrl + `/api/customers/activate-user/${customerToActivate.id}`, {}, config);
      console.log(apiBaseUrl);
      fetchData(); // Refresh the data after activation
    } catch (error) {
      console.error('Error activating user:', error);
    }
    setShowActivateModal(false);
  };

  useEffect(() => {
    fetchData();
  }, [page, resultsPerPage, filter]);

  return (
    <>
      <div className="flex justify-center flex-1 lg:mr-32 mb-10">
        <div className="relative w-full max-w-xl mr-6 focus-within:text-purple-500">
          <div className="absolute inset-y-0 flex items-center pl-2">
            <SearchIcon className="w-4 h-4" aria-hidden="true" />
          </div>
          <Input
            className="pl-8 text-gray-700"
            placeholder="Търсете по име или ЕИК"
            aria-label="Search"
            value={searchParam}
            onChange={handleSearchInputChange}
            onBlur={filterCustomer} // You can also use onKeyDown event if you want the search to happen on pressing Enter
          />
        </div>
      </div>

      <div>
        {/* Table */}
        <TableContainer className="mb-8">
          <Table>
            <TableHeader>
              <tr>
                <TableCell>Име </TableCell>
                <TableCell>Потребителско име</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Телефон</TableCell>
                <TableCell></TableCell>
              </tr>
            </TableHeader>
            <TableBody>
              {data.map((user, i) => (
                <TableRow key={i}>
                  <TableCell>

                    <div>
                      <p className="font-semibold">{user.companyName}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{user.username}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{user.email}</span>
                  </TableCell>

                  <TableCell>
                    <span className="text-sm">{user.phone}
                    </span>
                  </TableCell>
                  <TableCell className="w-1/12 text-center">
                    <Link
                      to={`customers/${user.id}`}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      Детайли
                    </Link>
                  </TableCell>
                  <TableCell className="w-1/12 text-center">
                    {!user.active ? (
                      <Button
                        layout="outline"
                        className="text-gray-50	bg-green-500"
                        onClick={() => handleActivateUser(user)}
                      >
                        Активиране
                      </Button>
                    ) : (
                      <span>Активен</span>
                    )}
                  </TableCell>
                  <TableCell className="w-1/12 text-center">
                    <Button layout="outline" className="text-gray-50	bg-red-500"
                      onClick={() => handleDeleteCustomer(user)}
                    >
                      Изтриване
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <TableFooter>
            {/* <Pagination
      totalResults={totalResults}
      resultsPerPage={resultsPerPage}
      label="Table navigation"
      onChange={onPageChange}
    /> */}
          </TableFooter>
        </TableContainer>
      </div>

      <Modal isOpen={showDeleteModal} onClose={handleModalClose}>
        <ModalHeader>Изтриване на клиент</ModalHeader>
        <ModalBody>
          <p>Сигурни ли сте, че искате да изтриете клиента {customerToDelete && customerToDelete.companyName}?</p>
        </ModalBody>
        <ModalFooter>
          <Button onClick={handleModalClose}>Откажи</Button>
          <Button onClick={handleDeleteConfirm} className="bg-red-500 hover:bg-red-700 text-white">Изтрий</Button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={showActivateModal} onClose={handleModalClose}>
        <ModalHeader>Активиране на потребител</ModalHeader>
        <ModalBody>
          <p>Сигурни ли сте, че искате да активирате потребителя {customerToActivate && customerToActivate.companyName}?</p>
        </ModalBody>
        <ModalFooter>
          <Button onClick={handleModalClose}>Откажи</Button>
          <Button onClick={handleActivateConfirm} className="bg-green-500 hover:bg-green-700 text-white">Активиране</Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default UsersTable;