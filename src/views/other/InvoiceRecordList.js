import React from 'react';
import {Box} from "@mui/system";
import {Form} from "@douyinfe/semi-ui";
import {Button} from "@mui/material";
import moment from "moment";
import request from "../../utils/request";

const InvoiceRecordList = () => {
    return (
        <Box p={3} bgcolor={'#fff'} borderRadius={1}>
            <Form layout={"horizontal"} labelPosition={"inset"} onSubmit={async e=>{
                const rew = await request('post','/api/getInfo',{
                    url: 'Srapp.Web_Invoice_Infos.InvoiceRecordList',
                    ...e
                })
                console.log(rew);
            }}>
                <Form.Input field={'begintime'} label={'开票起始时间'} initValue={moment().format('YYYY-MM-DD')} type={'date'} />
                <Form.Input field={'endtime'} label={'开票结束时间'} initValue={moment().format('YYYY-MM-DD')} type={'date'} />
                <Form.Input field={'invoicenumber'} label={'发票号码'} />
                <Button type={"submit"} variant={'outlined'} size={"small"}>确认</Button>
            </Form>
        </Box>
    );
};

export default InvoiceRecordList;
