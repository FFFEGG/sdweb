import React, { useEffect, useState } from 'react';
import { connect } from "react-redux";
import {
     Box, Button,
     FormControl,
     InputLabel,
     MenuItem,
     Select, TextField,
     ToggleButton,
     ToggleButtonGroup,
     Typography
} from "@mui/material";


import { useForm, Controller } from "react-hook-form";
import moment from "moment";

import { toast } from "react-toastify";
import { Form, Modal, Popconfirm } from "@douyinfe/semi-ui";
import myprint from 'utils/myprint';
import UserInfo from 'views/pages/users/UserInfo';
import request from 'utils/request';


const HandleSpecialUserPackingtypeWarehouse = ({ customization }) => {
     const initData = JSON.parse(localStorage.getItem('initData'))
     const loginuser = JSON.parse(localStorage.getItem('userinfo'))

     const [userinfo, setuserinfo] = useState('')



     useEffect(() => {
          setuserinfo(customization.user)

     }, [customization])

     return (
          <Box sx={{ width: '100%', background: '#FFF' }}>
               <Box p={3} bgcolor="#fff" borderRadius={1} overflow="scroll">
                    <UserInfo userinfo={userinfo} />
               </Box>
               <Box p={3} paddingTop={0} bgcolor="#fff" borderRadius={1} overflow="scroll">
                    <Box fontSize={18} my={2}>信息中心押金录入</Box>
                    <Form labelPosition="inset" onSubmit={async e => {
                         // Srapp.Web_BusinessProcessing_Handle.HandleSpecialUserPackingtypeWarehouse
                         // 特殊用户包装物信息
                         // 接口地址：http://113.16.193.82:8203/?s=Srapp.Web_BusinessProcessing_Handle.HandleSpecialUserPackingtypeWarehouse
                         // POST
                         // 接口描述：

                         // 接口参数
                         // 参数名字	类型	是否必须	默认值	其他	说明
                         // userid	整型	必须			userid
                         // billno	字符串	必须			票据号
                         // price	浮点型	必须			单价
                         // num	整型	可选	1	最小：1	数量
                         // remarks	字符串	可选		最大：150	备注
                         // packingtype	枚举类型	必须		范围：YSP35.5型钢瓶/YSP12型钢瓶	状态（YSP35.5型钢瓶,YSP12型钢瓶）
                         const rew = await request('post', '/api/getInfo', {
                              url: 'Srapp.Web_BusinessProcessing_Handle.HandleSpecialUserPackingtypeWarehouse',
                              ...e,
                              userid: userinfo.userid
                         })
                         if (rew.data.msg === 'SUCCESS') {
                              toast.success('办理成功')
                         } else {
                              toast.error('办理失败')

                         }

                    }}>

                         <Form.Input field='addtime' label="日期" type="date" initValue={moment().format('YYYY-MM-DD')} />
                         <Form.Input field='billno' label="票据号" />
                         <Form.Input field='price' label="单价" />
                         <Form.Input field='num' label="数量" />
                         <Form.Input field='remarks' label="备注" />
                         <Form.Select field='packingtype' label="钢瓶类型" style={{ width: '100%' }}>

                              <Form.Select.Option value="YSP35.5型钢瓶">YSP35.5型钢瓶</Form.Select.Option>
                              <Form.Select.Option value="YSP12型钢瓶">YSP12型钢瓶</Form.Select.Option>
                              <Form.Select.Option value="YSP118型钢瓶">YSP118型钢瓶</Form.Select.Option>

                         </Form.Select>
                         <Button type="submit" variant="contained" >确认办理</Button>
                    </Form>
               </Box>
          </Box>
     );
};


const mapStateToProps = (state) => state

export default connect(mapStateToProps)(HandleSpecialUserPackingtypeWarehouse);
