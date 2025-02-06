import axios from 'axios'

let baseURL = "http://localhost:5000";

const config = {
    timeout: 10000,
}

const httpClient = axios.create();

let cancelToken;

// adds access tokens in all api requests
// this interceptor is only added when the auth0 instance is ready and exports the getAccessTokenSilently method
const addAccessTokenInterceptor = (getAccessTokenSilently) => {
  httpClient.interceptors.request.use(async (config) => {
    const token = await getAccessTokenSilently({ authorizationParams: { audience: "bookerApi" } });
    config.headers.Authorization = `Bearer ${token}`;
    return config;
  });
};


const baseAxios = axios.create(config)

let authenticatedAxios = {}

authenticatedAxios.GET = async (endpoint, callback, opt={}) => {
        
  try {

    if (cancelToken) {
      cancelToken.cancel('Request canceled');
      cancelToken = null;
      
    }

    cancelToken = axios.CancelToken.source();

      const response = await httpClient.get(baseURL + endpoint, {
        cancelToken: cancelToken.token,
        ...opt
      })

      callback(response)

  } catch (err) {
    if (axios.isCancel(err)) {
      console.log('Request canceled:', err.message);
      cancelToken = null;

      return
    }
      console.log("Err in axios call: " + err.message)
      cancelToken = null;

      callback(err)
  }
}

authenticatedAxios.ASYNC_GET = async (endpoint) => {
        
  try {

    if (cancelToken) {
      cancelToken.cancel('Request canceled');
      cancelToken = null;
      
    }

    cancelToken = axios.CancelToken.source();

      const response = await httpClient.get(baseURL + endpoint, {
        cancelToken: cancelToken.token,
      })

      return response

  } catch (err) {
    if (axios.isCancel(err)) {
      console.log('Request canceled:', err.message);
      cancelToken = null;

      return err
    }
      console.log("Err in axios call: " + err.message)
      cancelToken = null;

      return err
  }
}

authenticatedAxios.POST = async (endpoint, data, callback) => {
  try {

    if (cancelToken) {
      cancelToken.cancel('Request canceled');
      cancelToken = null;
      
    }
    cancelToken = axios.CancelToken.source();
      const response = await httpClient.post(baseURL + endpoint, data, {
        cancelToken: cancelToken.token,
      })
      callback(response)
  } catch (err) {
    if (axios.isCancel(err)) {
      console.log('Request canceled:', err.message);
      cancelToken = null;

      return
    }
      console.log("Err in axios call: " + err)
      console.log(err)
      cancelToken = null;

      callback(err.response)
  }
}

authenticatedAxios.Delete = async (endpoint, id, callback) => {
  try {

    if (cancelToken) {
      cancelToken.cancel('Request canceled');
      cancelToken = null;
      
    }
    cancelToken = axios.CancelToken.source();
      const response = await httpClient.delete(baseURL + endpoint + id, {
        cancelToken: cancelToken.token,
      })
      callback(response)
  } catch (err) {
    if (axios.isCancel(err)) {
      console.log('Request canceled:', err.message);
      cancelToken = null;

      return
    }
      console.log("Err in axios call: " + err)
      console.log(err)
      cancelToken = null;

      callback(err.response)
  }
}


export {addAccessTokenInterceptor, authenticatedAxios, baseAxios}
