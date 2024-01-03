import React, {useState} from 'react';
import {Box} from "@mui/system";
import {Form} from "@douyinfe/semi-ui";
import moment from "moment";
import {Button} from "@mui/material";
import {AgGridReact} from "ag-grid-react";
import request from "../../utils/request";
import UserInfo from "../pages/users/UserInfo";

const GetUserInfoOfMateralCode = () => {
    const [userinfo,setusee] = useState('')
    return (
        <Box p={3} bgcolor={'#fff'} borderRadius={1}>
            <Box fontSize={18} mb={3}>获取包装物号码持有人信息</Box>

            <Form onSubmit={async e => {
                const rew = await request('post','/api/getInfo',{
                    url: 'Srapp.Web_Other_Infos.GetUserInfoOfMateralCode',
                    ...e
                })
                setusee(rew.data)

            }}  layout={"horizontal"} labelPosition={"inset"}>
                <Form.Input field={'code'} label={'条码'}  />
                 <Button type={"submit"} variant={"outlined"} size={"small"} >搜索</Button>
            </Form>


            <Box mt={3}>
                <Box p={3} border={1} mb={1} fontSize={18} fontWeight={"bold"}>会员号: {userinfo.memberid}</Box>
                <UserInfo userinfo={userinfo} />
            </Box>





        </Box>
    );
};

export default GetUserInfoOfMateralCode;
