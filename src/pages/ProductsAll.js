import React, { useState, useEffect } from "react";
import PageTitle from "../components/Typography/PageTitle";
import { Link, NavLink } from "react-router-dom";
import axios from "axios";

import {
  EditIcon,
  EyeIcon,
  GridViewIcon,
  HomeIcon,
  ListViewIcon,
  TrashIcon,
} from "../icons";
import {
  Card,
  CardBody,
  Label,
  Select,
  Button,
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
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@windmill/react-ui";
import Icon from "../components/Icon";
import { genRating } from "../utils/genarateRating";

const ProductsAll = () => {
  const [view, setView] = useState("list");
  const token = localStorage.getItem('accessToken')

  // Table and grid data handlling
  const [page, setPage] = useState(1);
  const [data, setData] = useState([]);
  const [totalResults, setTotalResults] = useState(0);


  // pagination setup
  const [resultsPerPage, setResultsPerPage] = useState(10);

  // pagination change control
  function onPageChange(p) {
    setPage(p);
  }

  // on page change, load new sliced data
  // here you would make another server request for new data
  const fetchData = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.get("http://localhost:8080/api/products", config);
      const productsData = response.data;


      // Apply filters if necessary
      // let filteredData = ordersData;
      // if (filter === "изпратена") {
      //   filteredData = ordersData.filter(order => order.status === "Paid");
      // } else if (filter === "създадена") {
      //   filteredData = ordersData.filter(order => order.status === "CREATED");
      // } else if (filter === "изпълнява се") {
      //   filteredData = ordersData.filter(order => order.status === "WORKING_ON");
      // } else if (filter === "изпълнена") {
      //   filteredData = ordersData.filter(order => order.status === "Paid");
      // }

      // Flatten the groups and update the totalResults and data state
      // const flattenedGroups = filteredData.flatMap(product => product);
      // setTotalResults(flattenedGroups.length);
setData(productsData)    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    fetchData();
  }, [page, resultsPerPage]);
console.log(data);
  // Delete action model
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDeleteProduct, setSelectedDeleteProduct] = useState(null);
  async function openModal(productId) {
    let product = await data.filter((product) => product.id === productId)[0];
    // console.log(product);
    setSelectedDeleteProduct(product);
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
  }

  // Handle list view
  const handleChangeView = () => {
    if (view === "list") {
      setView("grid");
    }
    if (view === "grid") {
      setView("list");
    }
  };

  return (
    <div>
      <PageTitle>Всички продукти</PageTitle>

      {/* Breadcum */}
      <div className="flex text-gray-800 dark:text-gray-300">
        <div className="flex items-center text-purple-600">
          <Icon className="w-5 h-5" aria-hidden="true" icon={HomeIcon} />
          <NavLink exact to="/app/dashboard" className="mx-2">
            Контролен панел
          </NavLink>
        </div>
        {">"}
        <p className="mx-2">Всички продукти</p>
      </div>

      {/* Sort */}
      <Card className="mt-5 mb-5 shadow-md">
        <CardBody>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
Всички продукти              </p>

              <Label className="mx-3">
                <Select className="py-3">
                  <option>Sort by</option>
                  <option>Asc</option>
                  <option>Desc</option>
                </Select>
              </Label>

              <Label className="mx-3">
                <Select className="py-3">
                  <option>Filter by Category</option>
                  <option>Electronics</option>
                  <option>Cloths</option>
                  <option>Mobile Accerssories</option>
                </Select>
              </Label>

              <Label className="mr-8">
                {/* <!-- focus-within sets the color for the icon when input is focused --> */}
                <div className="relative text-gray-500 focus-within:text-purple-600 dark:focus-within:text-purple-400">
                  <input
                    className="py-3 pr-5 text-sm text-black dark:text-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:focus:shadow-outline-gray form-input"
                    placeholder="Number of Results"
                    value={resultsPerPage}
                    onChange={(e) => setResultsPerPage(e.target.value)}
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center mr-3 pointer-events-none">
                    {/* <SearchIcon className="w-5 h-5" aria-hidden="true" /> */}
                    Показани продукти
                  </div>
                </div>
              </Label>
            </div>
            
          </div>
        </CardBody>
      </Card>

      {/* Delete product model */}
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <ModalHeader className="flex items-center">
          {/* <div className="flex items-center"> */}
          <Icon icon={TrashIcon} className="w-6 h-6 mr-3" />
          Изтриване на продукт
          {/* </div> */}
        </ModalHeader>
        <ModalBody>
          Сигурни ли сте, че искате да изтриете {" "}
          {selectedDeleteProduct && `"${selectedDeleteProduct.name}"`}
        </ModalBody>
        <ModalFooter>
          {/* I don't like this approach. Consider passing a prop to ModalFooter
           * that if present, would duplicate the buttons in a way similar to this.
           * Or, maybe find some way to pass something like size="large md:regular"
           * to Button
           */}
          <div className="hidden sm:block">
            <Button layout="outline" onClick={closeModal}>
              Отказ
            </Button>
          </div>
          <div className="hidden sm:block">
            <Button>Delete</Button>
          </div>
          <div className="block w-full sm:hidden">
            <Button block size="large" layout="outline" onClick={closeModal}>
              Отказ
            </Button>
          </div>
          <div className="block w-full sm:hidden">
            <Button block size="large">
              Изтриване
            </Button>
          </div>
        </ModalFooter>
      </Modal>

   
          <TableContainer className="mb-8">
            <Table>
              <TableHeader>
                <tr>
                  <TableCell>Име</TableCell>
                  <TableCell>Наличност</TableCell>
                  <TableCell>Количество</TableCell>
                  <TableCell>Цена</TableCell>
                </tr>
              </TableHeader>
              <TableBody>
                <div className="ml-4 ">
                <Label className='text-xl font-bold text-green-500	'>Материали</Label></div>
                {data && data.doors && data.doors.map((door, index) => (
                  <TableRow key={index} >
                    <TableCell>
                      <div className="flex items-center text-sm">
                       
                        <div>
                          <p className="font-semibold">{door.name}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm">
                       
                        <div>
                          <p className="font-semibold">da</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm">
                       
                        <div>
                          <p className="font-semibold">12</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm">
                       
                        <div>
                          <p className="font-semibold">{door.price} лв.</p>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}

<div className="ml-4 ">
                <Label className='text-xl font-bold text-green-500	'>Модели</Label></div>
                {data && data.models && data.models.map((model, index) => (
                  <TableRow key={index} >
                    <TableCell>
                      <div className="flex items-center text-sm">
                       
                        <div>
                          <p className="font-semibold">{model.name}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm">
                       
                        <div>
                          <p className="font-semibold">da</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm">
                       
                        <div>
                          <p className="font-semibold">12</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm">
                       
                        <div>
                          <p className="font-semibold">{model.price} лв.</p>
                        </div>
                      </div>
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

export default ProductsAll;
