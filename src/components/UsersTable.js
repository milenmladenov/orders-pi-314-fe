import React, { useState, useEffect } from "react";
import axios from "axios";
import { config } from '../Constants';
import {
  SearchIcon,
  MoonIcon,
  SunIcon,
  BellIcon,
  MenuIcon,
  OutlinePersonIcon,
  OutlineCogIcon,
  OutlineLogoutIcon,
} from "../icons";
import {
  Avatar,
  Badge,
  Input,
  Dropdown,
  DropdownItem,
  WindmillContext,
} from "@windmill/react-ui";


import {
  TableBody,
  TableContainer,
  Table,
  TableHeader,
  TableCell,
  TableRow,
  TableFooter,
  Pagination,

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

  // pagination change control
  function onPageChange(p) {
    setPage(p);
  }
  const fetchData = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
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
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.get(apiBaseUrl + "/api/customers?searchParam=" + searchParam, config);
      setData(response.data); // Assuming the response is an array of filtered customers
    } catch (error) {
      console.error('Error filtering customers:', error);
    }
  };

  const handleSearchInputChange = (event) => {
    setSearchParam(event.target.value);
  };

  

  // on page change, load new sliced data
  // here you would make another server request for new data
  useEffect(() => {
    fetchData();
  }, [page, resultsPerPage, filter]);

  return (
    <><div className="flex justify-center flex-1 lg:mr-32 mb-10">
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


    </div><div>
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
      </div></>
  );
};

export default UsersTable;
