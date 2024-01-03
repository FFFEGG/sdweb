import React, {useEffect, useState} from 'react';
import {Box} from "@mui/system";
import PermissionAllocation from 'views/comments/PermissionAllocation';
import users from '../../menu-items/users'
import PermissionAssignPage from "../comments/PermissionAssignPage";


const SettingMenu = () => {
    const [open,setopen] = useState(false)
    const initData = JSON.parse(localStorage.getItem('initData'))
    const loginuser = JSON.parse(localStorage.getItem('userinfo'))






    return (
        <Box p={3} bgcolor={'#FFF'}>
            <Box fontSize={18} mb={3}>设置员工菜单</Box>
            <PermissionAssignPage />
        </Box>
    );
};

export default SettingMenu;
