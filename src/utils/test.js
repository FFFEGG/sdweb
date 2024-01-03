import React, {useEffect, useState} from 'react';
import {connect} from "react-redux";
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogTitle,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    TextField
} from "@mui/material";
import UserInfo from "../UserInfo";
import axios from "axios";
import request from "../../../../utils/request";

const CommodityExchange = ({customization}) => {

    const [open,setopen] = useState(false)

    const submit = () => {
        console.log(23)
        setopen(true)
    }

    const handleClose = () => {
        setopen(false)
    }
    const handleClick = async () => {
        setopen(false)
        const rew = await request('post','/api/getInfo',{
            url: 'Srapp.Sns_BusinessProcessing_Handle.CommodityExchange',
            snsuserid: userinfo.userid,
            goodsid: 1
        })
    }

    return (
        <Box sx={{width: '100%', background: '#FFF'}}>
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

            <Box p={3} bgcolor="#fff" borderRadius={1} overflow="scroll">
                <UserInfo userinfo={userinfo}/>
            </Box>
            <Box p={3} bgcolor="#fff" borderRadius={1} overflow="scroll">

                <FormControl sx={{ mr:1,width: 300}} size="small">
                    <InputLabel id="demo-simple-select-label">商品</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"

                        label="商品"

                    >
                        {
                            initData.GoodsList.filter(item=>item.canuse === true).map(item=><MenuItem value={item.id}>{item.name}</MenuItem>)
                        }
                    </Select>
                </FormControl>
                <TextField type="number" sx={{ mr:1,width: 300}} size="small" label="数量" />
                <Button onClick={submit} variant="contained">确认办理</Button>
            </Box>
        </Box>
    );
};


const mapStateToProps = (state) => state

export default connect(mapStateToProps)(CommodityExchange);
