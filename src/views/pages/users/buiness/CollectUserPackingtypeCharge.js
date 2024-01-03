import React, {useCallback, useEffect, useRef, useState} from 'react';
import {connect} from "react-redux";
import {Box, Button, Dialog, DialogActions, DialogTitle} from "@mui/material";
import UserInfo from "../UserInfo";
import {AgGridReact} from "ag-grid-react";
import request from "../../../../utils/request";
import {toast} from "react-toastify";
import {Modal} from "@douyinfe/semi-ui";

const CollectUserPackingtypeCharge = ({customization}) => {
    const [userinfo, setuserinfo] = useState('')
    const [list, sl] = useState([])
    const [hj, sethj] = useState(0)
    const [ids, setids] = useState([])
    const [open, setopen] = useState(false)
    const gridRef = useRef();
    useEffect(() => {
        setuserinfo(customization?.user)
    }, [customization])

    const getList = async () => {
        const rew = await request('post', '/api/getInfo', {
            url: 'Srapp.Web_User_Infos.UserPackingtypeChargeRecord',
            userid: userinfo.userid
        })
        sl(rew.data)
    }

    const onSelectionChanged = useCallback(() => {
        const selectedRows = gridRef.current.api.getSelectedRows();

        let total = 0
        const arr = []
        selectedRows.forEach(item => {
            if (item.state === '正常') {
                arr.push(item.id)
                total += parseFloat(item.total)
            }
        })
        sethj(total)
        setids(arr)
    }, []);

    const handleClose = () => {
        console.log('handleClose')
        setopen(false)
    }

    const handleClick = async () => {
         Modal.confirm({
             title: '提示',
             content: '确认办理？',
             style: {
                 top: '30%'
             },
             onOk: async () => {
                 const rew = await request('post','/api/getInfo',{
                     url: 'Srapp.Web_BusinessProcessing_Handle.CollectUserPackingtypeCharge',
                     ids: JSON.stringify(ids),
                     total: hj,
                     remarks: 'remarks',
                     userid: userinfo.userid
                 })
                 if (rew.code === 200) {
                     toast.success('操作成功')
                     setopen(false)
                     getList()
                 }
                 console.log(rew);
             }
         })

    }
    const isRowSelectable = useCallback((rowNode) =>  rowNode.data ? rowNode.data.state === '正常' : false, []);

    return (
        <Box sx={{width: '100%', background: '#FFF'}}>
            <Box p={3} bgcolor="#fff" borderRadius={1} overflow="scroll">
                <UserInfo userinfo={userinfo}/>
            </Box>

            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title" sx={{ fontSize: 30}}>
                    确认操作？
                </DialogTitle>

                <DialogActions>
                    <Button onClick={handleClose}>取消</Button>
                    <Button onClick={handleClick} autoFocus>
                        确认
                    </Button>
                </DialogActions>
            </Dialog>

            <Box px={3} bgcolor="#fff" borderRadius={1}>
                <Button variant="contained" onClick={getList}>查询用户费用列表</Button>
                <Button sx={{ ml:2}} variant="contained" onClick={handleClick}>确认操作</Button>
                <Box fontSize={18} mt={3}>合计: { hj } 元 { JSON.stringify(ids) }</Box>
                <Box height="80vh" mt={3}>
                    <AgGridReact
                        ref={gridRef}
                        reactUi="true"
                        className="ag-theme-balham"
                        rowData={list}
                        suppressRowClickSelection={Boolean(true)}
                        rowMultiSelectWithClick={Boolean(true)}
                        rowSelection="multiple"
                        isRowSelectable={isRowSelectable}
                        onSelectionChanged={onSelectionChanged}
                        columnDefs={[

                            {
                                headerName: 'serial', field: 'serial', headerCheckboxSelection: true,
                                headerCheckboxSelectionFilteredOnly: true,
                                checkboxSelection: true,
                            },
                            {headerName: '备注', field: 'remarks'},
                            {headerName: '钢瓶类型', field: 'packingtype'},
                            {headerName: '项目', field: 'project'},
                            {headerName: '金额', field: 'total'},
                            {headerName: '状态', field: 'state'},
                        ]}

                    />
                </Box>

            </Box>
        </Box>
    );
};


const mapStateToProps = (state) => state

export default connect(mapStateToProps)(CollectUserPackingtypeCharge);
