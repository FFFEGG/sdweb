import React, { useEffect, useRef, useState } from 'react';
import { Box, Button } from "@mui/material";
import WeatherTable from "../comments/WeatherTable";
import { Form } from "@douyinfe/semi-ui";
import request from "../../utils/request";
import LunarHolidays from "../comments/LunarHolidays";
import moment from "moment";
import LastLunarHolidays from "../comments/LastLunarHolidays";
import axios from 'axios';



const GetSalesKit = () => {
    const [weather_info, setWeather_info] = React.useState([]);
    const [day, setDay] = React.useState(0);
    const [now, setNow] = React.useState([]);
    const [last, setLast] = React.useState([]);


    const getSum = (arr, goodsname, company) => {


        //液化气公司集合
        let yhq_arr = ['零售气商业','零售气家庭', '商用气公司']
        //零售气公司集合
        let lsq_jt = ['零售气家庭']
        let lsq_sy = ['零售气商业']
        //商用气公司集合
        let syq_arr = ['商用气公司']
        //拓展部集合
        let tz_arr = ['拓展部']


        let sum = 0;
        if (company === '液化气公司') {
            // 计算全部
            arr.forEach(item => {
                if (item.goodsname === goodsname && yhq_arr.includes(item.attributiondepartment)) {
                    sum += (item.num * 1)
                }
            })
        }

        if (company === '零售气家庭') {
            // 计算零售气公司
            arr.forEach(item => {
                if (item.goodsname === goodsname && lsq_jt.includes(item.attributiondepartment)) {
                    sum += (item.num * 1)
                }
            })
        }

        if (company === '零售气商业') {
            // 计算零售气公司
            arr.forEach(item => {
                if (item.goodsname === goodsname && lsq_sy.includes(item.attributiondepartment)) {
                    sum += (item.num * 1)
                }
            })
        }


        if (company === '商用气公司') {
            // 计算商用气公司
            arr.forEach(item => {
                if (item.goodsname === goodsname && syq_arr.includes(item.attributiondepartment)) {
                    sum += (item.num * 1)
                }
            })
        }

        if (company === '拓展部') {
            // 计算拓展部
            arr.forEach(item => {
                if (item.goodsname === '12KG液化气(代)' && tz_arr.includes(item.attributiondepartment)) {
                    sum += (item.num * 1)
                }
            })
        }


        if (company === '水公司') {
            // 计算水部
            arr.forEach(item => {
                if (item.goodsname === goodsname) {
                    sum += (item.num * 1)
                }
            })
        }


        return sum

    }
    const [f1, setF1] = React.useState('');
    const [lastf1, setlastF1] = React.useState('');
    const api = useRef()

    function getDayCn(year, month, date) {
        // 把calendar文件中的calendar对象挂在了window对象上，通过属性调用calendar
        // 这样不会更改源文件
        let dayCn = window.calendar.solar2lunar(year, month, date);
        let result = '';

        if (dayCn.IDayCn == '初一') { //如果是月初的话，换成这个月的名字
            result = dayCn.IMonthCn;
        } else if (dayCn.Term) { //如果有节气的话，换成节气
            result = dayCn.Term;
        } else if (dayCn.festival) { //如果有节日的话，换成节日
            result = dayCn.festival;
        } else if (dayCn.lunarFestival) { //如果有中国传统的节日的话，换成传统节日（春节、元宵节、端午节）
            result = dayCn.lunarFestival;
        } else {
            result = dayCn.IDayCn; //都没有的话就是农历
        }
        return result;
    }
    return (
        <div>
            <Box p={3} bgcolor={'white'} borderRadius={1}>
                <Box>ctrl+ (-/+) 放大缩小页面截图</Box>
                <Form getFormApi={e => api.current = e} layout={'horizontal'} labelPosition={'inset'} onSubmit={async e => {
                    let today = e.time //今天 2023-04-12
                    //获取去年同一天
                    let lastYear = e.last

                    setWeather_info([])

                    fetch('https://ali-weather.showapi.com/area-to-weather?area=南宁', {
                        headers: {
                            'Authorization': 'APPCODE 80b7ab1c583b4405966d5a04efa406d3'
                        }
                    }).then(res => res.json())  // 解析返回的数据为JSON
                        .then(data => {
                            // console.log('data', data);  // 打印解析后的数据
                            setF1(data.showapi_res_body.f1)
                        })
                        .catch(error => {
                            console.error('Error fetching data:', error);
                        });

                    // fetch('https://ali-weather.showapi.com/weatherhistory?area=南宁&month=' + moment(today).format('YYYYMM'), {
                    //     headers: {
                    //         'Authorization': 'APPCODE 80b7ab1c583b4405966d5a04efa406d3'
                    //     }
                    // }).then(res => res.json())  // 解析返回的数据为JSON
                    //     .then(data => {
                    //         console.log('data', data.showapi_res_body.list.filter(item => item.time == moment(today).format('YYYYMMDD')));  // 打印解析后的数据
                    //         // setF1(data.showapi_res_body.f1)
                    //         // [
                    //
                    //         // ]
                    //         setF1(data.showapi_res_body.list.filter(item => item.time == moment(today).format('YYYYMMDD'))[0])
                    //     })
                    //     .catch(error => {
                    //         console.error('Error fetching data:', error);
                    //     });

                    //
                    //
                    fetch('https://ali-weather.showapi.com/weatherhistory?area=南宁&month=' + moment(lastYear).format('YYYYMM'), {
                        headers: {
                            'Authorization': 'APPCODE 80b7ab1c583b4405966d5a04efa406d3'
                        }
                    }).then(res => res.json())  // 解析返回的数据为JSON
                        .then(data => {
                            console.log('data', data.showapi_res_body.list.filter(item => item.time == moment(lastYear).format('YYYYMMDD')));  // 打印解析后的数据
                            // setF1(data.showapi_res_body.f1)
                            // [

                            // ]
                            setlastF1(data.showapi_res_body.list.filter(item => item.time == moment(lastYear).format('YYYYMMDD'))[0])
                        })
                        .catch(error => {
                            console.error('Error fetching data:', error);
                        });



                    const today_arr = await request('post', '/api/getInfo', {
                        url: 'Srapp.Web_SystemInfo.GetSalesKit',
                        date: today
                    })

                    setNow(today_arr.data.info)
                    const lastYear_arr = await request('post', '/api/getInfo', {
                        url: 'Srapp.Web_SystemInfo.GetSalesKit',
                        date: lastYear
                    })
                    setLast(lastYear_arr.data.info)

                }}>
                    <Form.Input field={'time'} label={'日期'} type={'date'} initValue={moment().format('YYYY-MM-DD')} />
                    <Form.Input field={'last'} label={'去年'} type={'date'} initValue={
                    //去年今天
                    moment().subtract(1, 'year').format('YYYY-MM-DD')
                    } />
                    <Button size={'small'} type={'submit'} variant={'outlined'}>查询</Button>
                </Form>


                <Box mt={1}>
                    <table className={'my-table'}>
                        <thead>
                            <tr>
                                <th colSpan={5}>销售简报</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td colSpan={3}>日期</td>

                                <td>
                                    {
                                        moment(api?.current?.getValue('time')).format('YYYY年MM月DD日')
                                    }
                                </td>
                                <td>
                                    {moment(api?.current?.getValue('last')).format('YYYY年MM月DD日')}
                                </td>
                            </tr>
                            <tr>
                                <td colSpan={3}>天气</td>
                                <td>
                                    {f1 ? (
                                        `${f1.night_air_temperature}~${f1.day_air_temperature}℃ ${f1.day_weather} ${f1.day_wind_direction} ${f1.day_wind_power}`
                                    ) : ''}

                                </td>
                                <td>

                                    {
                                        lastf1 && `${lastf1.min_temperature}~${lastf1.max_temperature}℃ ${lastf1.weather} ${lastf1.wind_direction} ${lastf1.wind_power} `
                                    }
                                </td>
                            </tr>
                            <tr>
                                <td rowSpan={4}>12KG液化气</td>
                                <td colSpan={2}>液化气公司</td>
                                <td>{getSum(now, '12KG液化气', '液化气公司')}</td>
                                <td>{getSum(last, '12KG液化气', '液化气公司')}</td>
                            </tr>
                            <tr>
                                <td rowSpan={3}>其中</td>
                                <td>零售气家庭</td>
                                <td>{getSum(now, '12KG液化气', '零售气家庭')}</td>
                                <td>{getSum(last, '12KG液化气', '零售气家庭')}</td>

                            </tr>
                            <tr>
                                <td>零售气商业</td>
                                <td>{getSum(now, '12KG液化气', '零售气商业')}</td>
                                <td>{getSum(last, '12KG液化气', '零售气商业')}</td>

                            </tr>
                            <tr>
                                <td>商用气公司</td>
                                <td>{getSum(now, '12KG液化气', '商用气公司')}</td>
                                <td>{getSum(last, '12KG液化气', '商用气公司')}</td>

                            </tr>
                            <tr>
                                <td>45KG液化气</td>
                                <td colSpan={2}>商用气公司</td>
                                <td>{getSum(now, '45KG液化气', '商用气公司')}</td>
                                <td>{getSum(last, '45KG液化气', '商用气公司')}</td>

                            </tr>
                            <tr>
                                <td>12KG液化气</td>
                                <td colSpan={2}>拓展部</td>
                                <td>{getSum(now, '12KG液化气', '拓展部')}</td>
                                <td>{getSum(last, '12KG液化气', '拓展部')}</td>

                            </tr>
                            <tr>
                                <td>桶装水</td>
                                <td colSpan={2}>水公司</td>
                                <td>{getSum(now, '桶装水', '水公司')}</td>
                                <td>{getSum(last, '桶装水', '水公司')}</td>
                            </tr>
                            {/*<tr>*/}
                            {/*    <td>支装水</td>*/}
                            {/*    <td colSpan={2}>水公司</td>*/}
                            {/*    <td>{getSum(now, '支装水', '水公司')}</td>*/}
                            {/*    <td>{getSum(last, '支装水', '水公司')}</td>*/}
                            {/*</tr>*/}
                        </tbody>
                    </table>
                </Box>
                <Box display={'flex'} border={1} p={3} mt={3}>
                    <LunarHolidays />
                    <LastLunarHolidays />
                </Box>

            </Box>


        </div>
    );
};

export default GetSalesKit;
