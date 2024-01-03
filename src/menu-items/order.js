import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import ReorderIcon from '@mui/icons-material/Reorder';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const order = {
    id: 'order',
    title: '订单业务',
    type: 'group',
    children: [
        {
            id: 'OrderList',
            title: '安排订单',
            type: 'item',
            url: '/order/OrderList',
            icon: ReorderIcon,
            breadcrumbs: false
        } ,
        {
            id: 'OtherServicesOrderList',
            title: '门店业务',
            icon: EventAvailableIcon,
            type: 'item',
            url: '/order/OtherServicesOrderList',
            breadcrumbs: false
        },
        {
            id: 'GetPrintInfo',
            title: '打印列表',
            icon: ReorderIcon,
            type: 'item',
            url: '/order/GetPrintInfo',
            breadcrumbs: false
        },
    ]
};

export default order;
