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
  Pagination,
 
} from "@windmill/react-ui";
import { Link } from 'react-router-dom'


const UsersTable = ({ resultsPerPage, filter }) => {
  const [page, setPage] = useState(1);
  const token = localStorage.getItem('accessToken')

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
      const response = await axios.get("http://localhost:8080/api/customers", config);
      const userData = response.data
      setTotalResults(userData.length);
      setData(userData.slice((page - 1) * resultsPerPage, page * resultsPerPage));
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  // on page change, load new sliced data
  // here you would make another server request for new data
  useEffect(() => {
    fetchData();
  }, [page, resultsPerPage, filter]);

  return (
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

export default UsersTable;
