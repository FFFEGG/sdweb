import React from 'react';

import OtherServicesOrderListKFZX from './OtherServicesOrderListFKZX';
import OtherServicesOrderListDepartment from './OtherServicesOrderListDepartment';
import OtherServicesOrderListYYZX from './OtherServicesOrderListYYZX';

const OtherServicesOrderList = () => {

    const loginuser = JSON.parse(localStorage.getItem('userinfo'))



    if (loginuser.login_department === '客服中心') {
        return <OtherServicesOrderListKFZX />


    }

    else if (loginuser.login_department === '发卡室') {
        return <OtherServicesOrderListKFZX />
    }


    else if (loginuser.login_department === '运营监督') {
        return <OtherServicesOrderListYYZX />
    } else if (loginuser.login_department === '预约中心') {
        return <OtherServicesOrderListYYZX />
    } else {
        return <OtherServicesOrderListDepartment />
    }



};

export default OtherServicesOrderList;
