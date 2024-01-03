import React, { useEffect, useState } from 'react';
import { Box, Button } from "@mui/material";
import request from "../../../../utils/request";
import { AgGridReact } from "ag-grid-react";
import translations from '../../../../utils/translations.json'

const UserAddress = ({ userinfo }) => {
    const [list, setlist] = useState([])
    const getlist = async () => {
        const rew = await request('post', '/api/getInfo', {
            url: 'Srapp.Web_User_Infos.UserAddress',
            userid: userinfo.userid
        })
        setlist(rew.data)
    }
    useEffect(() => {
        setlist([])
    }, [userinfo])
    return (
        <Box>
            <Button onClick={getlist} variant="contained">搜索</Button>
            <Box height="80vh" overflow="scroll" marginTop={2}>
                <AgGridReact
                    className="ag-theme-balham"
                    reactUi="true"
                    localeText={translations}
                    rowData={list}
                    columnDefs={[
                        { field: 'id', headerName: 'ID', hide: true },
                        { field: 'addtime', headerName: '新增时间'},
                        { field: 'name', headerName: '姓名' },
                        { field: 'telephone', headerName: '电话' },
                        { field: 'memberid', headerName: '卡号' },
                        { field: 'address', headerName: '地址' },
                        { field: 'department', headerName: '门店' },
                        { field: 'state', headerName: '状态' },
                        { field: 'servicearea', headerName: '区域' },
                        { field: 'floor', headerName: '楼层' },
                        { field: 'workplace', headerName: '单位' },

                    ]}
                    defaultColDef={{
                        // flex: 1
                        resizable: true,
                        sortable: true,
                        filter: 'agTextColumnFilter',
                        floatingFilter: true,
                    }}
                />
            </Box>
        </Box>
    );
};

export default UserAddress;
