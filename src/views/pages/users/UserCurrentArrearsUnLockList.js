import React, {useState} from 'react';
import {Box} from "@mui/system";
import {Button} from "@mui/material";
import {AgGridReact} from "ag-grid-react";
import request from "../../../utils/request";

const UserCurrentArrearsUnLockList = ({userinfo}) => {
    const [list,setlist] = useState([])
    return (
        <Box>
            <Button variant={"contained"} onClick={async e=> {
                const rew = await request('post','/api/getInfo',{
                    url: 'Srapp.Web_User_Infos.UserCurrentArrearsUnLockList',
                    userid: userinfo.userid
                })
                setlist(rew.data)
            }}>搜索</Button>

            <Box height={'60vh'} overflow={"scroll"} mt={1}>
                <AgGridReact
                    className='ag-theme-balham'
                    rowData={list}
                    columnDefs={[
                        {headerName: '申请时间',field: 'addtime'},
                        {headerName: '会员号',field: 'memberid'},
                        {headerName: '姓名',field: 'name'},
                        {headerName: '工作单位',field: 'workplace'},
                        {headerName: '地址',field: 'address'},
                        {headerName: '用户类型',field: 'customertype'},
                        {headerName: '归属部门',field: 'attributiondepartment'},
                        {headerName: '备注',field: 'remarks'},
                        {headerName: '申请部门',field: 'applican_department'},
                        {headerName: '申请人',field: 'applicant_ope'},
                        {headerName: '授权时间',field: 'authorized_time'},
                        {headerName: '授权部门',field: 'authorized_department'},
                        {headerName: '授权人',field: 'authorized_ope'},
                        {headerName: '撤销部门',field: 'revoke_department'},
                        {headerName: '撤销人',field: 'revoke_ope'},
                        {headerName: '撤销时间',field: 'revoke_time'},
                        {headerName: '撤销备注',field: 'revoke_remarks'},
                        {headerName: '状态',field: 'state'},
                    ]}
                    defaultColDef={{
                        sortable: true,
                        resizable: true,
                        flex:1
                    }}
                />
            </Box>
        </Box>
    );
};

export default UserCurrentArrearsUnLockList;
