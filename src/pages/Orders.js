import React, { useState } from "react";
import PageTitle from "../components/Typography/PageTitle";
import { NavLink } from "react-router-dom";
import { HomeIcon } from "../icons";
import { Card, CardBody, Label, Select } from "@windmill/react-ui";
import OrdersTable from "../components/OrdersTable";

function Icon({ icon, ...props }) {
  const Icon = icon;
  return <Icon {...props} />;
}

const Orders = () => {
  // pagination setup
  const [resultsPerPage, setResultPerPage] = useState(10);
  const [filter, setFilter] = useState("всички");

  const handleFilter = (filter_name) => {
    if (filter_name === "Всички") {
      setFilter("всички");
    }
    if (filter_name === "Създадена") {
      setFilter("създадена");
    }
    if (filter_name === "Изпълнява се") {
      setFilter("изпълнява се");
    }
    if (filter_name === "Изпълнена") {
      setFilter("изпълнена");
    }
  };

  return (
    <div>
      <PageTitle>Поръчки</PageTitle>

      {/* Breadcum */}
      <div className="flex text-gray-800 dark:text-gray-300">
        <div className="flex items-center text-purple-600">
          <Icon className="w-5 h-5" aria-hidden="true" icon={HomeIcon} />
          <NavLink exact to="/app/dashboard" className="mx-2">
            Начало
          </NavLink>
        </div>
        {">"}
        <p className="mx-2">Поръчки</p>
      </div>

      {/* Sort */}
      <Card className="mt-5 mb-5 shadow-md">
        <CardBody>
          <div className="flex items-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Филтър
            </p>

            <Label className="mx-3">
              <Select
                className="py-3"
                onChange={(e) => handleFilter(e.target.value)}
              >
                <option>Всички</option>
                <option>Създадена</option>
                <option>Изпълнява се</option>
                <option>Изпълнена</option>

              </Select>
            </Label>

            <Label className="">
              {/* <!-- focus-within sets the color for the icon when input is focused --> */}
              <div className="relative text-gray-500 focus-within:text-purple-600 dark:focus-within:text-purple-400">
                <input
                  className="py-3 pr-5 text-sm text-black dark:text-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:focus:shadow-outline-gray form-input"
                  value={resultsPerPage}
                  onChange={(e) => setResultPerPage(e.target.value)}
                />
                <div className="absolute inset-y-0 right-0 flex items-center mr-3 pointer-events-none">
                  {/* <SearchIcon className="w-5 h-5" aria-hidden="true" /> */}
                  Показани
                </div>
              </div>
            </Label>
          </div>
        </CardBody>
      </Card>

      {/* Table */}
      <OrdersTable resultsPerPage={resultsPerPage} filter={filter} />
    </div>
  );
};

export default Orders;
