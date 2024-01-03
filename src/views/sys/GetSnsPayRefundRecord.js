import React from 'react';
import {Box} from "@mui/system";
import {Form} from "@douyinfe/semi-ui";
import moment from "moment";
import {Button} from "@mui/material";
import request from "../../utils/request";

const GetSnsPayRefundRecord = () => {
    return (
        <Box p={3} borderRadius={1} bgcolor={'#fff'}>
            <Form layout={"horizontal"} labelPosition={"inset"} onSubmit={async e=>{
                const rew = await request('post','/api/getInfo',{
                    ...e,
                    url: 'Srapp.Web_Log_Infos.GetSnsPayRefundRecord'
                })
                console.log(rew);
            }}>
                <Form.Input label={'开始时间'} type={'date'} field={'begintime'} initValue={moment().format('YYYY-MM-DD')} />
                <Form.Input label={'结束时间'}  type={'date'} field={'endtime'} initValue={moment().format('YYYY-MM-DD')} />
                <Form.Input label={'支付订单号（主订单号）'} field={'serial'} />
                <Button type={"submit"} variant={"contained"} size={"small"}>搜索</Button>
            </Form>
        </Box>
    );
};

export default GetSnsPayRefundRecord;
