// assets
import { IconBrandChrome, IconHelp } from '@tabler/icons';

// constant
const icons = { IconBrandChrome, IconHelp };

// ==============================|| SAMPLE PAGE & DOCUMENTATION MENU ITEMS ||============================== //

const other = {
    id: 'other',
    type: 'group',
    title: '其他业务',
    children: [
        {
            id: 'SendGiveProgrammeToSalesman',
            title: '授于业务员可赠送方案数量',
            type: 'item',
            url: '/other/SendGiveProgrammeToSalesman',
            breadcrumbs: false
        },
        {
            id: 'GetOpeDailyWorkLoad',
            title: '获取员工工作量',
            type: 'item',
            url: '/other/GetOpeDailyWorkLoad',
            breadcrumbs: false
        },
        {
            id: 'UserListOfSalesman',
            title: '获取业务员维护用户列表',
            type: 'item',
            url: '/other/UserListOfSalesman',
            breadcrumbs: false
        },
        {
            id: 'UserListOfDepartment',
            title: '部门用户列表',
            type: 'item',
            url: '/other/UserListOfDepartment',
            breadcrumbs: false
        },
        {
            id: 'GetUserDiscountApplicationsList',
            title: '申请优惠价格列表',
            type: 'item',
            url: '/other/GetUserDiscountApplicationsList',
            breadcrumbs: false
        },
        {
            id: 'InvoiceRecordList',
            title: '已开具发票记录',
            type: 'item',
            url: '/other/InvoiceRecordList',
            breadcrumbs: false
        }
    ]
};

export default other;
