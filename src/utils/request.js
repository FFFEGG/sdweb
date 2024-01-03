import { Modal,Notification } from "@douyinfe/semi-ui";
import axios from "axios";
import pinyin from "pinyin";
import { toast } from 'react-toastify';
// import {Toast as toast} from "@douyinfe/semi-ui";

import 'react-toastify/dist/ReactToastify.css';


axios.defaults.timeout = 100000;
axios.defaults.baseURL = "http://sdapiweb.sanrangas.com/";
// axios.defaults.baseURL = "http://127.0.0.1/";
// axios.defaults.baseURL = "http://srsdapi.test/";
const token = localStorage.getItem('token') ||
    ''
// var modal = {};

axios.interceptors.request.use(
    (config) => {

        if (config.data?.url != 'Srapp.Web_SystemInfo.GetWorkDepdeliverymanList'
            && config.data?.url != 'Srapp.Web_HomePageInformation.GetBasicOverviewOfUserGroups'
            && config.data?.url != 'Srapp.Web_HomePageInformation.GetTotalOrderGoodsDistributionTime'
            && config.data?.url != 'Srapp.Web_HomePageInformation.GetTotalSalesSecurityCheck'
            && config.data?.url != 'Srapp.Web_HomePageInformation.GetWorkDepdeliverymanList'
            && config?.url != 'http://116.10.197.126:8600/company/bind'
            && config?.url != '/api/GetComDepartmentList'
            && config?.url != '/api/getInitData'
        ) {
            // console.log('config', config)
            const modalid = Modal.info()
            config.modalid = modalid
            // console.log('modal', modal)
            // 弹出Toast提示
            modalid.update({
                title: '数据加载中...',
                content: '正在请求接口,请稍等...',

                footer: null,
                centered: true,
                bodyStyle: {
                    paddingBottom: 50,
                    borderRadius: 0,
                },
                maskClosable: false
            });

        }


        config.data = JSON.stringify(config.data);
        config.headers = {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem('token')}`
        };
        return config;
    }, (error) => Promise.reject(error)
);
const codeMessgae = {
    200: '服务器成功返回请求的数据。',
    201: '新建数据成功。',
    202: '一个请求已经静如后台排队（异步任务）。',
    204: '处理成功。',
    400: '发出的请求有错误。'
}


function getInitials(chineseText) {
    const pinyinTextArray = pinyin(chineseText, { style: 'normal' });
    // console.log(pinyinTextArray)
    const initials = pinyinTextArray[0][0];
    return initials.toUpperCase().substring(0, 1);
}


axios.interceptors.response.use(
    (response) => {
        // console.log(response.config.data.url, modal)
        console.log('response', response)
        if (response.config.modalid) {
            response.config.modalid.destroy();
        }
        // 关闭Toast提示
        // const url = JSON.parse(response.config.data).url
        // modal[url].destroy();


        if (response.data.errCode === 2) {
            console.log("过期");
        }

        // Check if the updateKey has changed
        if (response.data.rew && response.data.rew.updatekey) {
            const currentUpdateKey = localStorage.getItem('updatekey');
            if (currentUpdateKey !== response.data.rew.updatekey) {
                localStorage.setItem('updatekey', response.data.rew.updatekey);
                // localStorage.removeItem('initData', [])
                // Fetch new initData and store it in localStorage
                axios.post('/api/getInfo', {
                    url: 'Srapp.Web_SystemInfo.InitInfos',
                    recordtimestamp: localStorage.getItem('init_timestamp'),
                }, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    }
                }).then((initDataResponse) => {
                    console.log('initDataResponse', initDataResponse)
                    if (initDataResponse.data.data) {

                        let old_initData = JSON.parse(localStorage.getItem('initData'))
                        let new_initData = initDataResponse.data.data
                        let initData_arr = {}
                        initData_arr = {
                            ...old_initData,
                            ...new_initData
                        }


                        initData_arr.DepartmentList = initData_arr.DepartmentList.map(item => {
                            item.label = getInitials(item.name) + item.name

                            return item
                        })
                        initData_arr.DepartmentList.sort((a, b) => {
                            return a.label.charCodeAt() - b.label.charCodeAt()
                        })

                        localStorage.setItem('initData', JSON.stringify(initData_arr))
                        localStorage.setItem('init_timestamp', initDataResponse.data.data.timestamp);

                        // localStorage.setItem('initData', JSON.stringify(initDataResponse.data));
                    }
                })
                    .catch((error) => {
                        console.log('error', error)
                        // 关闭Toast提示
                        if (error.config?.modalid) {
                            error.config?.modalid.destroy();
                        }
                        console.error('Error fetching initData:', error);
                    });

                // axios.post('/api/getInitData')
                //     .then((initDataResponse) => {
                //         console.log('initDataResponse', initDataResponse)
                //         if (initDataResponse.data) {
                //             let initData_arr = initDataResponse.data

                //             initData_arr.DepartmentList = initData_arr.DepartmentList.map(item => {
                //                 item.label = getInitials(item.name) + item.name

                //                 return item
                //             })
                //             initData_arr.DepartmentList.sort((a, b) => {
                //                 return a.label.charCodeAt() - b.label.charCodeAt()
                //             })

                //             localStorage.setItem('initData', JSON.stringify(initData_arr))

                //             // localStorage.setItem('initData', JSON.stringify(initDataResponse.data));
                //         }
                //     })
                //     .catch((error) => {
                //         console.log('error', error)
                //         // 关闭Toast提示
                //         if (error.config?.modalid) {
                //             error.config?.modalid.destroy();
                //         }
                //         console.error('Error fetching initData:', error);
                //     });
            }
        }



        return response;
    },
    async (error) => {
        console.log('error', error)
        if (error.config?.modalid) {
            error.config.modalid.destroy();
        }
        const { response } = error;
        let errorText = ''

        if (error === undefined || error.code === 'ECONNABORTED') {
            // toast.error('服务请求超时')
            return Promise.reject(error)
        }

        if (response?.status === 501 || response?.status === 507 || response?.status === 500) {

            const text = await response.data

            if (response?.status === 500) {
                errorText = '登录失效，请重新登录'
                // localStorage.removeItem('expire_time')
                // window.location.href = '/login'
            } else {
                errorText = text.rew.data.tips;
            }
        } else {
            errorText = response?.data.tips;
        }
        if (response?.config.url !== '/api/getInitData') {
            // toast.error(errorText, {
            //     position: "top-right",
            //     autoClose: 3000,
            //     hideProgressBar: false,
            //     closeOnClick: true,
            //     pauseOnHover: true,
            //     draggable: true,
            //     progress: undefined
            // });
        } else if (window.location.pathname !== '/login') {

            toast.error(errorText, {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            })
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

export function post(url, data) {
    // data.headers
    // console.log('shengyu',)
    if (localStorage.getItem('expire_time') && new Date().getTime() > (localStorage.getItem('expire_time') * 1000)) {
        // toast.error('登录失效，请重新登录')
        // localStorage.removeItem('expire_time')
        // window.location.href = '/login'
        // 刷新token
        axios.post('/api/getInfo', {
            url: 'Srapp.Web_Auth.RefreshToken',
            refresh_token: localStorage.getItem('refresh_token'),
        }, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            }
        }).then((rew) => {
            try {
                localStorage.setItem('token', rew.data.data.info.token)

                localStorage.setItem('refresh_token', rew.data.data.info.refresh_token)
                localStorage.setItem('expire_time', rew.data.data.info.expire_time)
                localStorage.setItem('refresh_token_expires', rew.data.data.info.refresh_token_expires)

            } catch (e) {
                console.log('出错信息',e)
                Notification.info({
                    title: '提示',
                    content: '登录失效，请重新登录',
                    duration: 0,
                    zIndex: 9999,
                });

            }


        })

    }
    return new Promise((resolve, reject) => {
        for (const i in data) {
            //如果参数是字符串就去空 trim
            if (typeof data[i] === 'string') {
                data[i] = data[i].trim();
                //去掉字符串中的\u0000
                data[i] = data[i].replace(/\u0000/g, '');
            }

            // data[i] = data[i].toString().trim();
        }
        console.log('提交参数data', data)
        axios.post(url, data).then(
            (response) => resolve(response.data),
            (err) => {
                reject(err);
            }
        );
    });
}

export function patch(url, data = {}) {

    return new Promise((resolve, reject) => {
        axios.patch(url, data).then(
            (response) => {
                resolve(response.data);
            },
            (err) => {

                reject(err);
            }
        );
    });
}


export function put(url, data = {}) {
    return new Promise((resolve, reject) => {
        axios.put(url, data).then(
            (response) => {
                resolve(response.data);
            },
            (err) => {

                reject(err);
            }
        );
    });
}

export default function (fecth, url, param) {

    return new Promise((resolve, reject) => {
        switch (fecth) {
            case "get":
                console.log("begin a get request,and url:", url);
                get(url, param)
                    .then((response) => {
                        resolve(response);
                    })
                    .catch((error) => {
                        console.log("get request GET failed.", error);
                        reject(error);
                    });
                break;
            case "post":
                post(url, param)
                    .then(async (response) => {
                        // console.log('allinfo',response.rew.updatekey)
                        // if (!localStorage.getItem('updatekey') && response.rew) {
                        //     // console.log('allinfo',response.rew.updatekey)
                        //     if (response.rew.updatekey) {
                        //         localStorage.setItem('updatekey', response.rew.updatekey)
                        //     }

                        // } else {
                        //     if (response && response.rew && response.rew.updatekey) {
                        //         if (localStorage.getItem('updatekey') !== response.rew.updatekey) {
                        //             localStorage.removeItem('updatekey')
                        //             // window.location.href = '/login'
                        //             const rew = await post('/api/getInitData')
                        //             // console.log('getInitData',rew)
                        //             localStorage.setItem('initData', JSON.stringify(rew))
                        //         }
                        //     }
                        // }


                        resolve(response);
                    })
                    .catch((error) => {
                        console.log("get request POST failed.", error);
                        console.log("get request POST failed.", error.response);

                        if (error != 'Error: Network Error' && error.response?.status !== 401 && error.response?.status !== 500) {

                            if (error.response?.status === 400) {
                                // console.log("登录失效", error.response);
                                toast.error(`${error.response?.data.tips}`)
                            } else {
                                toast.error(`接口错误 ${error.response?.data.rew?.msg}`)
                            }


                        }

                        if (error.response?.status === 401) {
                            console.log("登录失效", error.response);


                            // Modal.confirm({
                            //     title: '接口出错',
                            //     content: `${error.response?.data?.rews?.tips}`,
                            //     okText: '确认',
                            //     cancelText: '取消',
                            //     onOk: () => {
                            //         localStorage.removeItem('refresh_token_expires')
                            //         localStorage.removeItem('refresh_token')
                            //         localStorage.removeItem('initData')
                            //         localStorage.removeItem('expire_time')
                            //         localStorage.removeItem('userinfo')
                            //         localStorage.removeItem('token')
                            //         window.location.href = '/login'
                            //     }
                            // });

                            // window.location.href = '/login'
                        }




                        reject(error);
                    });
                break;
            default:
                break;
        }
    });
}

function msag(err) {
    if (err && err.response) {
        switch (err.response.status) {
            case 400:
                alert(err.response.data.error.details);
                break;
            case 401:
                alert("未授权，请登录");
                break;

            case 403:
                alert("拒绝访问");
                break;

            case 404:
                alert("请求地址出错");
                break;

            case 408:
                alert("请求超时");
                break;

            case 500:
                alert("服务器内部错误");
                break;

            case 501:
                alert("服务未实现");
                break;

            case 502:
                alert("网关错误");
                break;

            case 503:
                alert("服务不可用");
                break;

            case 504:
                alert("网关超时");
                break;

            case 505:
                alert("HTTP版本不受支持");
                break;
            default:
        }
    }
}
