// assets
import { IconBrandChrome, IconHelp } from '@tabler/icons';

// constant
const icons = { IconBrandChrome, IconHelp };

// ==============================|| SAMPLE PAGE & DOCUMENTATION MENU ITEMS ||============================== //

const report = {
    id: 'report',
    type: 'group',
    title: '统计报表',
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
                {
                    id: 'DeliverymanWorkFloorStatisticsDetailed',
                    title: '配送员工作楼层统计明细',
                    type: 'item',
                    url: '/report/DeliverymanWorkFloorStatisticsDetailed',
                    breadcrumbs: false
                },
                {
                    id: 'NewUserTransactionsStatistics',
                    title: '新户交易统计',
                    type: 'item',
                    url: '/report/NewUserTransactionsStatistics',
                    breadcrumbs: false
                },
                {
                    id: 'NewUserTransactionsStatisticsDetailed',
                    title: '新户交易统计明细',
                    type: 'item',
                    url: '/report/NewUserTransactionsStatisticsDetailed',
                    breadcrumbs: false
                },
                {
                    id: 'OtherServicesReport',
                    title: '其它服务报表',
                    type: 'item',
                    url: '/report/OtherServicesReport',
                    breadcrumbs: false
                },
                {
                    id: 'OtherServicesReportDetailed',
                    title: '其它服务报表明细',
                    type: 'item',
                    url: '/report/OtherServicesReportDetailed',
                    breadcrumbs: false
                },
                {
                    id: 'OverdueSalesArrearsRecord',
                    title: '超期销售欠款记录',
                    type: 'item',
                    url: '/report/OverdueSalesArrearsRecord',
                    breadcrumbs: false
                },
                {
                    id: 'ResidualAirRecord',
                    title: '余气记录',
                    type: 'item',
                    url: '/report/ResidualAirRecord',
                    breadcrumbs: false
                },
                {
                    id: 'SalesArrearsRecord',
                    title: '销售欠款记录',
                    type: 'item',
                    url: '/report/SalesArrearsRecord',
                    breadcrumbs: false
                },
                {
                    id: 'SustainSalesStatistics',
                    title: '归属部门业务员维系用户销售统计',
                    type: 'item',
                    url: '/report/SustainSalesStatistics',
                    breadcrumbs: false
                },
                {
                    id: 'UnconfirmedCollectionRecord',
                    title: '未确认回款记录(不含月结欠款现结欠款)',
                    type: 'item',
                    url: '/report/UnconfirmedCollectionRecord',
                    breadcrumbs: false
                },
                {
                    id: 'UserCallRegistrationReport',
                    title: '用户通话登记报表',
                    type: 'item',
                    url: '/report/UserCallRegistrationReport',
                    breadcrumbs: false
                },
                {
                    id: 'UserLastTransactionsRecord',
                    title: '用户最后一次交易记录',
                    type: 'item',
                    url: '/report/UserLastTransactionsRecord',
                    breadcrumbs: false
                },
                {
                    id: 'UserSalesStatistics',
                    title: '用户群组时间段销量统计(折吨)',
                    type: 'item',
                    url: '/report/UserSalesStatistics',
                    breadcrumbs: false
                },
                {
                    id: 'UserTransactionsRecordOfFrequency',
                    title: '某段时间开户用户在某段时间第N次交易记录',
                    type: 'item',
                    url: '/report/UserTransactionsRecordOfFrequency',
                    breadcrumbs: false
                },
                {
                    id: 'WiringSalesReport',
                    title: '接线销售报表',
                    type: 'item',
                    url: '/report/WiringSalesReport',
                    breadcrumbs: false
                },
                {
                    id: 'WriteOffCommodityVoucherRecord',
                    title: '获取核销商品抵扣凭证记录',
                    type: 'item',
                    url: '/report/WriteOffCommodityVoucherRecord',
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
                {
                    id: 'CollectionReport',
                    title: '获取收款报表',
                    type: 'item',
                    url: '/report/CollectionReport',
                    breadcrumbs: false
                },
                {
                    id: 'DistributionSubsidyOfCompanyReport',
                    title: '获取公司补贴运费报表',
                    type: 'item',
                    url: '/report/DistributionSubsidyOfCompanyReport',
                    breadcrumbs: false
                },
                {
                    id: 'SalesReport',
                    title: '获取销售报表',
                    type: 'item',
                    url: '/report/SalesReport',
                    breadcrumbs: false
                },
                {
                    id: 'SalesReportOfPrice',
                    title: '获取销售报表(单价分组)',
                    type: 'item',
                    url: '/report/SalesReportOfPrice',
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
                {
                    id: 'NoTraceTheSourceMaterialStockReport',
                    title: '获取非溯源类包装物库存报表',
                    type: 'item',
                    url: '/report/NoTraceTheSourceMaterialStockReport',
                    breadcrumbs: false
                },
                {
                    id: 'PackingtypeUseBillReport',
                    title: '获取包装物使用票据报表',
                    type: 'item',
                    url: '/report/PackingtypeUseBillReport',
                    breadcrumbs: false
                },
                {
                    id: 'SignTransportRecordReport',
                    title: '获取签封方式调运记录报表',
                    type: 'item',
                    url: '/report/SignTransportRecordReport',
                    breadcrumbs: false
                },
                {
                    id: 'TraceTheSourceMaterialStockReport',
                    title: '获取溯源类包装物库存报表',
                    type: 'item',
                    url: '/report/TraceTheSourceMaterialStockReport',
                    breadcrumbs: false
                },
                {
                    id: 'TraceTheSourceMaterialStockBookkeepingInfo',
                    title: '获取溯源类包装物库存记账信息',
                    type: 'item',
                    url: '/report/TraceTheSourceMaterialStockBookkeepingInfo',
                    breadcrumbs: false
                },

            ]
        },

    ]
};

export default report;
