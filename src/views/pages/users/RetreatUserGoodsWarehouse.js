import React, { useEffect, useState } from 'react';
import { Box, Button, FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { useForm } from "react-hook-form";
import moment from "moment";
import request from "../../../utils/request";
import translations from '../../../utils/translations.json'
import { AgGridReact } from "ag-grid-react";
import NavCard from "../../../ui-component/cards/NavCard";
import UserInfo from "./UserInfo";
import { connect } from "react-redux";

import { Popconfirm } from "@douyinfe/semi-ui";
import { toast } from "react-toastify";
import myprint from 'utils/myprint';

const RetreatUserGoodsWarehouse = ({ customization }) => {
    const [userinfo, setuserinfo] = useState('')
    const [list, setlist] = useState([])

    const getlist = async () => {
        if (!userinfo.userid) {
            return;
        }
        setlist([])
        const rew = await request('post', '/api/getInfo', {
            url: 'Srapp.Web_User_Infos.UserGoodsWarehouse',
            userid: userinfo.userid,
            begintime: '1991-01-01',
            endtime: moment(new Date()).format('YYYY-MM-DD'),
        })
        const arr = (rew.data).filter(item => (item.num > 0 && item.state === '正常'))
        setlist(arr)
    }
    useEffect(() => {
        setuserinfo(customization.user)
    }, [customization])

    useEffect(() => {
        getlist()
    }, [userinfo])

    return (
        <Box>

            <NavCard title="用户业务办理" subtitle="退用户商品库存" />

            <Box p={3} mt={1} bgcolor="#fff" borderRadius={1} overflow="scroll">
                <UserInfo userinfo={userinfo} />
                <Box mt={2} height="30vh">
                    <AgGridReact
                        localeText={translations}
                        reactUi="true"
                        className="ag-theme-balham"
                        columnDefs={[
                            { field: 'addtime', headerName: '办理时间', },
                            { field: 'department', headerName: '办理门店', },
                            { field: 'goodsname', headerName: '商品名称', },
                            { field: 'price', headerName: '价格', },
                            { field: 'remarks', headerName: '备注', },
                            { field: 'initial_num', headerName: '总数量', },
                            { field: 'num', headerName: '剩余数量', },
                            { field: 'paymentstatus', headerName: '支付状态', },
                            { field: 'state', headerName: '状态', },
                            {
                                field: 'id', headerName: '退款金额', width: '100', pinned: 'left', valueGetter: ({ data }) => {
                                    if (data.paymentstatus == '未支付') {
                                        return 0
                                    }
                                    return data.price * (data.num)
                                }
                            },
                            {
                                headerName: '操作', pinned: 'left', width: '100', cellRendererFramework: (data) => (data.data.num > 0 && data.data.state === '正常') ? <Popconfirm
                                    title="提示"
                                    content="确认操作？"
                                    onConfirm={async () => {
                                        const rew = await request('post', '/api/getInfo', {
                                            url: 'Srapp.Web_BusinessProcessing_Handle.RetreatUserGoodsWarehouse',
                                            userid: userinfo.userid,
                                            goodswarehouseids: JSON.stringify([data.data.id])
                                        })
                                        if (rew.data.msg === 'SUCCESS') {
                                            toast('操作成功')
                                            getlist()
                                            if (rew.data.printinfo) {
                                                myprint(rew.data.printinfo)
                                            }
                                        }
                                        // console.log(rew);
                                    }}
                                >
                                    <Button>退库存</Button>
                                </Popconfirm> : ''
                            },
                        ]}

                        rowData={list}
                        defaultColDef={{
                            // flex: 1,
                            resizable: true,
                            sortable: true
                        }}
                        onFirstDataRendered={e=>e.api.sizeColumnsToFit()}
                    />
                </Box>
            </Box>

        </Box>
    );
};
const mapStateToProps = (state) => state

export default connect(mapStateToProps)(RetreatUserGoodsWarehouse);
