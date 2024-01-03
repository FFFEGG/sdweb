import React from 'react';
import {Box, Button, Typography} from "@mui/material";
import {Form} from "@douyinfe/semi-ui";
import moment from "moment";
import request from "../../utils/request";

const GetSafetyProductionRecord = () => {
    const initData = JSON.parse(localStorage.getItem('initData'))
    const loginuser = JSON.parse(localStorage.getItem('userinfo'))
    return (
        <Box p={3} borderRadius={1} bgcolor={'#fff'}>
            <Typography mb={3} fontSize={18} color={"black"}>获取安全生产信息</Typography>

            <Form layout={'horizontal'} onSubmit={async e=> {
                const rew =await request('post','/api/getInfo',{
                    url: 'Srapp.Web_WorkSafety_Infos.GetSafetyProductionRecord',
                    ...e
                })
                console.log(rew);
            }}>
                <Form.Input type="date" field={'begintime'} label={'开始时间'} initValue={moment().format('YYYY-MM-DD')} />
                <Form.Input type="date" field={'endtime'} label={'结束时间'} initValue={moment().format('YYYY-MM-DD')} />
                <Form.Select field={'type'} label={'范围'} style={{width: 200}}>
                    <Form.Select.Option value={'充装生产记录'}>充装生产记录</Form.Select.Option>
                    <Form.Select.Option value={'充装前检查记录'}>充装前检查记录</Form.Select.Option>
                    <Form.Select.Option value={'充装后检查记录'}>充装后检查记录</Form.Select.Option>
                </Form.Select>
                <Form.Input field={'code'} label={'识别码'} />

                <Box display={"flex"} alignItems={"end"}>
                    <Button type={"submit"} variant={"contained"}>搜索</Button>
                </Box>
            </Form>

        </Box>
    );
};

export default GetSafetyProductionRecord;
