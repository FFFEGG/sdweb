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
import initData from "../../initData";



const UserPreferentialRecharge = ({ customization }) => {


    const [userinfo, setuserinfo] = useState('')
    const [preferentialrechargeid, setpreferentialrechargeid] = useState('')
    const [remarks, setremarks] = useState('')


    const onSubmit = async () => {
        const rew = await request('post', '/api/getInfo', {
            userid: userinfo.userid,
            remarks,
            preferentialrechargeid,
            payment: '现金支付',
            url: 'Srapp.Web_BusinessProcessing_Handle.UserPreferentialRecharge'
        })
        if (rew.code === 200) {
            toast.success('操作成功')

        } else {
            toast.error('操作失败')
        }
    };

    useEffect(() => {
        setuserinfo(customization?.user)

    }, [customization])

    return (
        <Box sx={{ width: '100%', background: '#FFF' }}>
            <Box p={3} bgcolor="#fff" borderRadius={1} overflow="scroll">
                <UserInfo userinfo={userinfo} />
            </Box>
            <Box p={3} paddingTop={0} bgcolor="#fff" borderRadius={1} overflow="scroll">
                <form>
                    <Typography marginBottom={2} fontSize={20}>用户专项款办理充值</Typography>
                    <FormControl fullWidth sx={{ marginBottom: 2 }}>
                        <InputLabel>专项款</InputLabel>
                        <Select label="专项款" value={preferentialrechargeid} onChange={e => setpreferentialrechargeid(e.target.value)}>
                            {
                                initData?.PreferentialRechargeList?.map(item => <MenuItem value={item.id}>{item.name}</MenuItem>)
                            }
                        </Select>
                    </FormControl>
                    <TextField value={remarks} onChange={e => setremarks(e.target.value)} InputLabelProps={{ shrink: true }} label="备注" fullWidth
                        sx={{ marginBottom: 2 }} />

                    <Popconfirm title="提示" content="确认操作？" onConfirm={onSubmit}>
                        <Button variant="contained">确认充值</Button>
                    </Popconfirm>

                </form>

            </Box>
        </Box>
    );
};


const mapStateToProps = (state) => state

export default connect(mapStateToProps)(UserPreferentialRecharge);
