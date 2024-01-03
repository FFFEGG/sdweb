import React, { useRef, useState } from 'react';
import { Box } from "@mui/system";
import { Form } from "@douyinfe/semi-ui";
import moment from "moment";
import { Button, Modal, Typography } from "@mui/material";
import request from "../../utils/request";
import { AgGridReact } from "ag-grid-react";

const PackingtypeUseBillReport = () => {
    const initData = JSON.parse(localStorage.getItem('initData'))
    const loginuser = JSON.parse(localStorage.getItem('userinfo'))
    const [list, setList] = useState([])
    const [sublist, setsublist] = useState([])
    const [open, setopen] = useState(false)
    const api = useRef()
    const new_department_byname = JSON.parse(localStorage.getItem('new_department_byname'))
    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '60%',
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
    };
    return (
        <Box p={3} bgcolor="#fff">
            <Typography fontSize={20} mb={3}>获取包装物使用票据报表</Typography>
            <Form getFormApi={formapi => { api.current = formapi }} onSubmit={async e => {
                const rew = await request('post', '/api/getInfo', {
                    url: 'Srapp.Web_Report_Material_Infos.PackingtypeUseBillReport',
                    ...e,
                    department: JSON.stringify(e.department),
                })
                setList(rew.data.info)
            }} layout='horizontal' labelPosition="inset">
                {

                    (loginuser.login_department == '信息中心' || loginuser.login_department == '财务部' || loginuser.login_department == '运输公司') ?
                        <Form.TreeSelect
                            multiple
                            leafOnly
                            filter
                            maxTagCount={1}
                            label="业务部门" style={{ width: 200 }}
                            filterTreeNode
                            field={'department'}  treeData={new_department_byname} />



                        :
                        <Form.Select initValue={[loginuser.login_department]} field='department' filter maxTagCount={1} multiple label="业务部门" style={{ width: 200 }}>

                            <Form.Select.Option value={loginuser.login_department}>{loginuser.login_department}</Form.Select.Option>


                        </Form.Select>

                }

                <Form.Input field='begintime' type="date" label="起始时间" initValue={moment().format('YYYY-MM-DD')}
                    style={{ width: 200 }} />
                <Form.Input field='endtime' type="date" label="结束时间" initValue={moment().format('YYYY-MM-DD')}
                    style={{ width: 200 }} />


                <Button type="submit" variant="contained" size="small">搜索</Button>
            </Form>

            <Box mt={3} overflow="scroll" height="60vh">
                <AgGridReact
                    className="ag-theme-balham"
                    rowData={list}
                    // {
                    //     "packingtype": "[\"5加仑PC桶\"]",
                    //     "BLbillofdeposit": 11,
                    //     "BLbillofdepositTotal": 275,
                    //     "BLbillofsale": 0,
                    //     "BLbillofsaleTotal": 0,
                    //     "BLbillofborrow": 0,
                    //     "BLbillofbringin": 0,
                    //     "Usebillofdeposit": 2,
                    //     "Usebillofsale": 0,
                    //     "Usebillofborrow": 0,
                    //     "Usebillofbringin": 0,
                    //     "Retreatbillofdeposit": 0,
                    //     "Retreatbillofborrow": 0,
                    //     "Refundbillofdeposit": 0,
                    //     "RefundbillofdepositTotal": 0
                    //   }
                    columnDefs={[
                        // "非法请求：参数project应该为：押金-办理/押金-使用/押金-退物资/押金-退款/销售-办理/销售-使用/借用-办理/借用-使用/借用-退物资/带入-办理/带入-使用，但现在project = 借用-退物"


                        { headerName: '包装物类型', field: 'packingtype',pinned:'left' },
                        { headerName: '押金-办理', field: 'BLbillofdeposit' },

                        { headerName: '押金-使用', field: 'Usebillofdeposit' },
                        { headerName: '销售-办理', field: 'BLbillofsale' },

                        { headerName: '销售-使用', field: 'Usebillofsale' },
                        { headerName: '借用-办理', field: 'BLbillofborrow' },
                        { headerName: '借用-使用', field: 'Usebillofborrow' },
                        { headerName: '借用-退物资', field: 'Retreatbillofborrow' },
                        { headerName: '带入-办理', field: 'BLbillofbringin' },
                        { headerName: '带入-使用', field: 'Usebillofbringin' },
                        { headerName: '押金-退物资', field: 'Retreatbillofdeposit' },
                        { headerName: '押金-退款', field: 'Refundbillofdeposit' },



                    ]}
                    onCellClicked={async (data) => {
                        if (data.column.instanceId <= 0) {
                            return
                        }
                        // console.log(data);
                        const post = api.current.getValues()
                        const rew = await request('post', '/api/getInfo', {
                            url: 'Srapp.Web_Report_Material_Infos.PackingtypeUseBillReportDetailed',
                            ...post,
                            department: JSON.stringify(post.department),
                            packingtype: data.data.packingtype,
                            project: data.colDef.headerName,
                        })
                        setopen(true)
                        setsublist(rew.data.info)
                    }}
                    defaultColDef={{
                        resizable: true,
                        // flex: 1
                    }}
                    onGridReady={params => {
                        params.api.sizeColumnsToFit();

                    }}
                />
            </Box>


            <Modal open={open} onClose={() => setopen(false)}>
                <Box sx={{
                    ...style,
                    bgcolor: '#fff',
                    overflow: 'scroll',
                    height: '60vh',
                    width: '95%'
                }}>
                    <AgGridReact
                        className="ag-theme-balham"
                        rowData={sublist}
                        columnDefs={[
                            { headerName: '时间', field: 'addtime' },
                            { headerName: '部门', field: 'department' },
                            { headerName: '商品', field: 'name' },
                            { headerName: '包装物类型', field: 'packingtype' },
                            { headerName: '会员号', field: 'memberid' },
                            { headerName: '方式', field: 'mode' },
                            { headerName: '数量', field: 'num' },
                            { headerName: '预约人', field: 'operator' }
                        ]}
                        defaultColDef={{
                            // flex: 1,
                            resizable: true
                        }}
                        onGridReady={params => {
                            params.api.sizeColumnsToFit();

                        }}
                    />
                </Box>
            </Modal>
        </Box>
    );
};

export default PackingtypeUseBillReport;
