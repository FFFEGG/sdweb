import { useSelector, Provider } from 'react-redux';

import { ThemeProvider } from '@mui/material/styles';
import {Box, Button, CssBaseline, StyledEngineProvider} from '@mui/material';

// routing
import Routes from 'routes';

// defaultTheme
import themes from 'themes';

import mystore from './mystore'
import { useNavigate } from 'react-router-dom'
// project imports
import NavigationScroll from 'layout/NavigationScroll';
import { useLocation } from "react-router";
import request from "./utils/request";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";

// ==============================|| APP ||============================== //
import loading from 'assets/images/icons/loading.gif'
import axios from "axios";
import { Modal,Notification } from '@douyinfe/semi-ui';
import pinyin from 'pinyin';
import moment from 'moment';
import UserBasicInfoSearch from "./views/pages/users/UserBasicInfoSearch";


const App = (props) => {

    const navigate = useNavigate()
    const customization = useSelector((state) => state.customization);
    const url = useLocation();
    const [state, setState] = useState(false)
    const [timer, settime] = useState(0)
    const [ldtel,setldtel] = useState(localStorage.getItem('ldtel'))

    function getInitials(chineseText) {
        const pinyinTextArray = pinyin(chineseText, { style: 'normal' });
        // console.log(pinyinTextArray)
        const initials = pinyinTextArray[0][0];
        return initials.toUpperCase().substring(0, 1);
    }

    function constructItem(item, key) {
        return {
            label: item[0].type || item[0].material || item[0].department,
            value: item[0].id,
            key: item[0].type || item[0].material || item[0].department,
            children: item.map(detail => ({
                label: detail.name,
                value: detail[key],
                key: detail.id
            }))
        };
    }

    function constructDataStructure(rawData, key) {
        const result = [];
        for (const i in rawData) {
            if (Object.hasOwnProperty.call(rawData, i)) {
                const element = rawData[i];
                // console.log('商品', element)
                // constructItem(element)
                result.push(constructItem(element, key));
            }
        }
        return result;
    }


    function transformToTree(departments, parentId, key) {
        let tree = [];
        departments.forEach(department => {
            if (department.fid == parentId) {
                const children = transformToTree(departments, department.id, key);
                // console.log(department[key])
                const new_value = department[key]
                tree.push({
                    label: department.name,
                    value: new_value,
                    key: department.id,
                    children: children
                })
            }
        });
        return tree;
    }
    function groupby(arr, key) {
        const map = {};
        arr.forEach(item => {
            const k = item[key];
            if (!map[k]) {
                map[k] = [];
            }
            map[k].push(item);
        });
        return map;
    }
    const loginuser = JSON.parse(localStorage.getItem('userinfo'))

    useEffect(async () => {
        const initData = JSON.parse(localStorage.getItem('initData'))




        if ((!initData || initData.length == 0) && url.pathname !== '/login') {
            request("post", '/api/getInfo', {
                url: 'Srapp.Web_SystemInfo.InitInfos'
            }).then(rew => {
                // console.log(rew)

                if (rew.Goods !== undefined && url.pathname !== '/login') {
                    toast.error('登录失效,请重新登录')
                } else {
                    let initData_arr = rew.data
                    if (initData_arr && url.pathname !== '/login') {
                        localStorage.setItem('init_timestamp', initData_arr.timestamp)
                        initData_arr.DepartmentList = initData_arr?.DepartmentList?.map(item => {
                            item.label = getInitials(item.name) + item.name

                            return item
                        })
                        initData_arr?.DepartmentList?.sort((a, b) => {
                            return a.label.charCodeAt() - b.label.charCodeAt()
                        })

                        const new_department = transformToTree(initData_arr.DepartmentList, 0, 'id');
                        const new_department_byname = transformToTree(initData_arr.DepartmentList, 0, 'name');


                        const new_goodslist = groupby(initData_arr.GoodsList, 'type');

                        const new_arr_goods = constructDataStructure(new_goodslist, 'id');
                        const new_arr_goods_byname = constructDataStructure(new_goodslist, 'name');

                        const new_PackingtypeList = constructDataStructure(groupby(initData_arr.PackingtypeList, 'material'), 'id');
                        const new_PackingtypeList_byname = constructDataStructure(groupby(initData_arr.PackingtypeList, 'material'), 'name');
                        const new_Opelist = constructDataStructure(groupby(initData_arr.OperatorList.filter(item => item.department.includes('商用') && item.name != '一级'), 'department'), 'name');


                        new_department_byname[0].children.push({
                            label: '配送部(单选)',
                            value: '配送部',
                            key: '配送部',
                            children: []
                        })
                        new_department_byname[0].children.push({
                            label: '信息中心(单选)',
                            value: '信息中心',
                            key: '信息中心',
                            children: []
                        })

                        new_department[0].children.push({
                            label: '配送部(单选)',
                            value: '24',
                            key: '配送部24',
                            children: []
                        })

                        new_department[0].children.push({
                            label: '信息中心(单选)',
                            value: '1',
                            key: '信息中心1',
                            children: []
                        })




                        localStorage.setItem('initData', JSON.stringify(initData_arr))
                        localStorage.setItem('new_department', JSON.stringify(new_department))
                        localStorage.setItem('new_department_byname', JSON.stringify(new_department_byname))


                        localStorage.setItem('new_goodslist', JSON.stringify(new_arr_goods))
                        localStorage.setItem('new_goodslist_byname', JSON.stringify(new_arr_goods_byname))
                        localStorage.setItem('new_PackingtypeList', JSON.stringify(new_PackingtypeList))
                        localStorage.setItem('new_PackingtypeList_byname', JSON.stringify(new_PackingtypeList_byname))
                        localStorage.setItem('new_Opelist', JSON.stringify(new_Opelist))


                    }


                    setState(true)
                }

            })
        } else {
            setState(true)
        }


        if (url.pathname === '/login') {

            setState(true)
        } else {
            connect()
            //获取配送员信息
            // const rew = await request('post', '/api/getInfo', {
            //     url: 'Srapp.Web_SystemInfo.GetWorkDepdeliverymanList'
            // })
            // localStorage.setItem('deliveryman', JSON.stringify(rew.data.info))
        }
        // 定时器 15s
        const timer = setInterval(() => {
            settime(timer => timer + 1)
        }, 1000)


        return () => {
            clearInterval(timer)
        }   // 清除定时器




    }, [])

    const [ids, setIds] = useState([]);
    const connect = () => {
        const loginuser = JSON.parse(localStorage.getItem('userinfo'))
        // console.log(11111)
        const ws = new WebSocket("ws://116.10.197.126:7272");

        ws.onopen = () => {
            console.log("Connected to WebSocket server");
            // this.setState({ ws });
        };

        ws.onmessage = (event) => {
            // console.log("Received message:", event.data);
            const data = JSON.parse(event.data);
            // console.log(data)
            if (data.type) {
                switch (data.type) {
                    case 'init':
                        axios.post('http://116.10.197.126:8600/company/bind', {
                            id: '8888',
                            client_id: data.client_id,
                        })
                        break;
                    case 'call':
                        // data.content.seatno == localStorage.getItem('seatno') &&
                        if (data.content.seatno == localStorage.getItem('seatno') && loginuser?.login_department == '预约中心') {
                            // if (data.content.seatno) {
                            //记录来电号码到本地 时间 电话 数组形式 倒序排序
                            const call_arr = JSON.parse(localStorage.getItem('call_arr')) || []
                            // 加在数组最前面
                            call_arr.unshift({
                                time: moment().format('YYYY-MM-DD HH:mm:ss'),
                                tel: data.content.telephone
                            })
                            localStorage.setItem('call_arr', JSON.stringify(call_arr))
                            setldtel(data.content.telephone)
                            localStorage.setItem('ldtel', data.content.telephone)
                            //最多记录100条 然后删除第一条 重新保存到本地
                            if (call_arr.length > 100) {
                                call_arr.pop()
                                localStorage.setItem('call_arr', JSON.stringify(call_arr))

                            }



                            //如果当前页面是department/DepartmentUserOrderInfo 不弹窗
                            if (url.pathname == '/department/DepartmentUserOrderInfo') {
                                return false
                            }

                            Notification.info({
                                title: '来电提醒',
                                content: (
                                    <div>
                                        <p>来电号码：{data.content.telephone}</p>
                                        <p>坐席：{data.content.seatno}</p>
                                        <div style={{ marginTop: 8 }}>
                                            <Button variant={'outlined'} onClick={()=> {
                                                navigate('/users/VagueQueryUserInfo?tel=' + data.content.telephone)
                                                // localStorage.setItem('ldtel', data.content.telephone)
                                                // localStorage.setItem('ldtime', new Date().getTime())
                                                // let idsTmp = [...ids];
                                                // Notification.close(idsTmp.shift());
                                                // setIds(idsTmp);
                                            }}>查看详情</Button>

                                        </div>
                                    </div>
                                ),

                                theme: 'light',
                                duration: 0,
                                showClose: true,
                                position: 'bottomRight',
                                zIndex: 99999999

                            })
                            // setIds([...ids, id]);
                        }



                        break;
                    case '推送消息':
                        if (loginuser?.login_department == '客服中心') {
                            return false
                        }
                        if (loginuser?.login_department === data.department) {

                            //如果当前页面是department/DepartmentUserOrderInfo 不弹窗
                            if (url.pathname == '/department/DepartmentUserOrderInfo') {
                                return false
                            }
                            if (data.department == '预约中心') {
                                if (localStorage.getItem('seatno') != data.seatno) {
                                    return false
                                }
                            }

                            Modal.info({
                                title: data.title,
                                content: (
                                    <div>
                                        <p>门店: {data.department}</p>
                                    </div>
                                ),
                                onOk() {
                                    //console.log()
                                    if (data.title == '用户请求绑定提醒') {
                                        navigate('/other/GetUserApplyBindingSnsRecord')
                                    } else {
                                        navigate('/order/OtherServicesOrderList')
                                    }

                                },
                            })
                        }

                        break;
                    case 'plan':
                        // that.planlist = (data.list)
                        break;
                    case 'ping':
                        ws.send('pong')
                        break;
                }
            }
        };

        ws.onclose = () => {
            console.log("Disconnected from WebSocket server");
            // setTimeout(() => this.connect(), 1000);
        };

        ws.onerror = (error) => {
            console.error("WebSocket error:", error);
        };
    }
    const [lastDPress, setLastDPress] = useState(null);
    const [showmenu,setshowmenu] = useState(false);

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'd' || event.key === 'D') {
                const now = Date.now();
                if (lastDPress && now - lastDPress < 500) { // 500毫秒内的连续两次按下
                    // console.log('Double "d" key pressed!');
                    setLastDPress(null); // 重置
                    setshowmenu(true)
                } else {
                    setLastDPress(now);
                }
            } else if (event.key === 'q' || event.key === 'Q') {
                const now = Date.now();
                if (lastDPress && now - lastDPress < 500) { // 500毫秒内的连续两次按下

                    setLastDPress(null); // 重置
                    // 返回上一页
                    window.history.back()
                    setshowmenu(false)
                } else {
                    setLastDPress(now);
                }
            } else if (event.key === 'w' || event.key === 'W') {
                const now = Date.now();
                if (lastDPress && now - lastDPress < 500) { // 500毫秒内的连续两次按下
                    setshowmenu(false)
                    setLastDPress(null); // 重置
                    // 返回前一页
                    window.history.forward()

                } else {
                    setLastDPress(now);
                }
            } else if (event.key === 'Escape') { // 检查是否按下了ESC键
                setshowmenu(false)
            } else if (event.key === '1' && showmenu ) {

                    navigate('/users/UserBasicInfo?tab=1')
                    setshowmenu(false)


            } else if (event.key === '2' && showmenu ) {

                    navigate('/order/OrderList')
                    setshowmenu(false)


            }  else if (event.key === '4' && showmenu ) {

                    navigate('/order/OtherServicesOrderList')
                    setshowmenu(false)


            }  else if (event.key === '5' && showmenu ) {

                    navigate('/department/DepartmentUserOrderInfo')
                    setshowmenu(false)


            }  else if (event.key === '6' && showmenu ) {

                    navigate('/users/RetreatUserPackingtypeMaterial')
                    setshowmenu(false)


            } else if (event.key === '7' && showmenu ) {

                    navigate('/users/RetreatUserPackingtypeMoney')
                    setshowmenu(false)


            } else if (event.key === '8' && showmenu ) {

                    navigate('/users/business')
                    setshowmenu(false)


            } else if (event.key === '3' && showmenu ) {


                    Modal.info({
                        title: '会员信息查询',

                        content: <div style={{overflow: 'scroll',height: '70vh'}}>
                            <UserBasicInfoSearch userid={localStorage.getItem('search_memberid')} />
                        </div>,
                        size: 'large',
                        icon: '',
                        footer: <></>,

                        style:{width: '85vw'}
                    })


                    setshowmenu(false)


            }
            // console.log('key pressed!' + event.key );
        };

        window.addEventListener('keydown', handleKeyDown);

        // 清除函数：组件卸载时移除事件监听器
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [lastDPress,showmenu]); // 空依赖数组确保事件监听器只添加一次

    return (
        state ? <StyledEngineProvider injectFirst>
                {
                    showmenu ? <div  >
                        <div className={'overlay'} onClick={()=>setshowmenu(false)}></div>
                        <div className={'popule'}>
                            <div className={'popule-item'} style={{display:'flex',fontSize:30,justifyContent:'space-between',marginBottom: 20}}>
                                <div>[后退]双击Q</div>
                                <div>双击W[前进]</div>
                            </div>
                            <div className={'popule-item'}>按数字键跳转对应菜单</div>
                            <div className={'popule-item'}>1，预约下单</div>
                            <div className={'popule-item'}>2，安排订单</div>
                            <div className={'popule-item'}>3，会员查询（弹窗）</div>
                            <div className={'popule-item'}>4，门店业务</div>
                            <div className={'popule-item'}>5，订单监控</div>
                            <div className={'popule-item'}>6，退物资</div>
                            <div className={'popule-item'}>7，退款</div>
                            <div className={'popule-item'}>8，办理抵押物</div>
                        </div>
                    </div>:''
                }
                {
                    (loginuser?.login_department == '预约中心') ? <h2 style={{color: 'red',position: 'fixed', top: '2%',right: 400,zIndex:999999}}>来电电话: { ldtel }</h2>
                        : ''
                }
            <ThemeProvider theme={themes(customization)}>
                <CssBaseline />


                <NavigationScroll>
                    <Routes cache />
                </NavigationScroll>


            </ThemeProvider>
        </StyledEngineProvider>
            : <div>
                <h2
                >系统加载中 {
                        timer <= 15 ? timer + 's' :
                            <span>
                                {timer + 's'}
                                <a onClick={() => {
                                    window.location.href = '/login'
                                }} style={{ color: 'blue', borderBottom: 1 }}>点击刷新</a>
                            </span>

                    }</h2>
                <div style={{ textAlign: 'center', marginTop: '20%' }}>
                    <img src={loading} alt="loading" />
                </div>
            </div>
    );
    // return <StyledEngineProvider injectFirst>
    //     <ThemeProvider theme={themes(customization)}>
    //         <CssBaseline />
    //         <NavigationScroll>
    //             <Routes cache />
    //         </NavigationScroll>
    //
    //
    //     </ThemeProvider>
    // </StyledEngineProvider>
};

export default App;
