import React, {useEffect, useState} from 'react';
import {connect} from "react-redux";
import {Box} from "@mui/material";
import UserInfo from "../users/UserInfo";
import {color} from "@mui/system";


const ConfirmSaleOrderRecord = ({customization}) => {
    const [userinfo,setuserinfo] = useState('')

    useEffect(() => {
        setuserinfo(customization.user)
    }, [customization])

    return (
        <Box  sx={{width: '100%', background: '#FFF'}}>
            确认销售记录,营业员确认收到货款 或 业务部门核销月结欠款、现结欠款
        </Box>
    );
};


const mapStateToProps = (state) => state

export default connect(mapStateToProps)(ConfirmSaleOrderRecord);