import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import ReorderIcon from "@mui/icons-material/Reorder";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import RepeatIcon from "@mui/icons-material/Repeat";
import AddIcon from "@mui/icons-material/Add";
import FinanceSalesExpress from "../views/report/FinanceSalesExpress";
import SCBResidualAirRecord from "../views/report/SCBResidualAirRecord";
import GetWanderAboutRecord from "../views/other/GetWanderAboutRecord";
import RepairPartsTypeList from "../views/sys/RepairPartsTypeList";
import GetCostPrice from "../views/repair/GetCostPrice";
import GetOpeInventory from "../views/repair/GetOpeInventory";

// ==============================|| DASHBOARD MENU ITEMS ||============================== //


const users = {
    id: 'users',
    title: '业务管理',
    type: 'group',
    children: [
        {
            id: 'GetFinanceCollectionProjectConfig',
            title: '获取财务收款项目配置',
            type: 'item',
            url: '/sys/GetFinanceCollectionProjectConfig',
            children: []
        },
        {
            id: 'chat',
            title: '在线客服',
            type: 'item',
            url: '/chat',
            children: []
        },
        {
            id: 'departmentqrcpde',
            title: '部门二维码',
            type: 'item',
            url: '/departmentqrcpde',
            children: []
        },
        {
            id: 'GetInvoiceKpr',
            title: '获取发票开票人',
            type: 'item',
            url: '/sys/GetInvoiceKpr',
            children: []
        },
        {
            id: 'GetFillRecordList',
            title: '充装管理',
            type: 'collapse',

            children: [
                {
                    id: 'GetFillInspectors',
                    title: '获取充装检查人员',
                    type: 'item',
                    url: '/sys/GetFillInspectors',
                },
                {
                    id: 'GetFillRecord',
                    title: '充装记录',
                    type: 'item',
                    url: '/other/GetFillRecord',
                },
                {
                    id: 'GetFillBeforeInspectRecord',
                    title: '充前检查',
                    type: 'item',
                    url: '/other/GetFillBeforeInspectRecord',
                },
                {
                    id: 'GetFillAfterInspectRecord',
                    title: '充后检查',
                    type: 'item',
                    url: '/other/GetFillAfterInspectRecord',
                },
                {
                    id: 'GetWanderAboutRecord',
                    title: '钢瓶流转信息',
                    type: 'item',
                    url: '/other/GetWanderAboutRecord',
                },
            ]
        },
        {
            id: 'UserBasicInfoid',
            title: '会员管理',
            type: 'collapse',
            // icon: ReorderIcon,
            // url: '/users/UserBasicInfoid',
            children:
                [
                    {
                        id: 'UserBasicInfo',
                        title: '会员查询',
                        type: 'item',
                        url: '/users/UserBasicInfo',
                        breadcrumbs: false
                    },
                    {
                        id: 'VagueQueryUserInfo',
                        title: '模糊查询',
                        type: 'item',
                        url: '/users/VagueQueryUserInfo',

                        breadcrumbs: false
                    },
                    {
                        id: 'AddUserBasicInfo',
                        title: '开户办卡',
                        type: 'item',
                        url: '/users/AddUserBasicInfo',
                        breadcrumbs: false
                    },
                    {
                        id: 'UpdateUserBasicInfo',
                        title: '修改用户资料',
                        type: 'item',
                        url: '/users/UpdateUserBasicInfo',

                        breadcrumbs: false
                    },

                    {
                        id: 'Invoice',
                        title: '电子发票',
                        type: 'item',
                        url: '/users/Invoice',

                        breadcrumbs: false
                    },
                    {
                        id: 'UserCallRegistrationList',
                        title: '用户通话登记信息记录',
                        type: 'item',
                        url: '/users/UserCallRegistrationList',

                        breadcrumbs: false
                    },
                    // {
                    //     id: 'EditUserExclusiveSalesman',
                    //     title: '编辑用户专属业务员',
                    //     type: 'item',
                    //     url: '/users/EditUserExclusiveSalesman',
                    //     breadcrumbs: false
                    // },
                    {
                        id: 'ownerorder',
                        title: '个人订单统计',
                        type: 'item',
                        url: '/users/ownerorder',
                        breadcrumbs: false
                    },
                    {
                        id: 'UserOtherDataList',
                        title: '获取用户其它数据列表',
                        type: 'item',
                        url: '/users/UserOtherDataList',
                        breadcrumbs: false
                    },



                ],
            breadcrumbs: false
        },
        {
            id: 'business',
            title: '用户业务办理',
            type: 'collapse',

            children: [
                {
                    id: 'RetreatUserPackingtypelist',
                    title: '办理退抵押物',
                    type: 'collapse',

                    children: [
                        {
                            id: 'RetreatUserPackingtypeMaterial',
                            title: '退物资',
                            type: 'item',
                            url: '/users/RetreatUserPackingtypeMaterial'
                        },
                        {
                            id: 'RetreatUserPackingtypeMoney.',
                            title: '退款项',
                            type: 'item',
                            url: '/users/RetreatUserPackingtypeMoney'
                        }]

                },
                {
                    id: 'CreateUserGoodsSalesMashup',
                    title: '办理用户 商品捆绑销售方案',
                    type: 'item',
                    url: '/users/CreateUserGoodsSalesMashup'
                },
                {
                    id: 'login3',
                    title: '抵押物办理',
                    type: 'item',
                    url: '/users/business'
                },
                {
                    id: 'UserBottleEntry',
                    title: '用户带瓶资料录入',
                    type: 'item',
                    url: '/users/UserBottleEntry'
                },
                {
                    id: 'CollectUserPackingtypeMaterialNoTraceTheSource',
                    title: '收取用户带入包装物物资信息（非溯源）',
                    type: 'item',
                    url: '/users/CollectUserPackingtypeMaterialNoTraceTheSource'
                },
                {
                    id: 'ApplyUserGoodsSalespromotion',
                    title: '申请用户商品优惠',
                    type: 'item',
                    url: '/users/ApplyUserGoodsSalespromotion'
                },
                {
                    id: 'ApplyUserPackingtypeChargeSalespromotion',
                    title: '申请用户包装物费用优惠',
                    type: 'item',
                    url: '/users/ApplyUserPackingtypeChargeSalespromotion'
                },
                {
                    id: 'ApplyUserPackingtypeSalespromotion',
                    title: '申请用户包装物办理方式价格优惠',
                    type: 'item',
                    url: '/users/ApplyUserPackingtypeSalespromotion'
                },
                {
                    id: 'BuyUserPackingtypeMaterial',
                    title: '收购包装物物资',
                    type: 'item',
                    url: '/users/BuyUserPackingtypeMaterial'
                },
                {
                    id: 'BuyUserTongPackingtypeMaterial',
                    title: '收购包装物物资(桶)',
                    type: 'item',
                    url: '/users/BuyUserTongPackingtypeMaterial'
                },
                {
                    id: 'CollectUserPackingtypeCharge',
                    title: '收取用户包装物缴费',
                    type: 'item',
                    url: '/users/CollectUserPackingtypeCharge'
                },


                {
                    id: 'RetreatUserGoodsWarehouse.',
                    title: '退用户商品库存',
                    type: 'item',
                    url: '/users/RetreatUserGoodsWarehouse'
                },
                {
                    id: 'ApplyAdjustUserQuota.',
                    title: '申请用户信用额度',
                    type: 'item',
                    url: '/users/ApplyAdjustUserQuota'
                },

                {
                    id: 'UserRecharge',
                    title: '用户充值',
                    type: 'item',
                    url: '/users/UserRecharge'
                },

                {
                    id: 'UserRefund',
                    title: '用户退款',
                    type: 'item',
                    url: '/users/UserRefund'
                },

                {
                    id: 'UserPreferentialRecharge',
                    title: '用户专项款办理充值',
                    type: 'item',
                    url: '/users/UserPreferentialRecharge'
                },
                {
                    id: 'CreateUserPackingtypeArchives',
                    title: '创建用户代充瓶包装物档案信息',
                    type: 'item',
                    url: '/users/CreateUserPackingtypeArchives'
                },
              {
                    id: 'BuyUserPackingtypeSaveBill',
                    title: '收购包装物存瓶单',
                    type: 'item',
                    url: '/users/BuyUserPackingtypeSaveBill'
                },


            ]
        },
        {
            id: 'orderid',
            title: '订单业务',
            type: 'collapse',
            // icon: ReorderIcon,
            children: [
                {
                    id: 'OrderList',
                    title: '安排订单',
                    type: 'item',
                    url: '/order/OrderList',

                    breadcrumbs: false
                },
                {
                    id: 'OrderListYSGS',
                    title: '运输公司安排订单',
                    type: 'item',
                    url: '/order/OrderListYSGS',

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
                    id: 'OtherServicesOrderList',
                    title: '门店业务',

                    type: 'item',
                    url: '/order/OtherServicesOrderList',
                    breadcrumbs: false
                },
                {
                    id: 'GetPrintInfo',
                    title: '打印列表',

                    type: 'item',
                    url: '/order/GetPrintInfo',
                    breadcrumbs: false
                },
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
                    id: 'InventoryMaterialDataInfo',
                    title: '盘点持有信息',
                    type: 'item',
                    url: '/material/InventoryMaterialDataInfo',

                    breadcrumbs: false
                },
                {
                    id: 'OpeHoldPackingtypeInfoCode',
                    title: '更改员工持有包装物',
                    type: 'item',
                    url: '/material/OpeHoldPackingtypeInfoCode',

                    breadcrumbs: false
                },

                {
                    id: 'OpeHoldPackingtypeInfo',
                    title: '员工持有包装物',
                    type: 'item',
                    url: '/material/OpeHoldPackingtypeInfo',

                    breadcrumbs: false
                },
                {
                    id: 'MaterialPackingtypeArchivesList',
                    title: '钢瓶档案列表',
                    type: 'item',
                    url: '/material/MaterialPackingtypeArchivesList',

                    breadcrumbs: false
                },
                {
                    id: 'MaterialPackingtypeBasicArchives',
                    title: '包装物原始档案信息',
                    type: 'item',
                    url: '/material/MaterialPackingtypeBasicArchives',

                    breadcrumbs: false
                },
                {
                    id: 'CreateMaterialPackingtypeArchives',
                    title: '钢瓶新增',
                    type: 'item',
                    url: '/material/CreateMaterialPackingtypeArchives',

                    breadcrumbs: false
                },
                {
                    id: 'GetTransportBatchnumberInfo',
                    title: '获取部门车次信息',
                    type: 'item',
                    url: '/material/GetTransportBatchnumberInfo',
                },

                {
                    id: 'InventoryAlert',
                    title: '获取库存预警信息',
                    type: 'item',
                    url: '/material/InventoryAlert',
                },
                {
                    id: 'GetHandleProblemPackingtypeRecord',
                    title: '获取处理问题瓶记录',
                    type: 'item',
                    url: '/material/GetHandleProblemPackingtypeRecord',
                },

                {
                    id: 'WaterNoScanTransferMaterialRecord',
                    title: '水业务调运明细',
                    type: 'item',
                    url: '/material/WaterNoScanTransferMaterialRecord',
                },

                {
                    id: 'marteril',
                    title: '物资调运',
                    type: 'collapse',

                    children: [
                        {
                            id: 'ApplyMaterialTransferPlan',
                            title: '申请物资调运计划',
                            type: 'item',
                            url: '/material/ApplyMaterialTransferPlan'
                        },

                        {
                            id: 'MaterialTransferPlanRecord',
                            title: '获取物资计划调拨记录',
                            type: 'item',
                            url: '/material/MaterialTransferPlanRecord'
                        },

                        {
                            id: 'MChangeMaterialType',
                            title: '转换包装物物资类型',
                            type: 'item',
                            url: '/material/MChangeMaterialType'
                        },

                        {
                            id: 'NoScanTransferMaterial',
                            title: '非扫描方式调运物资',
                            type: 'item',
                            url: '/material/NoScanTransferMaterial'
                        },
                        {
                            id: 'TransferMaterialRecord',
                            title: '移交包装物',
                            type: 'item',
                            url: '/material/TransferMaterialRecord'
                        },
                        {
                            id: 'SignTransportRecord',
                            title: '签封调运记录',
                            type: 'item',
                            url: '/material/SignTransportRecord'
                        },
                        {
                            id: 'HandleMaterial',
                            title: '处理包装物物资',
                            type: 'item',
                            url: '/department/HandleMaterial',

                            breadcrumbs: false
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
                    id: 'NewGetSalesSecurityCheckRecord',
                    title: '获取销售安检信息',
                    type: 'item',
                    url: '/department/NewGetSalesSecurityCheckRecord',

                    breadcrumbs: false
                },
                {
                    id: 'GoodsSalesMashupList',
                    title: '套餐配置',
                    type: 'item',
                    url: '/sys/GoodsSalesMashupList',

                    breadcrumbs: false
                },
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
                    id: 'GetOtherAvailableSubsidyRecord',
                    title: '获取可申请补贴记录',
                    type: 'item',
                    url: '/other/GetOtherAvailableSubsidyRecord',
                    breadcrumbs: false
                },
                {
                    id: 'GetOtherSubsidyRecord',
                    title: '获取已申请补贴记录',
                    type: 'item',
                    url: '/other/GetOtherSubsidyRecord',
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
                    id: 'SpotCheckCommodityQuality',
                    title: '商品抽检录入',
                    type: 'item',
                    url: '/department/SpotCheckCommodityQuality',
                },
                {
                    id: 'GetSpotCheckCommodityQualityRecord',
                    title: '获取商品抽检信息',
                    type: 'item',
                    url: '/department/GetSpotCheckCommodityQualityRecord',
                },
                // {
                //     id: 'PackingtypePosition',
                //     title: '部门气瓶核查',
                //     type: 'item',
                //     url: '/department/PackingtypePosition',
                // },
                {
                    id: 'AdvancePaymentOrderList',
                    title: '预支付订单查询',
                    type: 'item',
                    url: '/department/AdvancePaymentOrderList',
                },
                {
                    id: 'OperatorList',
                    title: '员工管理',
                    type: 'item',
                    url: '/sys/OperatorList',
                },
                {
                    id: 'Direct',
                    title: '运输公司',
                    type: 'collapse',
                    children: [
                        {
                            id: 'UserNoDirectCostList',
                            title: '不计直调运费用户列表',
                            type: 'item',
                            url: '/department/UserNoDirectCostList',
                        },
                    ]
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
                            title: '获取销售安检统计',
                            type: 'item',
                            url: '/department/GetSalesSecurityCheckRecord',
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
                    id: 'UserTransferDisplayInfo',
                    title: '商用气客服移交',
                    type: 'item',
                    url: '/other/UserTransferDisplayInfo',
                    breadcrumbs: false
                },
                {
                    id: 'OtherServicesOrderProgressTracking',
                    title: '获取服务订单进度跟踪查询',
                    type: 'item',
                    url: '/other/OtherServicesOrderProgressTracking',
                    breadcrumbs: false
                },
                {
                    id: 'GetUserDiscountApplicationsList',
                    title: '价格授权列表',
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
                },
                {
                    id: 'GetUserInfoOfMateralCode',
                    title: '获取包装物号码持有人信息',
                    type: 'item',
                    url: '/other/GetUserInfoOfMateralCode',
                    breadcrumbs: false
                },
                {
                    id: 'GetOpeMinLoginRecord',
                    title: '员工登录记录',
                    type: 'item',
                    url: '/other/GetOpeMinLoginRecord',
                    breadcrumbs: false
                },

                {
                    id: 'GetDistributionSubsidyOfCompanyRecord',
                    title: '获取公司配送补贴记录(商用气)',
                    type: 'item',
                    url: '/other/GetDistributionSubsidyOfCompanyRecord',
                    breadcrumbs: false
                },
                {
                    id: 'GetUserApplyBindingSnsRecord',
                    title: 'SNS绑定列表',
                    type: 'item',
                    url: '/other/GetUserApplyBindingSnsRecord',
                    breadcrumbs: false
                },
                {
                    id: 'GetSnsAppointmentRepairRecord',
                    title: '获取SNS 预约维修 清洗业务记录',
                    type: 'item',
                    url: '/other/GetSnsAppointmentRepairRecord',
                    breadcrumbs: false
                },
                {
                    id: 'GetUserCollectPackingtypeOfSalesRecord',
                    title: '获取用户办理带入方式包装物销售记录',
                    type: 'item',
                    url: '/other/GetUserCollectPackingtypeOfSalesRecord',
                    breadcrumbs: false
                },
                {
                    id: 'GetUserSNSPayInfo',
                    title: '获取用户SNS支付信息',
                    type: 'item',
                    url: '/other/GetUserSNSPayInfo',
                    breadcrumbs: false
                },

            ]
        },

        {
            id: 'repairid',
            title: '维修配件',
            type: 'collapse',
            // icon: ReorderIcon,
            children: [
                {
                    id: 'GetInOrOutRecord',
                    title: '维修配件进出记录',
                    type: 'item',
                    url: '/repair/GetInOrOutRecord',
                    breadcrumbs: false
                },

                {
                    id: 'GetSalesSummaryOfGoodsname',
                    title: '获取维修配件商品名称销售汇总',
                    type: 'item',
                    url: '/repair/GetSalesSummaryOfGoodsname',
                    breadcrumbs: false
                },
                {
                    id: 'GetSalesSummaryOfUser',
                    title: '获取维修配件用户销售汇总',
                    type: 'item',
                    url: '/repair/GetSalesSummaryOfUser',
                    breadcrumbs: false
                },
                {
                    id: 'GetCostPrice',
                    title: '获取维修配件成本',
                    type: 'item',
                    url: '/repair/GetCostPrice',
                    breadcrumbs: false
                },
                {
                    id: 'GetSalesSummaryOfDepartment',
                    title: '获取维修配件部门销售汇总',
                    type: 'item',
                    url: '/repair/GetSalesSummaryOfDepartment',
                    breadcrumbs: false
                },
                {
                    id: 'GetOpeInventory',
                    title: '获取维修配件员工库存',
                    type: 'item',
                    url: '/repair/GetOpeInventory',
                    breadcrumbs: false
                },
                {
                    id: 'GetDepartmentInventory',
                    title: '获取维修配件部门库存',
                    type: 'item',
                    url: '/repair/GetDepartmentInventory',
                    breadcrumbs: false
                },
                {
                    id: 'GetOpeCommission',
                    title: '获取员工维修配件提成',
                    type: 'item',
                    url: '/repair/GetOpeCommission',
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
                    id: 'NewSalesReportss',
                    title: '获取销售报表',
                    type: 'item',
                    url: '/report/NewSalesReport',
                    breadcrumbs: false
                },
                {
                    id: 'SCBResidualAirRecord',
                    title: '市场部查询运输公司余气记录',
                    type: 'item',
                    url: '/report/SCBResidualAirRecord',
                    breadcrumbs: false
                }, {
                    id: 'SCBAccUserInfoRecord',
                    title: '市场部开户查询',
                    type: 'item',
                    url: '/report/SCBAccUserInfoRecord',
                    breadcrumbs: false
                },
                {
                    id: 'YYJDContributionRecordReport',
                    title: '运营监督获取缴款记录信息',
                    type: 'item',
                    url: '/report/YYJDContributionRecordReport',
                    breadcrumbs: false
                },
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
                            id: 'WiringOtherReport',
                            title: '接线综合报表',
                            type: 'item',
                            url: '/report/WiringOtherReport',
                            breadcrumbs: false
                        },
                        {
                            id: 'WriteOffCommodityVoucherRecord',
                            title: '获取核销商品抵扣凭证记录',
                            type: 'item',
                            url: '/report/WriteOffCommodityVoucherRecord',
                            breadcrumbs: false
                        },

                        {
                            id: 'LSQUserSalesInfo',
                            title: '零售商用换气台账',
                            type: 'item',
                            url: '/report/LSQUserSalesInfo',
                            breadcrumbs: false
                        },
                        {
                            id: 'WiringOthsrServicesReport',
                            title: '接线售后服务报表',
                            type: 'item',
                            url: '/report/WiringOthsrServicesReport',
                            breadcrumbs: false
                        },
                        {
                            id: 'HandleGoodsSalesMashupReport',
                            title: '水赠送统计',
                            type: 'item',
                            url: '/report/HandleGoodsSalesMashupReport'
                        },
                        {
                            id: 'PSBNewUserStatisticsOfSalesman',
                            title: '配送部 开户统计 业务员',
                            type: 'item',
                            url: '/report/PSBNewUserStatisticsOfSalesman',
                        },
                    ]
                },
                {
                    id: 'report2',
                    type: 'collapse',
                    title: '财务报表',
                    children: [
                        {
                            id: 'FinanceSalesExpress',
                            title: '财务销售快报',
                            type: 'item',
                            url: '/report/FinanceSalesExpress',
                            breadcrumbs: false
                        },             {
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
                            title: '获取销售报表(气)',
                            type: 'item',
                            url: '/report/SalesReport',
                            breadcrumbs: false
                        },
                        {
                            id: 'SalesReportWater',
                            title: '获取销售报表(水)',
                            type: 'item',
                            url: '/report/SalesReportWater',
                            breadcrumbs: false
                        },
                        {
                            id: 'SalesReportOfPrice',
                            title: '获取销售报表(单价分组)',
                            type: 'item',
                            url: '/report/SalesReportOfPrice',
                            breadcrumbs: false
                        },

                        {
                            id: 'TZBSalesStatistics',
                            title: '拓展部销售统计',
                            type: 'item',
                            url: '/report/TZBSalesStatistics',
                            breadcrumbs: false
                        },
                        {
                            id: 'OtherSubsidyReport',
                            title: '其它补贴报表',
                            type: 'item',
                            url: '/report/OtherSubsidyReport',
                            breadcrumbs: false
                        },
                        {
                            id: 'CollectionReportOfFinance',
                            title: '获取收款报表(财务)',
                            type: 'item',
                            url: '/report/CollectionReportOfFinance',
                            breadcrumbs: false
                        },
                         {
                            id: 'GasOrderRouteSummary',
                            title: '企划',
                            type: 'item',
                            url: '/report/GasOrderRouteSummary',
                            breadcrumbs: false
                        },
                        {
                            id: 'YYZXGasOrderRouteSummary',
                            title: '预约中心液化气订单途径汇总',
                            type: 'item',
                            url: '/report/YYZXGasOrderRouteSummary',
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
                            title: '欠瓶报表',
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

                        {
                            id: 'DeliveryUserCommodityReport',
                            title: '配送用户商品报表',
                            type: 'item',
                            url: '/report/DeliveryUserCommodityReport',
                            breadcrumbs: false
                        },
                        {
                            id: 'OutstandingOrdersReport',
                            title: '未完成订单报表',
                            type: 'item',
                            url: '/report/OutstandingOrdersReport',
                            breadcrumbs: false
                        },

                        {
                            id: 'ExchangeMaterialStatistics',
                            title: '获取部门交换物资统计(员工交接/员工交接(签封))',
                            type: 'item',
                            url: '/report/ExchangeMaterialStatistics',
                            breadcrumbs: false
                        },

                        {
                            id: 'DepartmentExchangeMaterialStatistics',
                            title: '获取指定部门交换物资统计(员工交接/员工交接(签封))',
                            type: 'item',
                            url: '/report/DepartmentExchangeMaterialStatistics',
                            breadcrumbs: false
                        },
                        {
                            id: 'BuyPackingtypeList',
                            title: '获取收购包装物列表',
                            type: 'item',
                            url: '/report/BuyPackingtypeList',
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
                            id: 'SYQGasOrderRouteSummary',
                            title: '商用气微信下单量查询',
                            type: 'item',
                            url: '/report/SYQGasOrderRouteSummary',
                            breadcrumbs: false
                        },
                        {
                            id: 'SYQSalesRecord',
                            title: '商用气销售记录',
                            type: 'item',
                            url: '/report/SYQSalesRecord',
                            breadcrumbs: false
                        },
                        {
                            id: 'SYQSalesKit',
                            title: '商用气销售简报',
                            type: 'item',
                            url: '/report/SYQSalesKit',
                            breadcrumbs: false
                        },
                        {
                            id: 'DeliverymanDeliveryDetailed',
                            title: '工商用气调进出钢瓶明细表',
                            type: 'item',
                            url: '/report/DeliverymanDeliveryDetailed',
                            breadcrumbs: false
                        },

                        // {
                        //     id: 'DeliverymanDeliveryDetailedSavepackingtype',
                        //     title: '工商用气调进出钢瓶明细表（存瓶）',
                        //     type: 'item',
                        //     url: '/report/DeliverymanDeliveryDetailedSavepackingtype',
                        //     breadcrumbs: false
                        // },
                        {
                            id: 'SYQNewUserSalesStatisticsTable',
                            title: '商用气新户销售报表',
                            type: 'item',
                            url: '/report/SYQNewUserSalesStatisticsTable',
                            breadcrumbs: false
                        },

                        {
                            id: 'SYQNewUserSalesStatisticsOldTable',
                            title: '商用气新户销售报表（旧）',
                            type: 'item',
                            url: '/report/SYQNewUserSalesStatisticsOldTable',
                            breadcrumbs: false
                        },
                        {
                            id: 'SYQKHCXTable',
                            title: '商用气客户查询表',
                            type: 'item',
                            url: '/report/SYQKHCXTable',
                            breadcrumbs: false
                        },

                        {
                            id: 'SYQKHYHCXTable',
                            title: '商用气客户优惠查询表',
                            type: 'item',
                            url: '/report/SYQKHYHCXTable',
                            breadcrumbs: false
                        },
                        {
                            id: 'SyqRetreatUserPackingtypeMaterialNotMoneyTable',
                            title: '商用气退包装物未退款表',
                            type: 'item',
                            url: '/report/SyqRetreatUserPackingtypeMaterialNotMoneyTable',
                            breadcrumbs: false
                        },

                        {
                            id: 'SYQRetreatUserPackingtypeMoneyTable',
                            title: '商用气用户办理包装物退款表',
                            type: 'item',
                            url: '/report/SYQRetreatUserPackingtypeMoneyTable',
                            breadcrumbs: false
                        },

                        {
                            id: 'SYQRetreatUserPackingtypeMaterialTable',
                            title: '商用气用户办理包装物退物资表',
                            type: 'item',
                            url: '/report/SYQRetreatUserPackingtypeMaterialTable',
                            breadcrumbs: false
                        },

                        {
                            id: 'SYQSalesStatisticsTable',
                            title: '商用气销量统计',
                            type: 'item',
                            url: '/report/SYQSalesStatisticsTable',
                            breadcrumbs: false
                        },

                        {
                            id: 'SYQSalesmanHoldUserTable',
                            title: '商用气业务员名下用户查询表',
                            type: 'item',
                            url: '/report/SYQSalesmanHoldUserTable',
                            breadcrumbs: false
                        },

                        {
                            id: 'SYQSalesmanHoldUserTransactionTable',
                            title: '商用气业务员管理用户交易户数表',
                            type: 'item',
                            url: '/report/SYQSalesmanHoldUserTransactionTable',
                            breadcrumbs: false
                        },
                        {
                            id: 'SYQSalesmanSalesCostTable',
                            title: '商用气业务员销售费用表',
                            type: 'item',
                            url: '/report/SYQSalesmanSalesCostTable',
                            breadcrumbs: false
                        },

                        {
                            id: 'SyqUserFollowUpTable',
                            title: '商用气用户回访统计表',
                            type: 'item',
                            url: '/report/SyqUserFollowUpTable',
                            breadcrumbs: false
                        },

                        {
                            id: 'SYQUserFollowUpTaskRecordTable',
                            title: '商用气用户回访任务记录表',
                            type: 'item',
                            url: '/report/SYQUserFollowUpTaskRecordTable',
                            breadcrumbs: false
                        },

                        {
                            id: 'SYQUserOtherServicesRecordTable',
                            title: '商用气用户其它服务记录表',
                            type: 'item',
                            url: '/report/SYQUserOtherServicesRecordTable',
                            breadcrumbs: false
                        },

                        {
                            id: 'SYQUserSalesGoodsDifferenceTable',
                            title: '商用气用户换气差异表',
                            type: 'item',
                            url: '/report/SYQUserSalesGoodsDifferenceTable',
                            breadcrumbs: false
                        },

                        {
                            id: 'SYQUserTransferTable',
                            title: '商用气用户移交记录',
                            type: 'item',
                            url: '/report/SYQUserTransferTable',
                            breadcrumbs: false
                        },

                        {
                            id: 'SalesArrearsSummary',
                            title: '销售欠款汇总',
                            type: 'item',
                            url: '/report/SalesArrearsSummary',
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
                            id: 'OverdueUnderPackingtypeRecord',
                            title: '超期欠包装物记录',
                            type: 'item',
                            url: '/report/OverdueUnderPackingtypeRecord',
                            breadcrumbs: false
                        },


                        {
                            id: 'BorrowPackingtypeOfUserReport',
                            title: '获取借用包装物报表(用户)',
                            type: 'item',
                            url: '/report/BorrowPackingtypeOfUserReport',
                            breadcrumbs: false
                        },


                        {
                            id: 'BorrowPackingtypeOfUserRecord',
                            title: '获取借用包装物记录(可还瓶)',
                            type: 'item',
                            url: '/report/BorrowPackingtypeOfUserRecord',
                            breadcrumbs: false
                        },

                        {
                            id: 'SYQUserResidualTransactionReport',
                            title: '商用气用户余气交易报表',
                            type: 'item',
                            url: '/report/SYQUserResidualTransactionReport',
                            breadcrumbs: false
                        },
                        {
                            id: 'SYQUserResidualWriteoffReport',
                            title: '商用气用户余气销账报表',
                            type: 'item',
                            url: '/report/SYQUserResidualWriteoffReport',
                            breadcrumbs: false
                        },

                        {
                            id: 'SYQNEWUSERCXTable',
                            title: '商用气新开客户查询表',
                            type: 'item',
                            url: '/report/SYQNEWUSERCXTable',
                            breadcrumbs: false
                        },



                    ]
                },
                {
                    id: 'report41',
                    type: 'collapse',
                    title: '工业气数据查询',
                    children: [
                        {
                            id: 'GYQSalesCommission',
                            title: '工业气销售提成',
                            type: 'item',
                            url: '/report/GYQSalesCommission',
                            breadcrumbs: false
                        },
                        {
                            id: 'SYQGYQUserAllocateAndTransferRecord',
                            title: '商用气工业气用户调拨记录',
                            type: 'item',
                            url: '/report/SYQGYQUserAllocateAndTransferRecord',
                            breadcrumbs: false
                        },
                        {
                            id: 'SYQGYQUserResidualAirRecord',
                            title: '商用气工业气用户余气记录',
                            type: 'item',
                            url: '/report/SYQGYQUserResidualAirRecord',
                            breadcrumbs: false
                        },
                    ]
                },
                {
                    id: 'report422',
                    type: 'collapse',
                    title: '零售后勤数据查询',
                    children: [

                        {
                            id: 'LSHQdeliverymanCommissionStatistics',
                            title: '零售后勤配送员提成统计',
                            type: 'item',
                            url: '/report/LSHQdeliverymanCommissionStatistics',
                            breadcrumbs: false
                        },
                        {
                            id: 'LSHQdepartmentWarehousingOfZp',
                            title: '零售后勤 门店入库重瓶小计',
                            type: 'item',
                            url: '/report/LSHQdepartmentWarehousingOfZp',
                            breadcrumbs: false
                        },

                        {
                            id: 'LSHQUserNewAccountStatistics',
                            title: '零售后勤 开户统计',
                            type: 'item',
                            url: '/report/LSHQUserNewAccountStatistics',
                            breadcrumbs: false
                        },

                        {
                            id: 'LSHQUserNewAccountSalesCommissionStatistics',
                            title: '零售后勤 开户换气统计',
                            type: 'item',
                            url: '/report/LSHQUserNewAccountSalesCommissionStatistics',
                            breadcrumbs: false
                        },

                        {
                            id: 'LSHQUserNewAccountSalesStatistics',
                            title: '零售后勤 个人开户及换气量统计',
                            type: 'item',
                            url: '/report/LSHQUserNewAccountSalesStatistics',
                            breadcrumbs: false
                        },

                        {
                            id: 'LSHQUserSalesDetailsStatistics',
                            title: '零售后勤 销售详情统计报表',
                            type: 'item',
                            url: '/report/LSHQUserSalesDetailsStatistics',
                            breadcrumbs: false
                        },
                        {
                            id: 'LSHQUserSalesStatistics',
                            title: '零售后勤 销售报表',
                            type: 'item',
                            url: '/report/LSHQUserSalesStatistics',
                            breadcrumbs: false
                        },
                    ]
                },
                {
                    id: 'report52',
                    type: 'collapse',
                    title: '水部',
                    children: [
                        {
                            id: 'PSBDeliverymanCommissionStatistics',
                            title: '配送部 配送员送水提成',
                            type: 'item',
                            url: '/report/PSBDeliverymanCommissionStatistics',
                        },
                        {
                            id: 'PSBWaterSummaryOfOutstandingDebts',
                            title: '配送部 水业务用户欠款汇总',
                            type: 'item',
                            url: '/report/PSBWaterSummaryOfOutstandingDebts',
                        },
                        {
                            id: 'PSBNewUserStatistics',
                            title: '配送部 开户统计',
                            type: 'item',
                            url: '/report/PSBNewUserStatistics',
                        },
                        {
                            id: 'PSBDepartmentSalesCommissionStatistics',
                            title: '配送部 部门销售配送提成',
                            type: 'item',
                            url: '/report/PSBDepartmentSalesCommissionStatistics',
                        },
                        {
                            id: 'PSByyzxCommissionStatistics',
                            title: '配送部 预约中心接线提成',
                            type: 'item',
                            url: '/report/PSByyzxCommissionStatistics',
                        },

                        {
                            id: 'PSBsjdxCommissionStatistics',
                            title: '配送部 司机送代销提成',
                            type: 'item',
                            url: '/report/PSBsjdxCommissionStatistics',
                        },

                        {
                            id: 'PSBSalesmanDYCommissionStatistics',
                            title: '配送部 业务员当月开户提成',
                            type: 'item',
                            url: '/report/PSBSalesmanDYCommissionStatistics',
                        },

                        {
                            id: 'PSBSalesmanWYCommissionStatistics',
                            title: '配送部 业务员往月开户提成',
                            type: 'item',
                            url: '/report/PSBSalesmanWYCommissionStatistics',
                        },

                        {
                            id: 'PSBSalesStatisticsOfBrand',
                            title: '配送部 销售统计按品牌',
                            type: 'item',
                            url: '/report/PSBSalesStatisticsOfBrand',
                        },
                        {
                            id: 'PSBSalesStatisticsOfUnit',
                            title: '配送部 销售统计按包装单位',
                            type: 'item',
                            url: '/report/PSBSalesStatisticsOfUnit',
                        },
                        {
                            id: 'PSBNewUserStatisticsOfSalesman',
                            title: '配送部 开户统计 业务员',
                            type: 'item',
                            url: '/report/PSBNewUserStatisticsOfSalesman',
                        },
                        {
                            id: 'HandleGoodsSalesMashupReport2',
                            title: '促销方案统计表',
                            type: 'item',
                            url: '/report/HandleGoodsSalesMashupReport2',
                        },
                        {
                            id: 'ActiveUserNumOfPSB',
                            title: '活跃用户数量',
                            type: 'item',
                            url: '/report/ActiveUserNumOfPSB',
                        },
                        {
                            id: 'PSBDepartmentUserSalesInfo',
                            title: '配送部 门店用户交易情况',
                            type: 'item',
                            url: '/report/PSBDepartmentUserSalesInfo',
                        },
                    ]
                },
                {
                    id: 'report533',
                    type: 'collapse',
                    title: '钢瓶管理部',
                    children: [
                        {
                            id: 'GPGLBBuyMaterialStatistics',
                            title: '钢瓶管理部 收购瓶数据统计',
                            type: 'item',
                            url: '/report/GPGLBBuyMaterialStatistics',
                        },
                        {
                            id: 'NewBuyMaterialRecord',
                            title: '钢瓶管理部 获取新购钢瓶生产信息',
                            type: 'item',
                            url: '/report/NewBuyMaterialRecord',
                        },
                    ]
                },
                {
                    id: 'report5',
                    type: 'collapse',
                    title: '运输公司',
                    children: [
                        {
                            id: 'DeliverymanDeliveryNoDirectCostDetailed',
                            title: '配送员司机配送明细（不计直送运费)',
                            type: 'item',
                            url: '/report/DeliverymanDeliveryNoDirectCostDetailed',
                            breadcrumbs: false
                        },

                        {
                            id: 'DeliverymanDeliveryDetailed',
                            title: '工商用气调进出钢瓶明细表',
                            type: 'item',
                            url: '/report/DeliverymanDeliveryDetailed',
                            breadcrumbs: false
                        },

                        {
                            id: 'DeliverymanDeliveryDetailedSavepackingtype',
                            title: '工商用气调进出钢瓶明细表（存瓶）',
                            type: 'item',
                            url: '/report/DeliverymanDeliveryDetailedSavepackingtype',
                            breadcrumbs: false
                        },
                        {
                            id: 'TransportationOfMaterialsReport',
                            title: '门店调出调入',
                            type: 'item',
                            url: '/report/TransportationOfMaterialsReport',
                            breadcrumbs: false
                        },
                        {
                            id: 'TZTransportationOfMaterialsReport',
                            title: '司机代销用户运费和装卸费报表',
                            type: 'item',
                            url: '/report/TZTransportationOfMaterialsReport',
                            breadcrumbs: false
                        },
                        {
                            id: 'DeliverymanDeliveryDirectCostReport',
                            title: '运输公司工商气运费报表',
                            type: 'item',
                            url: '/report/DeliverymanDeliveryDirectCostReport',
                            breadcrumbs: false
                        },
                        {
                            id: 'DeliverymanDeliveryResidualReport',
                            title: '工商用气调运销售余气(运输公司用 司机调运销售余气报表)',
                            type: 'item',
                            url: '/report/DeliverymanDeliveryResidualReport',
                            breadcrumbs: false
                        },
                        {
                            id: 'DeliverymanTransportationOfMaterialsReport',
                            title: '零售调拨运费装卸费统计',
                            type: 'item',
                            url: '/report/DeliverymanTransportationOfMaterialsReport',
                            breadcrumbs: false
                        },
                        {
                            id: 'TZUserSalesDetailed',
                            title: '拓展销售明细',
                            type: 'item',
                            url: '/report/TZUserSalesDetailed',
                            breadcrumbs: false
                        },
                        {
                            id: 'GetTransportationExpensesParameter',
                            title: '设置运费参数',
                            type: 'item',
                            url: '/sys/GetTransportationExpensesParameter',
                            breadcrumbs: false,
                        },

                    ]
                },
                {
                    id: 'report_kfzx',
                    type: 'collapse',
                    title: '客服中心',
                    children: [
                        {
                            id: 'KfzxServiceopeInstallationBudgetCommissionReport',
                            title: '安装预算提成报表',
                            type: 'item',
                            url: '/report/KfzxServiceopeInstallationBudgetCommissionReport',
                            breadcrumbs: false
                        },
                        {
                            id: 'KfzxServiceopeMaintenanceCommissionReport',
                            title: '维修人员提成',
                            type: 'item',
                            url: '/report/KfzxServiceopeMaintenanceCommissionReport',
                            breadcrumbs: false
                        },
                        {
                            id: 'KfzxIncompleteWorkDetail',
                            title: '非正常安检订单',
                            type: 'item',
                            url: '/report/KfzxIncompleteWorkDetail',
                            breadcrumbs: false
                        },
                        {
                            id: 'KfzxServicetypeInfoDetail',
                            title: '客服中心服务类型情况表(明细)',
                            type: 'item',
                            url: '/report/KfzxServicetypeInfoDetail',
                            breadcrumbs: false
                        },
                        // {
                        //     id: 'KfzxServiceopeCommissionReport',
                        //     title: '客服中心服务人员提成报表',
                        //     type: 'item',
                        //     url: '/report/KfzxServiceopeCommissionReport',
                        //     breadcrumbs: false
                        // },
                        {
                            id: 'KfzxServicetypeReport',
                            title: '客服中心服务类型情况表',
                            type: 'item',
                            url: '/report/KfzxServicetypeReport',
                            breadcrumbs: false
                        },
                        {
                            id: 'KfzxServiceOrderDetails',
                            title: '客服中心服务订单明细',
                            type: 'item',
                            url: '/report/KfzxServiceOrderDetails',
                            breadcrumbs: false
                        },
                        {
                            id: 'KfzxServiceOrderCompletionStatistics',
                            title: '客服中心服务订单完成统计',
                            type: 'item',
                            url: '/report/KfzxServiceOrderCompletionStatistics',
                            breadcrumbs: false
                        },

                    ]
                }
            ]
        },

    ]
};


export default users;
