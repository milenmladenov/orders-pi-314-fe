import React, { useState, useEffect } from "react";
import PageTitle from "../components/Typography/PageTitle";
import { Link, NavLink } from "react-router-dom";
import axios from "axios";
import { config } from '../Constants';


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
  Badge,Input,
  Pagination,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@windmill/react-ui";
import {
  SearchIcon
} from "../icons";
import Icon from "../components/Icon";
import { genRating } from "../utils/genarateRating";

const ProductsAll = () => {
  const [view, setView] = useState("list");
  const token = localStorage.getItem('accessToken')
  const apiBaseUrl = config.url.API_BASE_URL;
  const [searchParam, setSearchParam] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [type,setType] = useState('');




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

  const filterProducts = async (event) => {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    }
    handleSearchInputChange(event)
    try {
      const response = await axios.get(apiBaseUrl + "/api/products?searchParam=" + searchParam, config);
      setData(response.data);
    } catch (error) {
      console.error('Error filtering customers:', error);
    }
  };
  const handleSearchInputChange = (event) => {
    setSearchParam(event.target.value);
  };
  const handleModalClose = () => {
    setShowDeleteModal(false);
  };
  const handleDeleteConfirm = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      await axios.delete(apiBaseUrl + `/api/products/${type}/${productToDelete.id}/delete`, config);
      fetchData(); // Refresh the data after deletion
    } catch (error) {
      console.error('Error deleting customer:', error);
    }
    setShowDeleteModal(false);
  };

  // on page change, load new sliced data
  // here you would make another server request for new data
  const fetchData = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.get(apiBaseUrl + "/api/products", config);
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
  const handleDeleteProduct = (product,type) => {
    setType(type);
    setProductToDelete(product);
    setShowDeleteModal(true);
  };

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

      <div className="flex justify-center flex-1 lg:mr-32 mb-5">
        <div className="relative w-full max-w-xl mr-2 focus-within:text-purple-500">
          <div className="absolute inset-y-0 flex items-center pl-2 pt-6">
            <SearchIcon className="w-4 h-4" aria-hidden="true" />
          </div>
          <br></br>
                    <Input
            className="pl-8 text-gray-700"
            placeholder="Търсете по име"
            aria-label="Search"
            value={searchParam}
            onChange ={(event) => { filterProducts(event) }} // You can also use onKeyDown event if you want the search to happen on pressing Enter
          />
        </div>

      </div>
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
                          <p className="font-semibold">   <Badge
                type={door?.quantity > 0 ? "success" : "danger"}
                className="mb-2"
              >
                <p className="break-normal">
                  {door?.quantity > 0 ? `Налична` : "Не налично"}
                </p>
              </Badge></p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm">
                       
                        <div>
                          <p className="font-semibold">{door.quantity}</p>
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
                    <TableCell> <Link
                      to={`product/DOOR/${door.id}`}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      Детайли
                    </Link></TableCell>
                    <TableCell className="w-1/12 text-center">
                    <Button layout="outline" className="text-gray-50	bg-red-500"
                      onClick={() => handleDeleteProduct(door,"DOOR")}
                    >
                      Изтриване
                    </Button>
                  </TableCell>
                  </TableRow>
                  
                ))}

                
                <div className="ml-4 ">
                <Label className='text-xl font-bold text-green-500	'>Фолио</Label></div>
                {data && data.folios && data.folios.map((folio, index) => (
                  <TableRow key={index} >
                    <TableCell>
                      <div className="flex items-center text-sm">
                       
                        <div>
                          <p className="font-semibold">{folio.name}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm">
                       
                        <div>
                          <p className="font-semibold">   <Badge
                type={folio?.quantity > 0 ? "success" : "danger"}
                className="mb-2"
              >
                <p className="break-normal">
                  {folio?.quantity > 0 ? `Налична` : "Не налично"}
                </p>
              </Badge></p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm">
                       
                        <div>
                          <p className="font-semibold">{folio.quantity}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm">
                       
                        <div>
                          <p className="font-semibold">{folio.price} лв.</p>
                        </div>
                      </div>
                    </TableCell>
                   < TableCell> <Link
                      to={`product/FOLIO/${folio.id}`}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      Детайли
                    </Link></TableCell>
                    <TableCell className="w-1/12 text-center">
                    <Button layout="outline" className="text-gray-50	bg-red-500"
                      onClick={() => handleDeleteProduct(folio,"FOLIO")}
                    >
                      Изтриване
                    </Button>
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

      <Modal isOpen={showDeleteModal} onClose={handleModalClose}>
        <ModalHeader>Изтриване на клиент</ModalHeader>
        <ModalBody>
          <p>Сигурни ли сте, че искате да изтриете {productToDelete && productToDelete.name}?</p>
        </ModalBody>
        <ModalFooter>
          <Button onClick={handleModalClose}>Откажи</Button>
          <Button onClick={handleDeleteConfirm} className="bg-red-500 hover:bg-red-700 text-white">Изтрий</Button>
        </ModalFooter>
      </Modal>
          </div>
       ); 
};

export default ProductsAll;
