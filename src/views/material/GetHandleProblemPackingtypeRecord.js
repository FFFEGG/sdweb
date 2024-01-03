import React from 'react';
import { Box } from "@mui/system";
import { Form } from "@douyinfe/semi-ui";
import moment from "moment";
import { Button } from "@mui/material";
import request from "../../utils/request";
import { AgGridReact } from "ag-grid-react";

const GetHandleProblemPackingtypeRecord = () => {
    const [list, setList] = React.useState([])
    return (
        <Box p={3} bgcolor={'#fff'} borderRadius={1}>
            <Box fontSize={18} mb={3}>获取处理问题瓶记录</Box>
            <Form layout={'horizontal'} labelPosition={'inset'} onSubmit={async e => {
                setList([])
                const rew = await request('post', '/api/getInfo', {
                    url: 'Srapp.Web_Other_Infos.GetHandleProblemPackingtypeRecord',
                    ...e,
                })
                setList(rew.data)

            }}>
                <Form.Input field={'begintime'} label={'开始时间'} type={'date'} initValue={moment().format('YYYY-MM-DD')} />
                <Form.Input field={'endtime'} label={'结束时间'} type={'date'} initValue={moment().format('YYYY-MM-DD')} />
                <Button variant={'contained'} type={'submit'} color={'primary'} size={'small'}>查询</Button>
            </Form>


            <Box mt={2} height={'60vh'} overflow={'scroll'}>
                <AgGridReact
                    className="ag-theme-balham"
                    rowData={list}
                    columnDefs={[
                        // 'addtime','type','serial','grantee','receiver','packingtype','transactiondepartment','transactionoperator','transactiontime','department','operator'

                        { headerName: '添加时间', field: 'addtime' },
                        { headerName: '类型', field: 'type' },
                        { headerName: '流水号', field: 'serial' },
                        { headerName: '授权人', field: 'grantee' },
                        { headerName: '接收人', field: 'receiver' },
                        { headerName: '包装物类型', field: 'packingtype' },
                        { headerName: '交易部门', field: 'transactiondepartment' },
                        { headerName: '交易操作员', field: 'transactionoperator' },
                        { headerName: '交易时间', field: 'transactiontime' },
                        { headerName: '部门', field: 'department' },
                        { headerName: '操作员', field: 'operator' },

                    ]}
                />
            </Box>
        </Box>
    );
};

export default GetHandleProblemPackingtypeRecord;