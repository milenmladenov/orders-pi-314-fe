const prod = {
    url: {
      API_BASE_URL: 'https://orders-pi314-396621.uc.r.appspot.com]' ,
    }
  }
  
  const dev = {
    url: {
      API_BASE_URL: 'http://localhost:8080'
    }
  }
  
  export const config = process.env.NODE_ENV === 'development' ? dev : prod