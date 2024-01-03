import SettingsSuggestRoundedIcon from '@mui/icons-material/SettingsSuggestRounded';
import ApartmentIcon from '@mui/icons-material/Apartment';
// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const sys = {
    id: 'sys',
    title: '系统设置',
    caption: '信息中心操作',
    type: 'group',
    children: [

        {
            id: 'syslist',
            title: '参数列表',
            type: 'collapse',
            icon: SettingsSuggestRoundedIcon,
            children: [
                {
                    id: 'ServiceAreaList',
                    title: '服务区域参数',
                    type: 'item',
                    url: '/sys/ServiceAreaList',
                    breadcrumbs: false,
                },
                {
                    id: 'AutoAllocationList',
                    title: '自动分配参数信息',
                    type: 'item',
                    url: '/sys/AutoAllocationList',
                    breadcrumbs: false,
                },
                {
                    id: 'department',
                    title: '部门管理',
                    type: 'item',
                    url: '/sys/department',
                    breadcrumbs: false,
                },
                {
                    id: 'CustomertypeList',
                    title: '用户类型',
                    type: 'item',
                    url: '/sys/CustomertypeList',
                    breadcrumbs: false,
                },
                {
                    id: 'OperatorList',
                    title: '员工列表',
                    type: 'item',
                    url: '/sys/OperatorList',
                    breadcrumbs: false,
                },
                {
                    id: 'HousingpropertyList',
                    title: '用户住所类型',
                    type: 'item',
                    url: '/sys/HousingpropertyList',
                    breadcrumbs: false,
                },
                {
                    id: 'GoodsBrandList',
                    title: '商品品牌',
                    type: 'item',
                    url: '/sys/GoodsBrandList',
                    breadcrumbs: false,
                },
                {
                    id: 'GoodsCatList',
                    title: '商品分类',
                    type: 'item',
                    url: '/sys/GoodsCatList',
                    breadcrumbs: false,
                },
                {
                    id: 'GoodsTypeList',
                    title: '商品类型',
                    type: 'item',
                    url: '/sys/GoodsTypeList',
                    breadcrumbs: false,
                },
                {
                    id: 'goods',
                    title: '商品列表',
                    type: 'item',
                    url: '/sys/goods',
                    breadcrumbs: false,
                },
                {
                    id: 'BuyPackingtypeParameterList',
                    title: '收购包装物价格',
                    type: 'item',
                    url: '/sys/BuyPackingtypeParameterList',
                    breadcrumbs: false,
                },
                {
                    id: 'SettingQuarters',
                    title: '系统岗位',
                    type: 'item',
                    url: '/sys/SettingQuarters',
                    breadcrumbs: false,
                },
                {
                    id: 'PermissionProgrammeList',
                    title: '权限方案',
                    type: 'item',
                    url: '/sys/PermissionProgrammeList',
                    breadcrumbs: false,
                },
                {
                    id: 'PackingtypeList',
                    title: '包装物类型',
                    type: 'item',
                    url: '/sys/PackingtypeList',
                    breadcrumbs: false,
                },
                {
                    id: 'SettingPackingtypeBillingMode',
                    title: '包装物计费参数',
                    type: 'item',
                    url: '/sys/SettingPackingtypeBillingMode',
                    breadcrumbs: false,
                },
                {
                    id: 'PackingtypeMode',
                    title: '包装物方式',
                    type: 'item',
                    url: '/sys/PackingtypeMode',
                    breadcrumbs: false,
                },
                {
                    id: 'department',
                    title: '线上活动信息',
                    type: 'item',
                    url: '/sys/department',
                    breadcrumbs: false,
                },
                {
                    id: 'GiveProgrammeList',
                    title: '业务办理赠送信息',
                    type: 'item',
                    url: '/sys/GiveProgrammeList',
                    breadcrumbs: false,
                },
                {
                    id: 'GoodsSalesMashupList',
                    title: '商品捆绑销售方案',
                    type: 'item',
                    url: '/sys/GoodsSalesMashupList',
                    breadcrumbs: false,
                },

                {
                    id: 'SecurityInspectionItemsList',
                    title: '安检项目',
                    type: 'item',
                    url: '/sys/SecurityInspectionItemsList',
                    breadcrumbs: false,
                },
                {
                    id: 'SettingServiceType',
                    title: '设置服务类型接口',
                    type: 'item',
                    url: '/sys/SettingServiceType',
                    breadcrumbs: false,
                },
                {
                    id: 'SettingPreferentialRecharge',
                    title: '设置专项款参数接口',
                    type: 'item',
                    url: '/sys/SettingPreferentialRecharge',
                    breadcrumbs: false,
                },
                {
                    id: 'CollectionReportProjectConfigList',
                    title: '收款报表项目参数配置',
                    type: 'item',
                    url: '/sys/CollectionReportProjectConfigList',
                    breadcrumbs: false,
                },
                {
                    id: 'SalesReportGoodsConfigList',
                    title: '设置销售报表（商品）配置',
                    type: 'item',
                    url: '/sys/SalesReportGoodsConfigList',
                    breadcrumbs: false,
                },
                {
                    id: 'SettingUserOverlayOfferInSpecifiedRangeForCustomertype',
                    title: '设置指定范围用户叠加优惠条件',
                    type: 'item',
                    url: '/sys/SettingUserOverlayOfferInSpecifiedRangeForCustomertype',
                    breadcrumbs: false,
                },
                {
                    id: 'SettingDepartmenGoodsSalesPromotion',
                    title: '设置部门商品促销方案接口',
                    type: 'item',
                    url: '/sys/SettingDepartmenGoodsSalesPromotion',
                    breadcrumbs: false,
                },
                {
                    id: 'SettingMenu',
                    title: '设置菜单列表',
                    type: 'item',
                    url: '/sys/SettingMenu',
                    breadcrumbs: false,
                },
                {
                    id: 'GetTransportationExpensesParameter',
                    title: '设置运费参数',
                    type: 'item',
                    url: '/sys/GetTransportationExpensesParameter',
                    breadcrumbs: false,
                },
                {
                    id: 'RepairPartsList',
                    title: '设置配件参数',
                    type: 'item',
                    url: '/sys/RepairPartsList',
                    breadcrumbs: false,
                },
                {
                    id: 'DispatchDepartmentList',
                    title: '调运部门信息',
                    type: 'item',
                    url: '/sys/DispatchDepartmentList',
                    breadcrumbs: false,
                },
                {
                    id: 'UserAgreementModificationPriceConfigList',
                    title: '特别调整用户价格参数列表',
                    type: 'item',
                    url: '/sys/UserAgreementModificationPriceConfigList',
                    breadcrumbs: false,
                },
                {
                    id: 'GetUserAgreementModificationPriceSalesRecord',
                    title: '获取设置特别调整价格用户销售记录(仅限现金支付/现结欠款)',
                    type: 'item',
                    url: '/sys/GetUserAgreementModificationPriceSalesRecord',
                    breadcrumbs: false,
                },
                {
                    id: 'FeiEPrintConfigList',
                    title: '飞鹅打印机配置列表',
                    type: 'item',
                    url: '/sys/FeiEPrintConfigList',
                    breadcrumbs: false,
                },
                {
                    id: 'GetFinanceCollectionProjectConfig',
                    title: '获取财务收款项目配置',
                    type: 'item',
                    url: '/sys/GetFinanceCollectionProjectConfig',
                    breadcrumbs: false,
                },
                {
                    id: 'RepairPartsTypeList',
                    title: '设置维修配件类型',
                    type: 'item',
                    url: '/sys/RepairPartsTypeList',
                    breadcrumbs: false,
                },
                {
                    id: 'SettingIntegralMultipleConfig',
                    title: '设置销售商品积分翻倍基数',
                    type: 'item',
                    url: '/sys/SettingIntegralMultipleConfig',
                    breadcrumbs: false,
                },
            ]
        },
        {
            id: 'InitCompanyInfo',
            title: '初始化公司信息',
            type: 'item',
            icon: ApartmentIcon,
            url: '/sys/InitCompanyInfo'
        },
        {
            id: 'GetSnsPayRecord',
            title: '获取SNS支付信息',
            type: 'item',
            url: '/sys/GetSnsPayRecord'
        },
        {
            id: 'GetSnsPayRefundRecord',
            title: '获取SNS线上退款信息',
            type: 'item',
            url: '/sys/GetSnsPayRefundRecord'
        },
        {
            id: 'UpdateCompanyInfo',
            title: '更新当前公司信息',
            type: 'item',
            url: '/sys/UpdateCompanyInfo'
        },
        {
            id: 'GetSalesKit',
            title: '获取销售简报',
            type: 'item',
            url: '/sys/GetSalesKit'
        },
        {
            id: 'HandleSpecialUserPackingtypeWarehouse',
            title: '押金录入',
            type: 'item',
            url: '/sys/HandleSpecialUserPackingtypeWarehouse'
        },
        {
            id: 'GetCTIUserOrder',
            title: 'CTI订单',
            type: 'item',
            url: '/sys/GetCTIUserOrder'
        },
        {
            id: 'VerifyPriceAdjustment',
            title: '用户批量调价',
            type: 'item',
            url: '/sys/VerifyPriceAdjustment'
        },
    ]
};

export default sys;
