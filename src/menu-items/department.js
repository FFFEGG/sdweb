import PersonSearchIcon from '@mui/icons-material/PersonSearch';


// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const department = {
    id: 'department',
    title: '门店管理',
    type: 'group',
    children: [
        {
            id: 'AddContributionRecord',
            title: '录入缴款记录',
            type: 'item',
            url: '/department/AddContributionRecord',

            breadcrumbs: false
        },
        {
            id: 'MaterialCirculationRecord',
            title: '包装物流转信息',
            type: 'item',
            url: '/department/MaterialCirculationRecord',

            breadcrumbs: false
        },
        {
            id: 'AddDistributionSubsidyOfCompanyRecord',
            title: '添加商品配送公司补贴',
            type: 'item',
            url: '/department/AddDistributionSubsidyOfCompanyRecord',

            breadcrumbs: false
        },
        {
            id: 'GetCanRevokeBusiness',
            title: '门店可取消业务',
            type: 'item',
            url: '/department/GetCanRevokeBusiness',

            breadcrumbs: false
        },
        {
            id: 'DepartmentUserOrderInfo',
            title: '订单监控',
            type: 'item',
            url: '/department/DepartmentUserOrderInfo',

            breadcrumbs: false
        },
        {
            id: 'GetResidualGasToBeConfirmedRecord',
            title: '获取待确认退瓶存瓶余气记录',
            type: 'item',
            url: '/department/GetResidualGasToBeConfirmedRecord',

            breadcrumbs: false
        },
        {
            id: 'MergeUserPackingtypeWarehouse',
            title: '合并用户包装物仓库数据(周转非扫描类)',
            type: 'item',
            url: '/department/MergeUserPackingtypeWarehouse',

            breadcrumbs: false
        },
        {
            id: 'SplitUserPackingtypeWarehouse',
            title: '拆分用户包装物仓库数据',
            type: 'item',
            url: '/department/SplitUserPackingtypeWarehouse',

            breadcrumbs: false
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
                {
                    id: 'GetSafetyProductionRecord',
                    title: '获取安全生产信息',
                    type: 'item',
                    url: '/department/GetSafetyProductionRecord',
                },
                {
                    id: 'GetSalesSecurityCheckRecord',
                    title: '获取销售安检信息',
                    type: 'item',
                    url: '/department/GetSalesSecurityCheckRecord',
                },
                {
                    id: 'GetSpotCheckCommodityQualityRecord',
                    title: '获取商品抽检信息',
                    type: 'item',
                    url: '/department/GetSpotCheckCommodityQualityRecord',
                },
                {
                    id: 'GetWarningRecord',
                    title: '获取警告记录',
                    type: 'item',
                    url: '/department/GetWarningRecord',
                },
            ]
        },
    ]
};

export default department;
