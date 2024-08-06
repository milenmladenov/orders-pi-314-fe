import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { NavLink, useParams } from "react-router-dom";
import Icon from "../components/Icon";
import PageTitle from "../components/Typography/PageTitle";
import { HomeIcon } from "../icons";
import { Card, CardBody, Badge, Button, Avatar,Input } from "@windmill/react-ui";
import { genRating } from "../utils/genarateRating";
import { config } from '../Constants';
import Logo from '../assets/img/pi314-logo.png'




const SingleProduct = () => {
  const { id } = useParams();
  const { type } = useParams();
  const token = localStorage.getItem('accessToken')
  const [product, setProduct] = useState([]);
  const [edit,setEdit] = useState(false);
  const [hideEditButton,setHideEditButton] = useState(false)

  const options = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const apiBaseUrl = config.url.API_BASE_URL;


  // change view component
  const [tabView, setTabView] = useState("reviews");
  const handleTabView = (viewName) => setTabView(viewName);

  //   get product
  useEffect(() => {
    const fetchProduct = async () => {
      try {


        const response = await axios.get(`${apiBaseUrl}/api/products/${type}/${id}`, options);
        setProduct(response.data);
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    };

    fetchProduct();
  }, [id, type, apiBaseUrl]);

  const enableEdit = () => {
    setHideEditButton(true)
    setEdit(true);
  }

  const handleChange = (event, index) => {
    const { name, value } = event.target;
    const product = (product, i) => {
        if (i === index) {
            return { ...product, [name]: value };
        }
        return product;
    };
    setProduct(product);
};

  const editProduct = () => {
    try {
      axios.post(`${apiBaseUrl}/api/products/${type}/${id}/edit`, product, options);
      window.location.reload()
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div>
      <PageTitle>Детайли</PageTitle>

      {/* Breadcum */}
      <div className="flex text-gray-800 dark:text-gray-300">
        <div className="flex items-center text-purple-600">
          <Icon className="w-5 h-5" aria-hidden="true" icon={HomeIcon} />
          <NavLink exact to="/app/dashboard" className="mx-2">
            Контролен Панел
          </NavLink>
        </div>
        {">"}
        <NavLink exact to="/app/all-products" className="mx-2 text-purple-600">
          Склад
        </NavLink>
        {">"}
        <p className="mx-2">{product.name}</p>
      </div>

      {/* Product overview  */}
      <Card className="my-8 shadow-md">
        <CardBody>
          <div className="grid grid-col items-center md:grid-cols-2 lg:grid-cols-2">
            <div>
              <img src={Logo} alt="" className="w-full rounded-lg" />
            </div>

            <div className="mx-8 pt-5 md:pt-0">
              <h1 className="text-3xl mb-4 ` text-gray-700 dark:text-gray-200">
                {type === "MODEL" ? "Модел" : type === "DOOR" ? "Материал" : "Фолио"} : <u><i><b>{product?.name}</b></i></u>
              </h1>

              <Badge
                type={product?.quantity > 0 ? "success" : "danger"}
                className="mb-2"
              >
                <p className="break-normal">
                  {product?.quantity > 0 ? `Налична` : "Не налично"}
                </p>
              </Badge>

              {/* <p className="mb-2 text-sm text-gray-800 dark:text-gray-300">
                {product?.shortDescription}
              </p>
              <p className="mb-3 text-sm text-gray-800 dark:text-gray-300">
                {product?.featureDescription}
              </p> */}



            
              {edit ? (
                 <><h4 className="mt-4 text-purple-600 text-2xl font-semibold">
                  Цена: <Input  className="mt-1 w-full"
                                                        type="number"
                                                        id="price"
                                                        name="price"
                                                        value={product.price}
                                                        onChange={(event) => { handleChange(event); }}
                                                        required />
                </h4><p className="text-sm text-gray-900 dark:text-gray-400">
                    Количество : <Input  className="mt-1 w-full"
                                                        type="number"
                                                        id="quantity"
                                                        name="quantity"
                                                        value={product.quantity}
                                                        onChange={(event) => { handleChange(event); }}
                                                        required />
                  </p>
                  <Button onClick={editProduct}>Запази</Button></>
              ):(  <><h4 className="mt-4 text-purple-600 text-2xl font-semibold">
                  Цена: {product?.price}лв.
                </h4><p className="text-sm text-gray-900 dark:text-gray-400">
                    Количество : {product?.quantity}
                  </p>
                  <Button onClick={enableEdit}>Редактиране</Button></>)
                  }

            </div>
          </div>
        </CardBody>
      </Card>


    </div>
  );
};

export default SingleProduct;
