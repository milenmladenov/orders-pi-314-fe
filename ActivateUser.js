// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const ActivateUser = () => {
//   const userId = useParams().userId; // get the userId from the URL params
//   const [activated, setActivated] = useState(false);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     axios.post(`/activate-user/${userId}`)
//       .then(response => {
//         setActivated(true);
//       })
//       .catch(error => {
//         setError(error.message);
//       });
//   }, [userId]);

//   return (
//     <div>
//       {activated ? (
//         <p>Успешно активиране на акаунта!</p>
//       ) : (
//         <p>Грешка при активиране на акаунта: {error}</p>
//       )}
//     </div>
//   );
// };

// export default ActivateUser;