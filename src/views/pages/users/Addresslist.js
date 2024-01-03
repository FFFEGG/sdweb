import React, { useEffect, useState } from 'react';
import request from "../../../utils/request";
import { FormControl, InputLabel, MenuItem } from "@mui/material";
import { Select } from "@douyinfe/semi-ui";

const Addresslist = ({ setdepartment, userinfo, setValue, setaddress_info }) => {
    const [list, setList] = useState([])
    const [address, setaddress] = useState('')
    var ldtel = localStorage.getItem('ldtel')
    var ldtime = localStorage.getItem('ldtime')
    useEffect(async () => {
        if (!userinfo.userid) {
            return
        }
        // setValue('addressid', arr[0].id)
        // setdepartment(arr[0].department)
        // setValue('tel', arr[0].telephone)
        // setaddress_info(arr[0])
        // setValue('remarks', arr[0].remarks + userinfo.remarks)
        // setValue('ope_remarks', arr[0].ope_remarks + userinfo.ope_remarks)
        setaddress('')
        setValue('addressid', '')
        setdepartment('')
        setValue('tel', '')
        setaddress_info({})
        setValue('remarks', '')
        setValue('ope_remarks', '')




        const rew = await request('post', '/api/getInfo', {
            url: 'Srapp.Web_User_Infos.UserAddress',
            userid: userinfo.userid
        })
        if (rew.code === 200) {
            setList(rew.data)
            const arr = rew.data.filter(item => item.defaults === '是' && item.state === '正常')
            // console.log(arr)

            if (arr.length !== 0) {
                setaddress(arr[0].id)
                setValue('addressid', arr[0].id)
                setdepartment(arr[0].department)
                // console.log('ldtime',ldtime)
                // console.log('ldtel',ldtel)
                setValue('tel', arr[0].telephone)
                // if (!ldtime) {
                //     setValue('tel', arr[0].telephone)
                // } else {
                //     // ldtime 超过10s 则显示地址电话 否则显示ldtel
                //     if (!ldtime) {
                //         setValue('tel', arr[0].telephone)
                //     } else {
                //         setValue('tel', ldtel)
                //     }
                // }


                // setValue('tel', arr[0].telephone)
                setaddress_info(arr[0])
                setValue('remarks', arr[0].remarks + userinfo.remarks)
                setValue('ope_remarks', arr[0].ope_remarks + userinfo.ope_remarks)
            } else {
                if (rew.data.length != 0 ) {

                    const arr = rew.data[0]
                    setaddress(arr.id)
                    setValue('addressid', arr.id)
                    setdepartment(arr.department)
                    setValue('tel', arr.telephone)
                    // if (!ldtime) {
                    //     setValue('tel', arr[0].telephone)
                    // } else {
                    //     // ldtime 超过10s 则显示地址电话 否则显示ldtel
                    //     if (!ldtime) {
                    //         setValue('tel', arr.telephone)
                    //     } else {
                    //         setValue('tel', ldtel)
                    //     }
                    // }

                    setaddress_info(arr)
                    setValue('remarks', arr.remarks + userinfo.remarks)
                    setValue('ope_remarks', arr.ope_remarks + userinfo.ope_remarks)

                }
            }

        }
    }, [userinfo])


    return (
        <Select
            style={{ width: '100%', border: '1px solid #d9d9d9' }}
            placeholder="地址信息"
            size="large"
            filter
            value={address}
            onChange={(event) => {
                setaddress(event)
                setaddress_info(list.filter(item => item.id === event)[0])
                setValue('addressid', event)
                setValue('tel', list.filter(item => item.id === event)[0].telephone)
                setdepartment(list.filter(item => item.id === event)[0].department)
            }}
        >
            {
                list.filter(item => item.state == '正常').map(item => <Select.Option key={item.id} value={item.id}>{item.address}({item.floor + `楼`})</Select.Option>)
            }

        </Select>
    );
};

export default Addresslist;
