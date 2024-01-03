import React, { useEffect, useState } from 'react';
import { connect } from "react-redux";
import {
    Box, Button,
    FormControl,
    InputLabel,
    MenuItem,
    Select, TextField,
    ToggleButton,
    ToggleButtonGroup,
    Typography
} from "@mui/material";
import UserInfo from "./UserInfo";

import { useForm, Controller } from "react-hook-form";
import moment from "moment";
import request from "../../../utils/request";
import { toast } from "react-toastify";
import { Modal, Popconfirm } from "@douyinfe/semi-ui";
import myprint from 'utils/myprint';


const UserRefund = ({ customization }) => {


    const [userinfo, setuserinfo] = useState('')
    const [total, settotal] = useState('')
    const [remarks, setremarks] = useState('')


    const onSubmit = async () => {
        if (total <= 0) {
            toast.error('金额有误')
            settotal(1)
            return
        }
        const rew = await request('post', '/api/getInfo', {
            userid: userinfo.userid,
            remarks,
            total,
            payment: '现金支付',
            url: 'Srapp.Web_BusinessProcessing_Handle.UserRefund'
        })
        if (rew.data.msg === 'SUCCESS') {
            toast.success('操作成功')
            if (rew.data.printinfo) {
                myprint(rew.data.printinfo)
            }

        } else {
            toast.error(`操作失败 ${rew.data.tips}`)
        }
    };

    useEffect(() => {
        setuserinfo(customization.user)

    }, [customization])

    return (
        <Box sx={{ width: '100%', background: '#FFF' }}>
            <Box p={3} bgcolor="#fff" borderRadius={1} overflow="scroll">
                <UserInfo userinfo={userinfo} />
            </Box>
            <Box p={3} paddingTop={0} bgcolor="#fff" borderRadius={1} overflow="scroll">
                <form>
                    <Typography marginBottom={2} fontSize={20}>用户退款</Typography>

                    <TextField value={total} onChange={e => settotal(e.target.value)} InputLabelProps={{ shrink: true }} label="退款金额" type="number" fullWidth
                        sx={{ marginBottom: 2 }} />

                    <TextField value={remarks} onChange={e => setremarks(e.target.value)} InputLabelProps={{ shrink: true }} label="备注" fullWidth
                        sx={{ marginBottom: 2 }} />

                    <Popconfirm title="提示" content="确认操作？" onConfirm={onSubmit}>
                        <Button variant="contained">确认退款</Button>
                    </Popconfirm>

                </form>

            </Box>
        </Box>
    );
};


const mapStateToProps = (state) => state

export default connect(mapStateToProps)(UserRefund);
