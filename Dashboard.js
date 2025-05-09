
import React, { useState, useEffect } from 'react';

import InfoCard from "../components/Cards/InfoCard";
import ChartCard from "../components/Chart/ChartCard";
import { Doughnut, Line } from "react-chartjs-2";
import ChartLegend from "../components/Chart/ChartLegend";
import PageTitle from "../components/Typography/PageTitle";
import { CartIcon, MoneyIcon, PeopleIcon } from "../icons";
import RoundIcon from "../components/RoundIcon";
import { config } from '../Constants';



import {
  doughnutOptions,
  lineOptions,
  doughnutLegends,
  lineLegends,
} from "../utils/demo/chartsData";
import OrdersTable from "../components/OrdersTable";


function Dashboard() {
  const loggedUser = JSON.parse(localStorage.getItem("user"))
  const apiBaseUrl = config.url.API_BASE_URL;
  const [smsQuota, setSmsQuota] = useState(0);
  const [userCount,setUserCount] = useState(0);


  useEffect(() => {
    const token = localStorage.getItem('accessToken')
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  
    fetch(apiBaseUrl + "/api/sms", config)
     .then(response => response.json())
     .then(data => setSmsQuota(data.quotaRemaining));
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('accessToken')
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  
    fetch(apiBaseUrl + "/api/customers/count", config)
     .then(response => response.json())
     .then(data => setUserCount(data));

  }, []);
  return (
    <>
      <PageTitle>Контролен Панел</PageTitle>

      {/* <CTA /> */}

      {loggedUser.data.role === '[ADMIN]' && ( <>
      <div className="grid gap-6 mb-8 md:grid-cols-2 xl:grid-cols-4">
        <InfoCard title="Брой клиенти" value={userCount}>
          <RoundIcon
            icon={PeopleIcon}
            iconColorClass="text-orange-500 dark:text-orange-100"
            bgColorClass="bg-orange-100 dark:bg-orange-500"
            className="mr-4"
          />
        </InfoCard>

        <InfoCard title="Оставащи SMS-и" value={smsQuota}>
          <RoundIcon
            icon={MoneyIcon}
            iconColorClass="text-green-500 dark:text-green-100"
            bgColorClass="bg-green-100 dark:bg-green-500"
            className="mr-4"
          />
        </InfoCard>

        <InfoCard title="Нови поръчки" value="150">
          <RoundIcon
            icon={CartIcon}
            iconColorClass="text-blue-500 dark:text-blue-100"
            bgColorClass="bg-blue-100 dark:bg-blue-500"
            className="mr-4"
          />
        </InfoCard>

        <InfoCard title="Приходи за последните 30 дни" value="12,345 лв.">
          <RoundIcon
            icon={MoneyIcon}
            iconColorClass="text-teal-500 dark:text-teal-100"
            bgColorClass="bg-teal-100 dark:bg-teal-500"
            className="mr-4"
          />
        </InfoCard>
      </div>

      <div className="grid gap-6 mb-8 md:grid-cols-2">
        <ChartCard title="Създадени поръчки по тип потребител">
          <Line {...lineOptions} />
          <ChartLegend legends={lineLegends} />
        </ChartCard>

        <ChartCard title="Използвани материали">
          <Doughnut {...doughnutOptions} />
          <ChartLegend legends={doughnutLegends} />
        </ChartCard>
      </div>
      </>
      )}
      <PageTitle>Поръчки</PageTitle>
      <OrdersTable resultsPerPage={10000000} startDate={-2194445204000} endDate={64075218796000}/>
    </>
  );
}

export default Dashboard;
