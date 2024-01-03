import React from 'react';
import {Box, Button, Typography} from "@mui/material";
import {Form} from "@douyinfe/semi-ui";
import moment from "moment";
import request from "../../utils/request";

const GetWarningRecord = () => {
    const initData = JSON.parse(localStorage.getItem('initData'))
    const loginuser = JSON.parse(localStorage.getItem('userinfo'))
    return (
        <Box p={3} borderRadius={1} bgcolor={'#fff'}>
            <Typography mb={3} fontSize={18} color={"black"}>获取警告记录</Typography>

            <Form layout={'horizontal'} onSubmit={async e=> {
                const rew =await request('post','/api/getInfo',{
                    url: 'Srapp.Web_WorkSafety_Infos.GetWarningRecord',
                    ...e
                })
                console.log(rew);
            }}>
                <Form.Input type="date" field={'begintime'} label={'开始时间'} initValue={moment().format('YYYY-MM-DD')} />
                <Form.Input type="date" field={'endtime'} label={'结束时间'} initValue={moment().format('YYYY-MM-DD')} />
                <Box display={"flex"} alignItems={"end"}>
                    <Button type={"submit"} variant={"contained"}>搜索</Button>
                </Box>
            </Form>

        </Box>
    );
};

export default GetWarningRecord;
