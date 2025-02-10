// export let URLS = {
//     backend: "http://localhost:5000",
//     publicBackend: "https://tempus.meliorus.co.nz"
// }

export let URLS = 
    (process.env.NODE_ENV === 'development') ?  {
        backend: process.env.REACT_APP_TEST_BACKEND_URL,
        "FRONTEND_URL":process.env.REACT_APP_TEST_FRONTEND_URL
    }:{
        backend: process.env.REACT_APP_BACKEND_URL,
        "FRONTEND_URL":process.env.REACT_APP_FRONTEND_URL
    }


