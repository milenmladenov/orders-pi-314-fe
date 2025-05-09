export const doughnutLegends = [
  { title: "Мембранна Вратичка", color: "bg-blue-500" },
  { title: "Двустранно Грундиран МДФ", color: "bg-teal-600" },
  { title: "Фурнирован МДФ", color: "bg-purple-600" },
];

export const lineLegends = [
  { title: "От Админ", color: "bg-teal-600" },
  { title: "От Клиент", color: "bg-purple-600" },
];

export const barLegends = [
  { title: "Shoes", color: "bg-teal-600" },
  { title: "Bags", color: "bg-purple-600" },
];
export const realTimeUsersBarLegends = [
  { title: "Active Users", color: "bg-teal-600" },
];

export const doughnutOptions = {
  data: {
    datasets: [
      {
        data: [33, 33, 33],
        /**
         * These colors come from Tailwind CSS palette
         * https://tailwindcss.com/docs/customizing-colors/#default-color-palette
         */
        backgroundColor: ["#0694a2", "#1c64f2", "#7e3af2"],
        label: "Dataset 1",
      },
    ],
    labels: ["Мембранна Вратичка", "Двустранно Грундиран МДФ", "Фурнирован МДФ"],
  },
  options: {
    responsive: true,
    cutoutPercentage: 80,
  },
  legend: {
    display: false,
  },
};

export const lineOptions = {
  data: {
    labels: ["Януари", "Фебруари", "Март", "Април", "Май", "Юни", "Юли"],
    datasets: [
      {
        label: "от Админ",
        /**
         * These colors come from Tailwind CSS palette
         * https://tailwindcss.com/docs/customizing-colors/#default-color-palette
         */
        backgroundColor: "#0694a2",
        borderColor: "#0694a2",
        data: [43, 48, 40, 54, 67, 73, 70],
        fill: false,
      },
      {
        label: "От Клиент",
        fill: false,
        /**
         * These colors come from Tailwind CSS palette
         * https://tailwindcss.com/docs/customizing-colors/#default-color-palette
         */
        backgroundColor: "#7e3af2",
        borderColor: "#7e3af2",
        data: [24, 50, 64, 74, 52, 51, 65],
      },
    ],
  },
  options: {
    responsive: true,
    tooltips: {
      mode: "index",
      intersect: false,
    },
    hover: {
      mode: "nearest",
      intersect: true,
    },
    scales: {
      x: {
        display: true,
        scaleLabel: {
          display: true,
          labelString: "Month",
        },
      },
      y: {
        display: true,
        scaleLabel: {
          display: true,
          labelString: "Value",
        },
      },
    },
  },
  legend: {
    display: false,
  },
};

export const barOptions = {
  data: {
    labels: ["January", "February", "March", "April", "May", "June", "July"],
    datasets: [
      {
        label: "Shoes",
        backgroundColor: "#0694a2",
        // borderColor: window.chartColors.red,
        borderWidth: 1,
        data: [-3, 14, 52, 74, 33, 90, 70],
      },
      {
        label: "Bags",
        backgroundColor: "#7e3af2",
        // borderColor: window.chartColors.blue,
        borderWidth: 1,
        data: [66, 33, 43, 12, 54, 62, 84],
      },
    ],
  },
  options: {
    responsive: true,
  },
  legend: {
    display: false,
  },
};

export const realTimeUsersBarOptions = {
  data: {
    labels: [
      "6.00",
      "6.10",
      "6.20",
      "6.30",
      "6.40",
      "6.50",
      "7.00",
      "7.10",
      "7.20",
      "7.30",
      "7.40",
      "7.50",
      "Now",
    ],
    datasets: [
      {
        label: "Active Users",
        backgroundColor: "#0694a2",
        // borderColor: window.chartColors.red,
        borderWidth: 1,
        data: [2, 14, 52, 74, 33, 90, 70, 34, 56, 62, 11, 23, 55],
      },
    ],
  },
  options: {
    responsive: true,
  },
  legend: {
    display: false,
  },
};
