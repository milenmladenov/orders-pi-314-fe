import React from "react";
import PageTitle from "../components/Typography/PageTitle";
import UsersTable from "../components/UsersTable";

const Customers = () => {
  return (
    <div>
      <PageTitle>Клиенти</PageTitle>

      <UsersTable resultsPerPage={10} />
    </div>
  );
};

export default Customers;
