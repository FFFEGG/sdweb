import React, { useEffect, useRef, useState } from 'react';
import { connect } from "react-redux";
import {
    Box, Button,

    Typography
} from "@mui/material";
import UserInfo from "../UserInfo";

import {Button as Buttons, Form, Modal, Popconfirm, Upload} from "@douyinfe/semi-ui";
import request from "../../../../utils/request";
import { toast } from "react-toastify";
import myprint from 'utils/myprint';
import * as XLSX from "xlsx";
import {IconUpload} from "@douyinfe/semi-icons";


const CreateUserGoodsSalesMashup = ({ customization }) => {

    const initData = JSON.parse(localStorage.getItem('initData'))

    const loginuser = JSON.parse(localStorage.getItem('userinfo'))

    const [userinfo, setuserinfo] = useState('')

    const api = useRef('')

    useEffect(() => {
        setuserinfo(customization.user)

    }, [customization])

    const zgq = (data) => {
        // console.log(data)
        let arr = data.memberids

        for (let i = 0; i < arr.length; i++) {
            setTimeout(async () => {
                // 查询用户id
                const user = await request('post', '/api/getInfo', {
                    memberid: arr[i],
                    url: "Srapp.Web_User_Infos.UserBasicInfo"
                })
                const userid = user.data.userid


                const rew = await request('post', '/api/getInfo', {
                    url: 'Srapp.Web_BusinessProcessing_Handle.CreateUserGoodsSalesMashup',
                    userid: userid,
                    goodssalesmashupid: JSON.parse(data.goodssalesmashupid)['id'],
                    price: parseFloat(JSON.parse(data.goodssalesmashupid)['price']),
                    paymentstatus: data.paymentstatus,
                    payment: data.payment,
                    num: data.num,
                    remarks: data.remarks,
                })
                if (rew.data.msg === 'SUCCESS') {
                    toast.success(arr[i] + '办理成功')
                } else {
                    toast.error(rew.data.tips)
                }


            }, 1000 * i);
        }
    }

    return (
        <Box sx={{ width: '100%', background: '#FFF' }}>
            <Box p={3} bgcolor="#fff" borderRadius={1} overflow="scroll">
                <UserInfo userinfo={userinfo} />
            </Box>
            <Box p={3} paddingTop={0} bgcolor="#fff" borderRadius={1} overflow="scroll">
                <Form getFormApi={e => api.current = e} onSubmit={async e => {


                    if (e.memberids) {
                        zgq(e)
                        return
                    }





                    const rew = await request('post', '/api/getInfo', {
                        url: 'Srapp.Web_BusinessProcessing_Handle.CreateUserGoodsSalesMashup',
                        userid: userinfo.userid,

                        goodssalesmashupid: JSON.parse(e.goodssalesmashupid)['id'],
                        price: parseFloat(JSON.parse(e.goodssalesmashupid)['price']),
                        paymentstatus: e.paymentstatus,
                        payment: e.payment,
                        num: e.num,
                        remarks: e.remarks,


                    })
                    if (rew.data.msg === 'SUCCESS') {
                        toast.success('办理成功')
                        if (rew.data.printinfo && e.isprint) {
                            myprint(rew.data.printinfo)
                        }
                    } else {
                        toast.error(rew.data.tips)
                    }
                }}>
                    <Typography marginBottom={2} fontSize={20}>办理用户商品销售方案</Typography>
                    {
                        loginuser.login_department == '信息中心' ? <>
                            <Upload action="http://srsdapi.sanrangas.com/" onFileChange={e => {
                                // console.log(e);
                                const file = e[0];
                                const reader = new FileReader();
                                // reader.readAsText(file);
                                if (reader.readyState === FileReader.DONE || reader.readyState === FileReader.EMPTY) {
                                    reader.onload = function (event) {
                                        const data = new Uint8Array(event.target.result)
                                        const workbook = XLSX.read(data, { type: 'array' })
                                        const sheetName = workbook.SheetNames[0]
                                        const worksheet = workbook.Sheets[sheetName]
                                        const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 })

                                        const dataArray = []
                                        console.log(rows)
                                        for (let i = 1; i < rows.length; i++) {
                                            const row = rows[i]

                                            dataArray.push(row[1].toString())

                                        }
                                        // setgaslist(dataArray)
                                        // console.log(dataArray)
                                        api.current.setValue('memberids', dataArray)
                                    }

                                    reader.readAsArrayBuffer(file)
                                } else {
                                    console.log('FileReader is busy')
                                }

                            }}>
                                <Buttons icon={<IconUpload />} theme="light">
                                    点击上传
                                </Buttons>
                            </Upload>
                            <Form.TagInput field={'memberids'} label={'会员'} rules={[{ required: true }]} style={{ width: '100%' }} />
                        </> : ''
                    }

                    <Form.Select filter rules={[{ required: true }]}
                        onChange={e => {
                            // console.log(e)
                            api.current.setValue('price', JSON.parse(e)['price'])
                            api.current.setValue('paymentstatus', JSON.parse(e)['paymentstatus'])
                        }}
                        field='goodssalesmashupid'
                        label='捆绑销售方案'
                        style={{ width: '100%' }}>
                        {
                            initData.GoodsSalesMashupList.map(item =>
                                <Form.Select.Option key={item.id} value={JSON.stringify(item)}>{item.name}-￥{item.price}</Form.Select.Option>
                            )
                        }
                    </Form.Select>

                    <Form.Input field={'num'} label={'数量'} rules={[{ required: true }]} />
                    <Form.Select field='payment' initValue={'现金支付'} label='支付方式' rules={[{ required: true }]} style={{ width: '100%' }}>
                        <Form.Select.Option key={1} value="余额支付">余额支付</Form.Select.Option>
                        <Form.Select.Option key={2} value="现金支付">现金支付</Form.Select.Option>
                    </Form.Select>

                    <Form.Input field={'paymentstatus'} label={'支付状态'} disabled />
                    <Form.Input field={'price'} label={'价格'} disabled />
                    <Form.Input field={'remarks'} label={'备注'} rules={[{ required: true }]} />

                    <Box display={'flex'} mb={1}>
                        <Box onClick={() => api.current.setValue('remarks', '正常')} border={1} px={1} mr={1} bgcolor={'#f2f2f2'} style={{ cursor: 'pointer' }}>正常</Box>
                        <Box onClick={() => api.current.setValue('remarks', '漏水')} border={1} px={1} mr={1} bgcolor={'#f2f2f2'} style={{ cursor: 'pointer' }}>漏水</Box>
                        <Box onClick={() => api.current.setValue('remarks', '客情水')} border={1} px={1} mr={1} bgcolor={'#f2f2f2'} style={{ cursor: 'pointer' }}>客情水</Box>
                        <Box onClick={() => api.current.setValue('remarks', '水异味')} border={1} px={1} bgcolor={'#f2f2f2'} style={{ cursor: 'pointer' }}>水异味</Box>
                    </Box>

                    <Form.Switch field={'isprint'} label={'是否打印'} initValue={true} />
                    <Button variant={"contained"} type={"submit"}>确认提交</Button>
                </Form>

            </Box>
        </Box >
    );
};


const mapStateToProps = (state) => state

export default connect(mapStateToProps)(CreateUserGoodsSalesMashup);
