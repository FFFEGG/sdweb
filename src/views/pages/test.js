import React, { useEffect, useState } from 'react';
import { connect } from "react-redux";
import { Box, Button, Dialog, DialogActions, DialogTitle } from "@mui/material";
import UserInfo from "./UserInfo";

const test = ({ customization }) => {
    const [userinfo, setuserinfo] = useState('')
    const [list, setlist] = useState([{
        goodsname: '商品1',
        price: 100,
        num: 1
    }, {
        goodsname: '运费',
        price: 0.5,
        num: 2
    }])
    useEffect(() => {
        //新增商品
        let newlist = [...list]
        newlist.push({
            goodsname: '商品2',
            price: 200,
            num: 1
        })
        setlist(newlist)


        //查找list中运费的下标
        let index = list.findIndex(item => item.goodsname === '运费')
        let newList = [...list]  // 使用副本创建新的数组
        // 删除下标为index的元素
        newList.splice(index, 1)
        // 添加新商品的运费 
        newList.push({
            goodsname: '运费',
            price: 0.5,
            num: 8
        })
        // 重新赋值
        setlist(newList)
        console.log(list);
    }, [])






    return (
        <Box sx={{ width: '100%', background: '#FFF' }}>
            <Box p={3} bgcolor="#fff" borderRadius={1} overflow="scroll">
                <UserInfo userinfo={userinfo} />
            </Box>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title" sx={{ fontSize: 30 }}>
                    确认操作？
                </DialogTitle>

                <DialogActions>
                    <Button onClick={handleClose}>取消</Button>
                    <Button onClick={handleClick} autoFocus>
                        确认
                    </Button>
                </DialogActions>
            </Dialog>

        </Box>
    );
};


const mapStateToProps = (state) => state

export default connect(mapStateToProps)(test);