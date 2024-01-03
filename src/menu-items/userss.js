import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import ReorderIcon from "@mui/icons-material/Reorder";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import RepeatIcon from "@mui/icons-material/Repeat";
import AddIcon from "@mui/icons-material/Add";

// ==============================|| DASHBOARD MENU ITEMS ||============================== //


const users = {
    id: 'users',
    title: '业务管理',
    type: 'group',
    children: [
        {
            id: 'UserBasicInfoid',
            title: '会员管理',
            type: 'collapse',
            // icon: ReorderIcon,
            // url: '/users/UserBasicInfoid',
            children:
                [

                    {
                        id: 'EditUserExclusiveSalesman',
                        title: '编辑用户专属业务员',
                        type: 'item',
                        url: '/users/EditUserExclusiveSalesman',
                        breadcrumbs: false
                    },
                    {
                        id: 'business',
                        title: '用户业务办理',
                        type: 'collapse',

                        children: [
                            {
                                id: 'CreateUserGoodsSalesMashup',
                                title: '办理用户 商品捆绑销售方案',
                                type: 'item',
                                url: '/users/CreateUserGoodsSalesMashup'
                            },
                        ]
                    },
                ],
            breadcrumbs: false
        },
        {
            id: 'orderid',
            title: '订单业务',
            type: 'collapse',
            // icon: ReorderIcon,
            children:  [

                {
                    id: 'GetCtiErrorRecord',
                    title: '自助错误信息',

                    type: 'item',
                    url: '/order/GetCtiErrorRecord',
                    breadcrumbs: false
                },
            ]
        },
        {
            id: 'materialid',
            title: '物资管理',
            type: 'collapse',
            // icon: ReorderIcon,
            children: [

                {
                    id: 'InventoryAlert',
                    title: '获取库存预警信息',
                    type: 'item',
                    url: '/material/InventoryAlert',
                },

                {
                    id: 'marteril',
                    title: '物资调运',
                    type: 'collapse',

                    children: [
                        {
                            id: 'MaterialTransferPlanRecord',
                            title: '获取物资计划调拨记录',
                            type: 'item',
                            url: '/material/MaterialTransferPlanRecord'
                        },

                        {
                            id: 'OpeAbnormalExchangeRecord',
                            title: '员工异常交换记录',
                            type: 'item',
                            url: '/material/OpeAbnormalExchangeRecord',

                            breadcrumbs: false
                        },
                    ]
                },


            ]
        },
        {
            id: 'departmentid',
            title: '门店管理',
            type: 'collapse',
            // icon: ReorderIcon,
            children: [
                {
                    id: 'AddContributionRecord',
                    title: '录入缴款记录',
                    type: 'item',
                    url: '/department/AddContributionRecord',

                    breadcrumbs: false
                },

                {
                    id: 'AdvancePaymentOrderList',
                    title: '预支付订单查询',
                    type: 'item',
                    url: '/department/AdvancePaymentOrderList',
                },
                {
                    id: 'WorkSafety',
                    title: '安检信息',
                    type: 'collapse',
                    children: [
                        {
                            id: 'GetPackingInspectRecord',
                            title: '获取包装物检查信息',
                            type: 'item',
                            url: '/department/GetPackingInspectRecord',
                        },
                    ]
                },
            ]
        },
        {
            id: 'otherid',
            title: '其他业务',
            type: 'collapse',
            // icon: ReorderIcon,
            children: [
                {
                    id: 'SendGiveProgrammeToSalesman',
                    title: '授于业务员可赠送方案数量',
                    type: 'item',
                    url: '/other/SendGiveProgrammeToSalesman',
                    breadcrumbs: false
                },
            ]
        },
        {
            id: 'reportid',
            title: '数据报表',
            type: 'collapse',
            // icon: ReorderIcon,
            children: [
                {
                    id: 'report1',
                    type: 'collapse',
                    title: '业务报表',
                    children: [
                        {
                            id: 'DeliverymanWorkFloorStatistics',
                            title: '配送员工作楼层统计',
                            type: 'item',
                            url: '/report/DeliverymanWorkFloorStatistics',
                            breadcrumbs: false
                        },

                    ]
                },
                {
                    id: 'report2',
                    type: 'collapse',
                    title: '财务报表',
                    children: [
                        {
                            id: 'ArrearsCollectionReport',
                            title: '获取欠款收款报表(回款)',
                            type: 'item',
                            url: '/report/ArrearsCollectionReport',
                            breadcrumbs: false
                        },

                    ]
                },
                {
                    id: 'report3',
                    type: 'collapse',
                    title: '物资报表',
                    children: [
                        {
                            id: 'BorrowPackingtypeReport',
                            title: '获取借用包装物报表',
                            type: 'item',
                            url: '/report/BorrowPackingtypeReport',
                            breadcrumbs: false
                        },


                    ]
                },
                {
                    id: 'report4',
                    type: 'collapse',
                    title: '商用气数据查询',
                    children: [
                        {
                            id: 'SYQKHCXTable',
                            title: '商用气客户查询表',
                            type: 'item',
                            url: '/report/SYQKHCXTable',
                            breadcrumbs: false
                        }

                    ]
                },

            ]
        },

    ]
};


export default users;
