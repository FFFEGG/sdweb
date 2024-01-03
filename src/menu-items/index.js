import dashboard from './dashboard';
import sys from './sys';
import users from './users';
import order from './order';
import material from './material';
import department from "./department";
import other from "./other";
import report from "./report";
import { useParams } from 'react-router-dom';



const loginuser = JSON.parse(localStorage.getItem('userinfo'))



let menuItems = {}
if (loginuser?.department === '信息中心') {
     menuItems = {
        // items: [dashboard, sys, users, order, material,department,other,report]
        items: [dashboard, sys, users]
    };

} else {
     menuItems = {
        // items: [dashboard, sys, users, order, material,department,other,report]
        items: [dashboard, loginuser && JSON.parse(loginuser?.quarters_webmenu1)]
    };
}


export default menuItems;
