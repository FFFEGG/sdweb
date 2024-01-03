import axios from "axios";
axios.defaults.timeout = 100000;

axios.defaults.baseURL = "http://127.0.0.1:8000";

// var modal = {};

axios.interceptors.request.use(
    (config) => {

        config.data = JSON.stringify(config.data);
        config.headers = {
            "Content-Type": "application/json",

        };
        return config;
    }, (error) => Promise.reject(error)
);


axios.interceptors.response.use(
    (response) => {
        // console.log(response.config.data.url, modal)
        console.log('response', response)

        return response;
    },
    async (error) => {
        console.log('error', error)

        const { response } = error;
        let errorText = ''

        if (error === undefined || error.code === 'ECONNABORTED') {
            // toast.error('服务请求超时')
            return Promise.reject(error)
        }


        return Promise.reject(error)
    }
);

export function get(url, params = {}) {
    return new Promise((resolve, reject) => {
        axios.get(url, {
            params
        }).then((response) => {
            // landing(url, params, response.data);
            resolve(response.data);
        })
            .catch((error) => {
                reject(error);
            });
    });
}


