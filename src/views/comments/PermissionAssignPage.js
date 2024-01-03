import React, {useMemo} from 'react';
import {Form} from "@douyinfe/semi-ui";
import users from '../../menu-items/users'
import ReorderIcon from "@mui/icons-material/Reorder";
// const users = {
//     id: 'users',
//     title: '业务管理',
//     type: 'group',
//     children: [
//         {
//             id: 'UserBasicInfoid',
//             title: '会员管理',
//             type: 'collapse',
//             icon: ReorderIcon,
//             children:
//                 [
//                     {
//                         id: 'UserBasicInfo',
//                         title: '会员查询',
//                         type: 'item',
//                         url: '/users/UserBasicInfo',
//                         breadcrumbs: false
//                     },
//                     {
//                         id: 'VagueQueryUserInfo',
//                         title: '模糊查询',
//                         type: 'item',
//                         url: '/users/VagueQueryUserInfo',
//
//                         breadcrumbs: false
//                     },
//                     {
//                         id: 'AddUserBasicInfo',
//                         title: '开户办卡',
//                         type: 'item',
//                         url: '/users/AddUserBasicInfo',
//                         breadcrumbs: false
//                     },
//                     {
//                         id: 'UpdateUserBasicInfo',
//                         title: '修改用户资料',
//                         type: 'item',
//                         url: '/users/UpdateUserBasicInfo',
//
//                         breadcrumbs: false
//                     },
//
//                     {
//                         id: 'Invoice',
//                         title: '电子发票',
//                         type: 'item',
//                         url: '/users/Invoice',
//
//                         breadcrumbs: false
//                     },
//                     {
//                         id: 'UserCallRegistrationList',
//                         title: '用户通话登记信息记录',
//                         type: 'item',
//                         url: '/users/UserCallRegistrationList',
//
//                         breadcrumbs: false
//                     },
//                     {
//                         id: 'EditUserExclusiveSalesman',
//                         title: '编辑用户专属业务员',
//                         type: 'item',
//                         url: '/users/EditUserExclusiveSalesman',
//                         breadcrumbs: false
//                     },
//                     {
//                         id: 'business',
//                         title: '用户业务办理',
//                         type: 'collapse',
//
//                         children: [
//                             {
//                                 id: 'CreateUserGoodsSalesMashup',
//                                 title: '办理用户 商品捆绑销售方案',
//                                 type: 'item',
//                                 url: '/users/CreateUserGoodsSalesMashup'
//                             },
//                             {
//                                 id: 'login3',
//                                 title: '抵押物办理',
//                                 type: 'item',
//                                 url: '/users/business'
//                             },
//                             {
//                                 id: 'UserBottleEntry',
//                                 title: '用户带瓶资料录入',
//                                 type: 'item',
//                                 url: '/users/UserBottleEntry'
//                             },
//                             {
//                                 id: 'CollectUserPackingtypeMaterialNoTraceTheSource',
//                                 title: '收取用户带入包装物物资信息（非溯源）',
//                                 type: 'item',
//                                 url: '/users/CollectUserPackingtypeMaterialNoTraceTheSource'
//                             },
//                             {
//                                 id: 'ApplyUserGoodsSalespromotion',
//                                 title: '申请用户商品优惠',
//                                 type: 'item',
//                                 url: '/users/ApplyUserGoodsSalespromotion'
//                             },
//                             {
//                                 id: 'ApplyUserPackingtypeChargeSalespromotion',
//                                 title: '申请用户包装物费用优惠',
//                                 type: 'item',
//                                 url: '/users/ApplyUserPackingtypeChargeSalespromotion'
//                             },
//                             {
//                                 id: 'ApplyUserPackingtypeSalespromotion',
//                                 title: '申请用户包装物办理方式价格优惠',
//                                 type: 'item',
//                                 url: '/users/ApplyUserPackingtypeSalespromotion'
//                             },
//                             {
//                                 id: 'BuyUserPackingtypeMaterial',
//                                 title: '收购包装物物资',
//                                 type: 'item',
//                                 url: '/users/BuyUserPackingtypeMaterial'
//                             },
//                             {
//                                 id: 'CollectUserPackingtypeCharge',
//                                 title: '收取用户包装物缴费',
//                                 type: 'item',
//                                 url: '/users/CollectUserPackingtypeCharge'
//                             },
//                             {
//                                 id: 'RetreatUserPackingtypeMaterial',
//                                 title: '办理用户包装物退物资',
//                                 type: 'item',
//                                 url: '/users/RetreatUserPackingtypeMaterial'
//                             },
//                             {
//                                 id: 'RetreatUserPackingtypeMoney.',
//                                 title: '办理用户包装物退款项',
//                                 type: 'item',
//                                 url: '/users/RetreatUserPackingtypeMoney'
//                             },
//                             {
//                                 id: 'RetreatUserGoodsWarehouse.',
//                                 title: '退用户商品库存',
//                                 type: 'item',
//                                 url: '/users/RetreatUserGoodsWarehouse'
//                             },
//                             {
//                                 id: 'ApplyAdjustUserQuota.',
//                                 title: '申请用户信用额度',
//                                 type: 'item',
//                                 url: '/users/ApplyAdjustUserQuota'
//                             },
//
//                             {
//                                 id: 'UserRecharge',
//                                 title: '用户充值',
//                                 type: 'item',
//                                 url: '/users/UserRecharge'
//                             },
//
//                             {
//                                 id: 'UserRefund',
//                                 title: '用户退款',
//                                 type: 'item',
//                                 url: '/users/UserRefund'
//                             },
//
//                             {
//                                 id: 'UserPreferentialRecharge',
//                                 title: '用户专项款办理充值',
//                                 type: 'item',
//                                 url: '/users/UserPreferentialRecharge'
//                             },
//                             {
//                                 id: 'CreateUserPackingtypeArchives',
//                                 title: '创建用户代充瓶包装物档案信息',
//                                 type: 'item',
//                                 url: '/users/CreateUserPackingtypeArchives'
//                             },
//
//                         ]
//                     },
//                 ],
//             breadcrumbs: false
//         },
//         {
//             id: 'orderid',
//             title: '订单业务',
//             type: 'collapse',
//             icon: ReorderIcon,
//             children:  [
//                 {
//                     id: 'OrderList',
//                     title: '安排订单',
//                     type: 'item',
//                     url: '/order/OrderList',
//
//                     breadcrumbs: false
//                 } ,
//                 {
//                     id: 'OtherServicesOrderList',
//                     title: '门店业务',
//
//                     type: 'item',
//                     url: '/order/OtherServicesOrderList',
//                     breadcrumbs: false
//                 },
//                 {
//                     id: 'GetPrintInfo',
//                     title: '打印列表',
//
//                     type: 'item',
//                     url: '/order/GetPrintInfo',
//                     breadcrumbs: false
//                 },
//                 {
//                     id: 'GetCtiErrorRecord',
//                     title: '自助错误信息',
//
//                     type: 'item',
//                     url: '/order/GetCtiErrorRecord',
//                     breadcrumbs: false
//                 },
//             ]
//         },
//         {
//             id: 'materialid',
//             title: '物资管理',
//             type: 'collapse',
//             icon: ReorderIcon,
//             children: [
//
//                 {
//                     id: 'OpeHoldPackingtypeInfo',
//                     title: '员工持有包装物',
//                     type: 'item',
//                     url: '/material/OpeHoldPackingtypeInfo',
//
//                     breadcrumbs: false
//                 },
//                 {
//                     id: 'MaterialPackingtypeArchivesList',
//                     title: '钢瓶档案列表',
//                     type: 'item',
//                     url: '/material/MaterialPackingtypeArchivesList',
//
//                     breadcrumbs: false
//                 },
//                 {
//                     id: 'MaterialPackingtypeBasicArchives',
//                     title: '包装物原始档案信息',
//                     type: 'item',
//                     url: '/material/MaterialPackingtypeBasicArchives',
//
//                     breadcrumbs: false
//                 },
//                 {
//                     id: 'CreateMaterialPackingtypeArchives',
//                     title: '钢瓶新增',
//                     type: 'item',
//                     url: '/material/CreateMaterialPackingtypeArchives',
//
//                     breadcrumbs: false
//                 },
//                 {
//                     id: 'GetTransportBatchnumberInfo',
//                     title: '获取部门车次信息',
//                     type: 'item',
//                     url: '/material/GetTransportBatchnumberInfo',
//                 },
//
//                 {
//                     id: 'InventoryAlert',
//                     title: '获取库存预警信息',
//                     type: 'item',
//                     url: '/material/InventoryAlert',
//                 },
//
//                 {
//                     id: 'marteril',
//                     title: '物资调运',
//                     type: 'collapse',
//
//                     children: [
//                         {
//                             id: 'MaterialTransferPlanRecord',
//                             title: '获取物资计划调拨记录',
//                             type: 'item',
//                             url: '/material/MaterialTransferPlanRecord'
//                         },
//                         {
//                             id: 'ApplyMaterialTransferPlan',
//                             title: '申请物资调运计划',
//                             type: 'item',
//                             url: '/material/ApplyMaterialTransferPlan'
//                         },
//
//                         {
//                             id: 'MChangeMaterialType',
//                             title: '转换包装物物资类型',
//                             type: 'item',
//                             url: '/material/MChangeMaterialType'
//                         },
//
//                         {
//                             id: 'NoScanTransferMaterial',
//                             title: '非扫描方式调运物资',
//                             type: 'item',
//                             url: '/material/NoScanTransferMaterial'
//                         },
//                         {
//                             id: 'TransferMaterialRecord',
//                             title: '移交包装物',
//                             type: 'item',
//                             url: '/material/TransferMaterialRecord'
//                         },
//                         {
//                             id: 'SignTransportRecord',
//                             title: '签封调运记录',
//                             type: 'item',
//                             url: '/material/SignTransportRecord'
//                         },
//                         {
//                             id: 'HandleMaterial',
//                             title: '处理包装物物资',
//                             type: 'item',
//                             url: '/department/HandleMaterial',
//
//                             breadcrumbs: false
//                         },
//                         {
//                             id: 'OpeAbnormalExchangeRecord',
//                             title: '员工异常交换记录',
//                             type: 'item',
//                             url: '/material/OpeAbnormalExchangeRecord',
//
//                             breadcrumbs: false
//                         },
//                     ]
//                 },
//
//
//             ]
//         },
//         {
//             id: 'departmentid',
//             title: '门店管理',
//             type: 'collapse',
//             icon: ReorderIcon,
//             children: [
//                 {
//                     id: 'AddContributionRecord',
//                     title: '录入缴款记录',
//                     type: 'item',
//                     url: '/department/AddContributionRecord',
//
//                     breadcrumbs: false
//                 },
//                 {
//                     id: 'MaterialCirculationRecord',
//                     title: '包装物流转信息',
//                     type: 'item',
//                     url: '/department/MaterialCirculationRecord',
//
//                     breadcrumbs: false
//                 },
//                 {
//                     id: 'AddDistributionSubsidyOfCompanyRecord',
//                     title: '添加商品配送公司补贴',
//                     type: 'item',
//                     url: '/department/AddDistributionSubsidyOfCompanyRecord',
//
//                     breadcrumbs: false
//                 },
//                 {
//                     id: 'GetCanRevokeBusiness',
//                     title: '门店可取消业务',
//                     type: 'item',
//                     url: '/department/GetCanRevokeBusiness',
//
//                     breadcrumbs: false
//                 },
//                 {
//                     id: 'DepartmentUserOrderInfo',
//                     title: '订单监控',
//                     type: 'item',
//                     url: '/department/DepartmentUserOrderInfo',
//
//                     breadcrumbs: false
//                 },
//                 {
//                     id: 'GetResidualGasToBeConfirmedRecord',
//                     title: '获取待确认退瓶存瓶余气记录',
//                     type: 'item',
//                     url: '/department/GetResidualGasToBeConfirmedRecord',
//
//                     breadcrumbs: false
//                 },
//                 {
//                     id: 'MergeUserPackingtypeWarehouse',
//                     title: '合并用户包装物仓库数据(周转非扫描类)',
//                     type: 'item',
//                     url: '/department/MergeUserPackingtypeWarehouse',
//
//                     breadcrumbs: false
//                 },
//                 {
//                     id: 'SplitUserPackingtypeWarehouse',
//                     title: '拆分用户包装物仓库数据',
//                     type: 'item',
//                     url: '/department/SplitUserPackingtypeWarehouse',
//
//                     breadcrumbs: false
//                 },
//                 {
//                     id: 'SpotCheckCommodityQuality',
//                     title: '商品抽检录入',
//                     type: 'item',
//                     url: '/department/SpotCheckCommodityQuality',
//                 },
//                 // {
//                 //     id: 'PackingInspect',
//                 //     title: '商品抽检录入',
//                 //     type: 'item',
//                 //     url: '/department/PackingInspect',
//                 // },
//                 {
//                     id: 'AdvancePaymentOrderList',
//                     title: '预支付订单查询',
//                     type: 'item',
//                     url: '/department/AdvancePaymentOrderList',
//                 },
//                 {
//                     id: 'WorkSafety',
//                     title: '安检信息',
//                     type: 'collapse',
//                     children: [
//                         {
//                             id: 'GetPackingInspectRecord',
//                             title: '获取包装物检查信息',
//                             type: 'item',
//                             url: '/department/GetPackingInspectRecord',
//                         },
//                         {
//                             id: 'GetSafetyProductionRecord',
//                             title: '获取安全生产信息',
//                             type: 'item',
//                             url: '/department/GetSafetyProductionRecord',
//                         },
//                         {
//                             id: 'GetSalesSecurityCheckRecord',
//                             title: '获取销售安检信息',
//                             type: 'item',
//                             url: '/department/GetSalesSecurityCheckRecord',
//                         },
//                         {
//                             id: 'GetSpotCheckCommodityQualityRecord',
//                             title: '获取商品抽检信息',
//                             type: 'item',
//                             url: '/department/GetSpotCheckCommodityQualityRecord',
//                         },
//                         {
//                             id: 'GetWarningRecord',
//                             title: '获取警告记录',
//                             type: 'item',
//                             url: '/department/GetWarningRecord',
//                         },
//                     ]
//                 },
//             ]
//         },
//         {
//             id: 'otherid',
//             title: '其他业务',
//             type: 'collapse',
//             icon: ReorderIcon,
//             children: [
//                 {
//                     id: 'SendGiveProgrammeToSalesman',
//                     title: '授于业务员可赠送方案数量',
//                     type: 'item',
//                     url: '/other/SendGiveProgrammeToSalesman',
//                     breadcrumbs: false
//                 },
//                 {
//                     id: 'GetOpeDailyWorkLoad',
//                     title: '获取员工工作量',
//                     type: 'item',
//                     url: '/other/GetOpeDailyWorkLoad',
//                     breadcrumbs: false
//                 },
//                 {
//                     id: 'UserListOfSalesman',
//                     title: '获取业务员维护用户列表',
//                     type: 'item',
//                     url: '/other/UserListOfSalesman',
//                     breadcrumbs: false
//                 },
//                 {
//                     id: 'UserListOfDepartment',
//                     title: '部门用户列表',
//                     type: 'item',
//                     url: '/other/UserListOfDepartment',
//                     breadcrumbs: false
//                 },
//                 {
//                     id: 'GetUserDiscountApplicationsList',
//                     title: '获取用户各项优惠记录列表',
//                     type: 'item',
//                     url: '/other/GetUserDiscountApplicationsList',
//                     breadcrumbs: false
//                 },
//                 {
//                     id: 'InvoiceRecordList',
//                     title: '已开具发票记录',
//                     type: 'item',
//                     url: '/other/InvoiceRecordList',
//                     breadcrumbs: false
//                 },
//                 {
//                     id: 'GetUserInfoOfMateralCode',
//                     title: '获取包装物号码持有人信息',
//                     type: 'item',
//                     url: '/other/GetUserInfoOfMateralCode',
//                     breadcrumbs: false
//                 },
//                 {
//                     id: 'GetOpeMinLoginRecord',
//                     title: '员工登录记录',
//                     type: 'item',
//                     url: '/other/GetOpeMinLoginRecord',
//                     breadcrumbs: false
//                 },
//                 {
//                     id: 'GetOtherAvailableSubsidyRecord',
//                     title: '获取可申请补贴记录',
//                     type: 'item',
//                     url: '/other/GetOtherAvailableSubsidyRecord',
//                     breadcrumbs: false
//                 },
//                 {
//                     id: 'GetOtherSubsidyRecord',
//                     title: '获取已申请补贴记录',
//                     type: 'item',
//                     url: '/other/GetOtherSubsidyRecord',
//                     breadcrumbs: false
//                 }
//             ]
//         },
//         {
//             id: 'reportid',
//             title: '数据报表',
//             type: 'collapse',
//             icon: ReorderIcon,
//             children: [
//                 {
//                     id: 'report1',
//                     type: 'collapse',
//                     title: '业务报表',
//                     children: [
//                         {
//                             id: 'DeliverymanWorkFloorStatistics',
//                             title: '配送员工作楼层统计',
//                             type: 'item',
//                             url: '/report/DeliverymanWorkFloorStatistics',
//                             breadcrumbs: false
//                         },
//                         {
//                             id: 'DeliverymanWorkFloorStatisticsDetailed',
//                             title: '配送员工作楼层统计明细',
//                             type: 'item',
//                             url: '/report/DeliverymanWorkFloorStatisticsDetailed',
//                             breadcrumbs: false
//                         },
//                         {
//                             id: 'NewUserTransactionsStatistics',
//                             title: '新户交易统计',
//                             type: 'item',
//                             url: '/report/NewUserTransactionsStatistics',
//                             breadcrumbs: false
//                         },
//                         {
//                             id: 'NewUserTransactionsStatisticsDetailed',
//                             title: '新户交易统计明细',
//                             type: 'item',
//                             url: '/report/NewUserTransactionsStatisticsDetailed',
//                             breadcrumbs: false
//                         },
//                         {
//                             id: 'OtherServicesReport',
//                             title: '其它服务报表',
//                             type: 'item',
//                             url: '/report/OtherServicesReport',
//                             breadcrumbs: false
//                         },
//                         {
//                             id: 'OtherServicesReportDetailed',
//                             title: '其它服务报表明细',
//                             type: 'item',
//                             url: '/report/OtherServicesReportDetailed',
//                             breadcrumbs: false
//                         },
//                         {
//                             id: 'OverdueSalesArrearsRecord',
//                             title: '超期销售欠款记录',
//                             type: 'item',
//                             url: '/report/OverdueSalesArrearsRecord',
//                             breadcrumbs: false
//                         },
//                         {
//                             id: 'ResidualAirRecord',
//                             title: '余气记录',
//                             type: 'item',
//                             url: '/report/ResidualAirRecord',
//                             breadcrumbs: false
//                         },
//                         {
//                             id: 'SalesArrearsRecord',
//                             title: '销售欠款记录',
//                             type: 'item',
//                             url: '/report/SalesArrearsRecord',
//                             breadcrumbs: false
//                         },
//                         {
//                             id: 'SustainSalesStatistics',
//                             title: '归属部门业务员维系用户销售统计',
//                             type: 'item',
//                             url: '/report/SustainSalesStatistics',
//                             breadcrumbs: false
//                         },
//                         {
//                             id: 'UnconfirmedCollectionRecord',
//                             title: '未确认回款记录(不含月结欠款现结欠款)',
//                             type: 'item',
//                             url: '/report/UnconfirmedCollectionRecord',
//                             breadcrumbs: false
//                         },
//                         {
//                             id: 'UserCallRegistrationReport',
//                             title: '用户通话登记报表',
//                             type: 'item',
//                             url: '/report/UserCallRegistrationReport',
//                             breadcrumbs: false
//                         },
//                         {
//                             id: 'UserLastTransactionsRecord',
//                             title: '用户最后一次交易记录',
//                             type: 'item',
{/*                            url: '/report/UserLastTransactionsRecord',*/}
{/*                            breadcrumbs: false*/}
{/*                        },*/}
{/*                        {*/}
{/*                            id: 'UserSalesStatistics',*/}
{/*                            title: '用户群组时间段销量统计(折吨)',*/}
{/*                            type: 'item',*/}
{/*                            url: '/report/UserSalesStatistics',*/}
{/*                            breadcrumbs: false*/}
{/*                        },*/}
{/*                        {*/}
{/*                            id: 'UserTransactionsRecordOfFrequency',*/}
//                             title: '某段时间开户用户在某段时间第N次交易记录',
//                             type: 'item',
//                             url: '/report/UserTransactionsRecordOfFrequency',
//                             breadcrumbs: false
//                         },
//                         {
//                             id: 'WiringSalesReport',
{/*                            title: '接线销售报表',*/}
{/*                            type: 'item',*/}
{/*                            url: '/report/WiringSalesReport',*/}
{/*                            breadcrumbs: false*/}
{/*                        },*/}
//                         {
//                             id: 'WriteOffCommodityVoucherRecord',
{/*                            title: '获取核销商品抵扣凭证记录',*/}
//                             type: 'item',
//                             url: '/report/WriteOffCommodityVoucherRecord',
//                             breadcrumbs: false
//                         },
//                     ]
//                 },
//                 {
//                     id: 'report2',
//                     type: 'collapse',
{/*                    title: '财务报表',*/}
{/*                    children: [*/}
{/*                        {*/}
{/*                            id: 'ArrearsCollectionReport',*/}
//                             title: '获取欠款收款报表(回款)',
//                             type: 'item',
//                             url: '/report/ArrearsCollectionReport',
//                             breadcrumbs: false
//                         },
//                         {
//                             id: 'CollectionReport',
//                             title: '获取收款报表',
//                             type: 'item',
//                             url: '/report/CollectionReport',
//                             breadcrumbs: false
//                         },
//                         {
//                             id: 'DistributionSubsidyOfCompanyReport',
//                             title: '获取公司补贴运费报表',
//                             type: 'item',
//                             url: '/report/DistributionSubsidyOfCompanyReport',
//                             breadcrumbs: false
//                         },
//                         {
//                             id: 'SalesReport',
//                             title: '获取销售报表',
//                             type: 'item',
//                             url: '/report/SalesReport',
{/*                            breadcrumbs: false*/}
{/*                        },*/}
{/*                        {*/}
{/*                            id: 'SalesReportOfPrice',*/}
//                             title: '获取销售报表(单价分组)',
//                             type: 'item',
//                             url: '/report/SalesReportOfPrice',
//                             breadcrumbs: false
{/*                        },*/}
//                         {
//                             id: 'OtherSubsidyReport',
//                             title: '其它补贴报表',
//                             type: 'item',
//                             url: '/report/OtherSubsidyReport',
//                             breadcrumbs: false
//                         },
//                     ]
//                 },
//                 {
//                     id: 'report3',
//                     type: 'collapse',
//                     title: '物资报表',
//                     children: [
//                         {
{/*                            id: 'BorrowPackingtypeReport',*/}
//                             title: '获取借用包装物报表',
//                             type: 'item',
{/*                            url: '/report/BorrowPackingtypeReport',*/}
{/*                            breadcrumbs: false*/}
{/*                        },*/}
{/*                        {*/}
{/*                            id: 'NoTraceTheSourceMaterialStockReport',*/}
{/*                            title: '获取非溯源类包装物库存报表',*/}
{/*                            type: 'item',*/}
{/*                            url: '/report/NoTraceTheSourceMaterialStockReport',*/}
{/*                            breadcrumbs: false*/}
{/*                        },*/}
{/*                        {*/}
//                             id: 'PackingtypeUseBillReport',
//                             title: '获取包装物使用票据报表',
//                             type: 'item',
//                             url: '/report/PackingtypeUseBillReport',
//                             breadcrumbs: false
//                         },
//                         {
{/*                            id: 'SignTransportRecordReport',*/}
{/*                            title: '获取签封方式调运记录报表',*/}
{/*                            type: 'item',*/}
{/*                            url: '/report/SignTransportRecordReport',*/}
//                             breadcrumbs: false
//                         },
//                         {
//                             id: 'TraceTheSourceMaterialStockReport',
//                             title: '获取溯源类包装物库存报表',
//                             type: 'item',
//                             url: '/report/TraceTheSourceMaterialStockReport',
//                             breadcrumbs: false
//                         },
//                         {
//                             id: 'TraceTheSourceMaterialStockBookkeepingInfo',
{/*                            title: '获取溯源类包装物库存记账信息',*/}
//                             type: 'item',
{/*                            url: '/report/TraceTheSourceMaterialStockBookkeepingInfo',*/}
{/*                            breadcrumbs: false*/}
{/*                        },*/}

//                         {
//                             id: 'DeliveryUserCommodityReport',
//                             title: '配送用户商品报表',
//                             type: 'item',
//                             url: '/report/DeliveryUserCommodityReport',
//                             breadcrumbs: false
//                         },
//                         {
//                             id: 'OutstandingOrdersReport',
//                             title: '未完成订单报表',
//                             type: 'item',
//                             url: '/report/OutstandingOrdersReport',
//                             breadcrumbs: false
//                         },
//
//                     ]
//                 },
//                 {
//                     id: 'report4',
//                     type: 'collapse',
//                     title: '商用气数据查询',
//                     children: [
//                         {
//                             id: 'SYQKHCXTable',
//                             title: '商用气客户查询表',
//                             type: 'item',
{/*                            url: '/report/SYQKHCXTable',*/}
{/*                            breadcrumbs: false*/}
{/*                        },*/}

{/*                        {*/}
//                             id: 'SYQKHYHCXTable',
//                             title: '商用气客户优惠查询表',
//                             type: 'item',
//                             url: '/report/SYQKHYHCXTable',
{/*                            breadcrumbs: false*/}
//                         },
//                         {
//                             id: 'SyqRetreatUserPackingtypeMaterialNotMoneyTable',
//                             title: '商用气退包装物未退款表',
//                             type: 'item',
//                             url: '/report/SyqRetreatUserPackingtypeMaterialNotMoneyTable',
//                             breadcrumbs: false
//                         },
//
//                         {
{/*                            id: 'SYQRetreatUserPackingtypeMoneyTable',*/}
//                             title: '商用气用户办理包装物退款表',
//                             type: 'item',
//                             url: '/report/SYQRetreatUserPackingtypeMoneyTable',
{/*                            breadcrumbs: false*/}
//                         },
//
{/*                        {*/}
{/*                            id: 'SYQSalesStatisticsTable',*/}
{/*                            title: '商用气销量统计',*/}
{/*                            type: 'item',*/}
{/*                            url: '/report/SYQSalesStatisticsTable',*/}
{/*                            breadcrumbs: false*/}
{/*                        },*/}

{/*                        {*/}
{/*                            id: 'SYQSalesmanHoldUserTable',*/}
//                             title: '商用气业务员名下用户查询表',
//                             type: 'item',
//                             url: '/report/SYQSalesmanHoldUserTable',
//                             breadcrumbs: false
//                         },
//
//                         {
//                             id: 'SYQSalesmanHoldUserTransactionTable',
//                             title: '商用气业务员管理用户交易户数表',
//                             type: 'item',
//                             url: '/report/SYQSalesmanHoldUserTransactionTable',
//                             breadcrumbs: false
//                         },
//                         {
//                             id: 'SYQSalesmanSalesCostTable',
//                             title: '商用气业务员销售费用表',
//                             type: 'item',
//                             url: '/report/SYQSalesmanSalesCostTable',
//                             breadcrumbs: false
//                         },
//
//                         {
//                             id: 'SyqUserFollowUpTable',
//                             title: '商用气用户回访统计表',
//                             type: 'item',
//                             url: '/report/SyqUserFollowUpTable',
//                             breadcrumbs: false
//                         },
//
//                         {
//                             id: 'SYQUserFollowUpTaskRecordTable',
//                             title: '商用气用户回访任务记录表',
//                             type: 'item',
//                             url: '/report/SYQUserFollowUpTaskRecordTable',
//                             breadcrumbs: false
//                         },
//
//                         {
//                             id: 'SYQUserOtherServicesRecordTable',
//                             title: '商用气用户其它服务记录表',
//                             type: 'item',
//                             url: '/report/SYQUserOtherServicesRecordTable',
//                             breadcrumbs: false
//                         },
//
//                         {
//                             id: 'SYQUserSalesGoodsDifferenceTable',
//                             title: '商用气用户换气差异表',
//                             type: 'item',
//                             url: '/report/SYQUserSalesGoodsDifferenceTable',
//                             breadcrumbs: false
//                         },
//
//                         {
//                             id: 'SYQUserTransferTable',
//                             title: '商用气用户移交记录',
//                             type: 'item',
//                             url: '/report/SYQUserTransferTable',
//                             breadcrumbs: false
//                         },
//
//                     ]
//                 },
//
//             ]
//         },
//
//     ]
// };
const PermissionAssignPage = () => {
    const initData = JSON.parse(localStorage.getItem('initData'))
    const loginuser = JSON.parse(localStorage.getItem('userinfo'))


    // 将user.children转换为treeData一样的结构
    const list = {
        label: users.title,
        value: users.url,
        key: users.id,
        children: users.children.map((item)=>{

            return {
                label: item.title,
                value: item?.url,
                key: item.id,
                children: item.children ? (item.children.map((items)=>{

                    return {
                        label: items.title,
                        value: items.url,
                        key: items.id,
                        children: items?.children?.map((itemss)=>{
                            return {
                                label: itemss.title,
                                value: itemss.url,
                                key: itemss.id,
                            }
                        })
                    }
                })): []
            }
        })
    }

    console.log(list)



    return (
        <div>
            <Form>
                <Form.Select field={'role'} label={'角色'} placeholder={'请选择角色'} style={{width: '100%'}}>
                    {initData.QuartersList.map((item, index) => {
                        return <Form.Select.Option key={index} value={item.name}>{item.name}</Form.Select.Option>
                    })}
                </Form.Select>



                <Form.TreeSelect
                    multiple
                    filterTreeNode
                    field={'menus'}
                    label={'菜单'}
                    leafOnly
                    placeholder={'请选择菜单'}
                    style={{width: '100%'}}
                    treeData={list.children}
                    onChange={e=>console.log(e)}

                />
            </Form>
        </div>
    );
};

export default PermissionAssignPage;
