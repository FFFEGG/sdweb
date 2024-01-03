import {lazy} from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';


const GetPrintInfo = Loadable(lazy(() => import("views/other/GetPrintInfo")));
const GetPackingInspectRecord = Loadable(lazy(() => import("views/department/GetPackingInspectRecord")));
const ServiceAreaList = Loadable(lazy(() => import("views/sys/ServiceAreaList")));
const AutoAllocationList = Loadable(lazy(() => import("views/sys/AutoAllocationList")));
const Department = Loadable(lazy(() => import("views/sys/department")));
const UserBasicInfo = Loadable(lazy(() => import("views/pages/users/UserBasicInfo")));
const EditUserExclusiveSalesman = Loadable(lazy(() => import("views/pages/users/EditUserExclusiveSalesman")));
const OrderList = Loadable(lazy(() => import("views/pages/order/OrderList")));
const OrderListYSGS = Loadable(lazy(() => import("views/pages/order/OrderListYSGS")));
const GetCtiErrorRecord = Loadable(lazy(() => import("views/pages/order/GetCtiErrorRecord")));
const Chat = Loadable(lazy(() => import("views/chat")));

const Business = Loadable(lazy(() => import("views/pages/users/Business")));
const UserBottleEntry = Loadable(lazy(() => import("views/pages/users/UserBottleEntry")));
const Gasbuy = Loadable(lazy(() => import("views/pages/users/Gasbuy")));
const ApplyUserGoodsSalespromotion = Loadable(lazy(() => import("views/pages/users/ApplyUserGoodsSalespromotion")));
const ApplyUserPackingtypeChargeSalespromotion = Loadable(lazy(() => import("views/pages/users/ApplyUserPackingtypeChargeSalespromotion")));
const ApplyUserPackingtypeSalespromotion = Loadable(lazy(() => import("views/pages/users/ApplyUserPackingtypeSalespromotion")));
const BuyUserPackingtypeMaterial = Loadable(lazy(() => import("views/pages/users/BuyUserPackingtypeMaterial")));
const BuyUserTongPackingtypeMaterial = Loadable(lazy(() => import("views/pages/users/BuyUserTongPackingtypeMaterial")));
const CollectUserPackingtypeCharge = Loadable(lazy(() => import("views/pages/users/buiness/CollectUserPackingtypeCharge")));
const ConfirmSaleOrderRecord = Loadable(lazy(() => import("views/pages/department/ConfirmSaleOrderRecord")));
const CreateMaterialPackingtypeArchives = Loadable(lazy(() => import("views/pages/material/CreateMaterialPackingtypeArchives")));
const MaterialPackingtypeArchivesList = Loadable(lazy(() => import("views/pages/material/MaterialPackingtypeArchivesList")));
const MaterialPackingtypeBasicArchives = Loadable(lazy(() => import("views/pages/material/MaterialPackingtypeBasicArchives")));
const StaffTransferMaterial = Loadable(lazy(() => import("views/pages/material/StaffTransferMaterial")));
const AddUserBasicInfo = Loadable(lazy(() => import("views/pages/users/AddUserBasicInfo")));
const CollectUserPackingtypeMaterialNoTraceTheSource = Loadable(lazy(() => import("views/pages/users/CollectUserPackingtypeMaterialNoTraceTheSource")));
const OpeHoldPackingtypeInfo = Loadable(lazy(() => import("views/pages/material/OpeHoldPackingtypeInfo")));

const SettingServiceType = Loadable(lazy(() => import("views/sys/SettingServiceType")));
const OtherServicesOrderList = Loadable(lazy(() => import("views/pages/order/OtherServicesOrderList")));
const PackingtypeMode = Loadable(lazy(() => import("views/sys/PackingtypeMode")));
const Goods = Loadable(lazy(() => import("views/sys/Goods")));
const ChangePassword = Loadable(lazy(() => import("views/sys/ChangePassword")));
const GoodsBrandList = Loadable(lazy(() => import("views/sys/GoodsBrandList")));
const CustomertypeList = Loadable(lazy(() => import("views/sys/CustomertypeList")));
const BuyPackingtypeParameterList = Loadable(lazy(() => import("views/sys/BuyPackingtypeParameterList")));
const SettingDepartmenGoodsSalesPromotion = Loadable(lazy(() => import("views/sys/SettingDepartmenGoodsSalesPromotion")));
const GoodsTypeList = Loadable(lazy(() => import("views/sys/GoodsTypeList")));
const GoodsCatList = Loadable(lazy(() => import("views/sys/GoodsCatList")));
const HousingpropertyList = Loadable(lazy(() => import("views/sys/HousingpropertyList")));
const CommodityExchange = Loadable(lazy(() => import("views/pages/users/CommodityExchange")));
const AddContributionRecord = Loadable(lazy(() => import("views/department/AddContributionRecord")));
const RetreatUserPackingtypeMaterial = Loadable(lazy(() => import("views/pages/users/RetreatUserPackingtypeMaterial")));
const RetreatUserPackingtypeMoney = Loadable(lazy(() => import("views/pages/users/RetreatUserPackingtypeMoney")));
const RetreatUserGoodsWarehouse = Loadable(lazy(() => import("views/pages/users/RetreatUserGoodsWarehouse")));
const GoodsSalesMashupList = Loadable(lazy(() => import("views/sys/GoodsSalesMashupList")));
const ApplyAdjustUserQuota = Loadable(lazy(() => import('views/pages/users/ApplyAdjustUserQuota')));
const UserRecharge = Loadable(lazy(() => import("views/pages/users/UserRecharge")));
const UserRefund = Loadable(lazy(() => import("views/pages/users/UserRefund")));
const SettingPreferentialRecharge = Loadable(lazy(() => import("views/sys/SettingPreferentialRecharge")));
const UserPreferentialRecharge = Loadable(lazy(() => import("views/pages/users/UserPreferentialRecharge")));
const UpdateUserBasicInfo = Loadable(lazy(() => import("views/pages/users/UpdateUserBasicInfo")));
const PermissionProgrammeList = Loadable(lazy(() => import("views/sys/PermissionProgrammeList")));
const Invoice = Loadable(lazy(() => import("views/pages/users/Invoice")));
const ApplyMaterialTransferPlan = Loadable(lazy(() => import("views/material/ApplyMaterialTransferPlan")));
const MaterialTransferPlanRecord = Loadable(lazy(() => import("views/material/MaterialTransferPlanRecord")));
const MChangeMaterialType = Loadable(lazy(() => import("views/material/MChangeMaterialType")));
const InventoryAlert = Loadable(lazy(() => import("views/material/InventoryAlert")));
const NoScanTransferMaterial = Loadable(lazy(() => import("views/material/NoScanTransferMaterial")));
const OpeAbnormalExchangeRecord = Loadable(lazy(() => import("views/material/OpeAbnormalExchangeRecord")));
const TransferMaterialRecord = Loadable(lazy(() => import("views/material/TransferMaterialRecord")));
const GetTransportBatchnumberInfo = Loadable(lazy(() => import("views/material/GetTransportBatchnumberInfo")));
const SignTransportRecord = Loadable(lazy(() => import("views/pages/material/SignTransportRecord")));
const CreateUserPackingtypeArchives = Loadable(lazy(() => import("views/pages/users/CreateUserPackingtypeArchives")));
const NoTraceTheSourceMaterialStockBookkeeping = Loadable(lazy(() => import("views/material/NoTraceTheSourceMaterialStockBookkeeping")));
const GetHandleProblemPackingtypeRecord = Loadable(lazy(() => import("views/material/GetHandleProblemPackingtypeRecord")));
const PackingtypeList = Loadable(lazy(() => import("views/sys/PackingtypeList")));
const AddDistributionSubsidyOfCompanyRecord = Loadable(lazy(() => import("views/department/AddDistributionSubsidyOfCompanyRecord")));
const WaterNoScanTransferMaterialRecord = Loadable(lazy(() => import("views/material/WaterNoScanTransferMaterialRecord/index")));
const HandleGoodsSalesMashupReport = Loadable(lazy(() => import("views/report/HandleGoodsSalesMashupReport")));


const SendGiveProgrammeToSalesman = Loadable(lazy(() => import("views/other/SendGiveProgrammeToSalesman")));
const GiveProgrammeList = Loadable(lazy(() => import("views/sys/GiveProgrammeList")));
const GetOpeDailyWorkLoad = Loadable(lazy(() => import("views/other/GetOpeDailyWorkLoad")));
const DeliverymanWorkFloorStatistics = Loadable(lazy(() => import("views/report/DeliverymanWorkFloorStatistics")));
const DeliverymanWorkFloorStatisticsDetailed = Loadable(lazy(() => import("views/report/DeliverymanWorkFloorStatisticsDetailed")));
const NewUserTransactionsStatistics = Loadable(lazy(() => import("views/report/NewUserTransactionsStatistics")));
const NewUserTransactionsStatisticsDetailed = Loadable(lazy(() => import("views/report/NewUserTransactionsStatisticsDetailed")));
const OtherServicesReport = Loadable(lazy(() => import("views/report/OtherServicesReport")));
const OtherServicesReportDetailed = Loadable(lazy(() => import("views/report/OtherServicesReportDetailed")));
const OverdueSalesArrearsRecord = Loadable(lazy(() => import("views/report/OverdueSalesArrearsRecord")));
const ResidualAirRecord = Loadable(lazy(() => import("views/report/ResidualAirRecord")));
const InvoiceRecordList = Loadable(lazy(() => import("views/other/InvoiceRecordList")));
const SalesArrearsRecord = Loadable(lazy(() => import("views/report/SalesArrearsRecord")));
const SustainSalesStatistics = Loadable(lazy(() => import("views/report/SustainSalesStatistics")));
const SustainSalesStatisticsDetailed = Loadable(lazy(() => import("views/report/SustainSalesStatisticsDetailed")));
const UnconfirmedCollectionRecord = Loadable(lazy(() => import("views/report/UnconfirmedCollectionRecord")));
const UserCallRegistrationReport = Loadable(lazy(() => import("views/report/UserCallRegistrationReport")));
const UserLastTransactionsRecord = Loadable(lazy(() => import("views/report/UserLastTransactionsRecord")));
const UserSalesStatistics = Loadable(lazy(() => import("views/report/UserSalesStatistics")));
const UserTransactionsRecordOfFrequency = Loadable(lazy(() => import("views/report/UserTransactionsRecordOfFrequency")));
const SYQSalesmanHoldUserTable = Loadable(lazy(() => import("views/report/SYQSalesmanHoldUserTable")));
const InitCompanyInfo = Loadable(lazy(() => import("views/sys/InitCompanyInfo")));
const MergeUserPackingtypeWarehouse = Loadable(lazy(() => import("views/department/MergeUserPackingtypeWarehouse")));
const CreateUserGoodsSalesMashup = Loadable(lazy(() => import("views/pages/users/CreateUserGoodsSalesMashup/index")));
const Ownerorder = Loadable(lazy(() => import("views/pages/users/ownerorder")));


// dashboard routing
const WiringSalesReport = Loadable(lazy(() => import('views/report/WiringSalesReport')));
const OutstandingOrdersReport = Loadable(lazy(() => import('views/report/OutstandingOrdersReport')));
const TraceTheSourceMaterialStockBookkeepingInfo = Loadable(lazy(() => import('views/report/TraceTheSourceMaterialStockBookkeepingInfo')));
const WriteOffCommodityVoucherRecord = Loadable(lazy(() => import('views/report/WriteOffCommodityVoucherRecord')));
const ArrearsCollectionReport = Loadable(lazy(() => import('views/report/ArrearsCollectionReport')));
const CollectionReport = Loadable(lazy(() => import('views/report/CollectionReport')));
const DeliveryUserCommodityReport = Loadable(lazy(() => import('views/report/DeliveryUserCommodityReport')));
const CollectionReportProjectConfigList = Loadable(lazy(() => import('views/sys/CollectionReportProjectConfigList')));
const DistributionSubsidyOfCompanyReport = Loadable(lazy(() => import('views/report/DistributionSubsidyOfCompanyReport')));
const SalesReport = Loadable(lazy(() => import('views/report/SalesReport')));
const SalesReportWater = Loadable(lazy(() => import('views/report/SalesReportWater')));
const SYQUserResidualTransactionReport = Loadable(lazy(() => import('views/report/SYQUserResidualTransactionReport')));
const SYQUserResidualWriteoffReport = Loadable(lazy(() => import('views/report/SYQUserResidualWriteoffReport')));


const SalesReportGoodsConfigList = Loadable(lazy(() => import('views/sys/SalesReportGoodsConfigList')));
const BorrowPackingtypeReport = Loadable(lazy(() => import('views/report/BorrowPackingtypeReport')));
const SYQKHCXTable = Loadable(lazy(() => import('views/report/SYQKHCXTable')));
const SYQUserSalesGoodsDifferenceTable = Loadable(lazy(() => import('views/report/SYQUserSalesGoodsDifferenceTable')));
const SYQUserFollowUpTable = Loadable(lazy(() => import('views/report/SYQUserFollowUpTable')));
const SYQUserFollowUpTaskRecordTable = Loadable(lazy(() => import('views/report/SYQUserFollowUpTaskRecordTable')));
const SYQKHYHCXTable = Loadable(lazy(() => import('views/report/SYQKHYHCXTable')));
const SyqRetreatUserPackingtypeMaterialNotMoneyTable = Loadable(lazy(() => import('views/report/SyqRetreatUserPackingtypeMaterialNotMoneyTable')));
const NoTraceTheSourceMaterialStockReport = Loadable(lazy(() => import('views/report/NoTraceTheSourceMaterialStockReport')));
const SYQRetreatUserPackingtypeMoneyTable = Loadable(lazy(() => import('views/report/SYQRetreatUserPackingtypeMoneyTable')));
const PackingtypeUseBillReport = Loadable(lazy(() => import('views/report/PackingtypeUseBillReport')));
const SignTransportRecordReport = Loadable(lazy(() => import('views/report/SignTransportRecordReport')));
const SYQSalesmanSalesCostTable = Loadable(lazy(() => import('views/report/SYQSalesmanSalesCostTable')));
const TraceTheSourceMaterialStockReport = Loadable(lazy(() => import('views/report/TraceTheSourceMaterialStockReport')));
const SYQUserOtherServicesRecordTable = Loadable(lazy(() => import('views/report/SYQUserOtherServicesRecordTable')));
const SYQSalesmanHoldUserTransactionTable = Loadable(lazy(() => import('views/report/SYQSalesmanHoldUserTransactionTable')));
const GetCanRevokeBusiness = Loadable(lazy(() => import('views/department/GetCanRevokeBusiness')));
const VagueQueryUserInfo = Loadable(lazy(() => import('views/pages/users/VagueQueryUserInfo')));
const AdvancePaymentOrderList = Loadable(lazy(() => import('views/pages/users/AdvancePaymentOrderList')));
const DashboardDefault = Loadable(lazy(() => import('views/dashboard/Default')));
const DepartmentUserOrderInfo = Loadable(lazy(() => import('views/department/DepartmentUserOrderInfo')));
const GetSafetyProductionRecord = Loadable(lazy(() => import('views/department/GetSafetyProductionRecord')));
const GetSalesSecurityCheckRecord = Loadable(lazy(() => import('views/department/GetSalesSecurityCheckRecord')));
const SalesReportOfPrice = Loadable(lazy(() => import('views/report/SalesReportOfPrice')));
const SYQUserTransferTable = Loadable(lazy(() => import('views/report/SYQUserTransferTable')));
const OtherSubsidyReport = Loadable(lazy(() => import('views/report/OtherSubsidyReport')));
const SYQSalesStatisticsTable = Loadable(lazy(() => import('views/report/SYQSalesStatisticsTable')));
const GetResidualGasToBeConfirmedRecord = Loadable(lazy(() => import('views/department/GetResidualGasToBeConfirmedRecord')));
const SplitUserPackingtypeWarehouse = Loadable(lazy(() => import('views/department/SplitUserPackingtypeWarehouse')));
const GetSnsPayRecord = Loadable(lazy(() => import('views/sys/GetSnsPayRecord')));
const GetSnsPayRefundRecord = Loadable(lazy(() => import('views/sys/GetSnsPayRefundRecord')));
const GetFinanceCollectionProjectConfig = Loadable(lazy(() => import('views/sys/GetFinanceCollectionProjectConfig')));
const FinanceSalesExpress = Loadable(lazy(() => import('views/report/FinanceSalesExpress')));

// utilities routing
const UtilsTypography = Loadable(lazy(() => import('views/utilities/Typography')));
const UtilsColor = Loadable(lazy(() => import('views/utilities/Color')));
const UtilsShadow = Loadable(lazy(() => import('views/utilities/Shadow')));
const UtilsMaterialIcons = Loadable(lazy(() => import('views/utilities/MaterialIcons')));
const UtilsTablerIcons = Loadable(lazy(() => import('views/utilities/TablerIcons')));
const SettingQuarters = Loadable(lazy(() => import('views/sys/SettingQuarters')));
const GetSpotCheckCommodityQualityRecord = Loadable(lazy(() => import('views/department/GetSpotCheckCommodityQualityRecord')));
const GetWarningRecord = Loadable(lazy(() => import('views/department/GetWarningRecord')));
const SpotCheckCommodityQuality = Loadable(lazy(() => import('views/department/SpotCheckCommodityQuality')));
const HandleMaterial = Loadable(lazy(() => import('views/department/HandleMaterial')));
const UserCallRegistrationList = Loadable(lazy(() => import('views/pages/users/UserCallRegistrationList')));
const MaterialCirculationRecord = Loadable(lazy(() => import('views/department/MaterialCirculationRecord')));
const UserListOfSalesman = Loadable(lazy(() => import('views/other/UserListOfSalesman')));
const UserListOfDepartment = Loadable(lazy(() => import('views/other/UserListOfDepartment')));
const OperatorList = Loadable(lazy(() => import('views/sys/OperatorList')));
const SettingPackingtypeBillingMode = Loadable(lazy(() => import('views/sys/SettingPackingtypeBillingMode')));
const SecurityInspectionItemsList = Loadable(lazy(() => import('views/sys/SecurityInspectionItemsList')));
const SettingUserOverlayOfferInSpecifiedRangeForCustomertype = Loadable(lazy(() => import('views/sys/SettingUserOverlayOfferInSpecifiedRangeForCustomertype')));
const SettingMenu = Loadable(lazy(() => import('views/sys/SettingMenu')));
const GetUserDiscountApplicationsList = Loadable(lazy(() => import('views/other/GetUserDiscountApplicationsList')));
const GetUserInfoOfMateralCode = Loadable(lazy(() => import('views/other/GetUserInfoOfMateralCode')));
const GetOpeMinLoginRecord = Loadable(lazy(() => import('views/other/GetOpeMinLoginRecord')));
const GetOtherAvailableSubsidyRecord = Loadable(lazy(() => import('views/other/GetOtherAvailableSubsidyRecord')));
const GetOtherSubsidyRecord = Loadable(lazy(() => import('views/other/GetOtherSubsidyRecord')));
const GetDistributionSubsidyOfCompanyRecord = Loadable(lazy(() => import('views/other/GetDistributionSubsidyOfCompanyRecord')));
const ExchangeMaterialStatistics = Loadable(lazy(() => import('views/report/ExchangeMaterialStatistics')));
const LSQUserSalesInfo = Loadable(lazy(() => import('views/report/LSQUserSalesInfo')));
const BuyPackingtypeList = Loadable(lazy(() => import('views/report/BuyPackingtypeList')));
const SYQSalesKit = Loadable(lazy(() => import('views/report/SYQSalesKit')));
const DepartmentExchangeMaterialStatistics = Loadable(lazy(() => import('views/report/DepartmentExchangeMaterialStatistics')));
const GetSalesKit = Loadable(lazy(() => import('views/sys/GetSalesKit')));
const UserNoDirectCostList = Loadable(lazy(() => import('views/department/UserNoDirectCostList')));
const DeliverymanDeliveryNoDirectCostDetailed = Loadable(lazy(() => import('views/report/DeliverymanDeliveryNoDirectCostDetailed')));
const DeliverymanDeliveryDetailed = Loadable(lazy(() => import('views/report/DeliverymanDeliveryDetailed')));
const DeliverymanDeliveryResidualReport = Loadable(lazy(() => import('views/report/DeliverymanDeliveryResidualReport')));
const DeliverymanDeliveryDetailedSavepackingtype = Loadable(lazy(() => import('views/report/DeliverymanDeliveryDetailedSavepackingtype')));
const SYQNewUserSalesStatisticsTable = Loadable(lazy(() => import('views/report/SYQNewUserSalesStatisticsTable')));
const SYQGYQUserResidualAirRecord = Loadable(lazy(() => import('views/report/SYQGYQUserResidualAirRecord')));
const SYQNewUserSalesStatisticsOldTable = Loadable(lazy(() => import('views/report/SYQNewUserSalesStatisticsOldTable')));
const TZTransportationOfMaterialsReport = Loadable(lazy(() => import('views/report/TZTransportationOfMaterialsReport')));
const LSHQUserNewAccountSalesStatistics = Loadable(lazy(() => import('views/report/LSHQUserNewAccountSalesStatistics')));
const DeliverymanDeliveryDirectCostReport = Loadable(lazy(() => import('views/report/DeliverymanDeliveryDirectCostReport')));
const DeliverymanTransportationOfMaterialsReport = Loadable(lazy(() => import('views/report/DeliverymanTransportationOfMaterialsReport')));
const TZBSalesStatistics = Loadable(lazy(() => import('views/report/TZBSalesStatistics')));
const WiringOthsrServicesReport = Loadable(lazy(() => import('views/report/WiringOthsrServicesReport')));
const TransportationOfMaterialsReport = Loadable(lazy(() => import('views/report/TransportationOfMaterialsReport')));
const LSHQdeliverymanCommissionStatistics = Loadable(lazy(() => import('views/report/LSHQdeliverymanCommissionStatistics')));
const GYQSalesCommission = Loadable(lazy(() => import('views/report/GYQSalesCommission')));
const LSHQdepartmentWarehousingOfZp = Loadable(lazy(() => import('views/report/LSHQdepartmentWarehousingOfZp')));
const LSHQUserNewAccountStatistics = Loadable(lazy(() => import('views/report/LSHQUserNewAccountStatistics')));
const LSHQUserSalesDetailsStatistics = Loadable(lazy(() => import('views/report/LSHQUserSalesDetailsStatistics')));
const PSBDeliverymanCommissionStatistics = Loadable(lazy(() => import('views/report/PSBDeliverymanCommissionStatistics')));
const LSHQUserNewAccountSalesCommissionStatistics = Loadable(lazy(() => import('views/report/LSHQUserNewAccountSalesCommissionStatistics')));
const LSHQUserSalesStatistics = Loadable(lazy(() => import('views/report/LSHQUserSalesStatistics')));
const NewGetSalesSecurityCheckRecord = Loadable(lazy(() => import('views/department/NewGetSalesSecurityCheckRecord')));


const WiringOtherReport = Loadable(lazy(() => import('views/report/WiringOtherReport')));
const BorrowPackingtypeOfUserRecord = Loadable(lazy(() => import('views/report/BorrowPackingtypeOfUserRecord')));
const BorrowPackingtypeOfUserReport = Loadable(lazy(() => import('views/report/BorrowPackingtypeOfUserReport')));
const SalesArrearsSummary = Loadable(lazy(() => import('views/report/SalesArrearsSummary')));
const NewSalesReport = Loadable(lazy(() => import('views/report/NewSalesReport')));
const OverdueUnderPackingtypeRecord = Loadable(lazy(() => import('views/report/OverdueUnderPackingtypeRecord')));
const NewBuyMaterialRecord = Loadable(lazy(() => import('views/report/NewBuyMaterialRecord')));
const GetUserApplyBindingSnsRecord = Loadable(lazy(() => import('views/other/GetUserApplyBindingSnsRecord')));
const GetSnsAppointmentRepairRecord = Loadable(lazy(() => import('views/other/GetSnsAppointmentRepairRecord')));
const GPGLBBuyMaterialStatistics = Loadable(lazy(() => import('views/report/GPGLBBuyMaterialStatistics')));
const TZUserSalesDetailed = Loadable(lazy(() => import('views/report/TZUserSalesDetailed')));
const OpeHoldPackingtypeInfoCode = Loadable(lazy(() => import('views/pages/material/OpeHoldPackingtypeInfoCode')));
const InventoryMaterialDataInfo = Loadable(lazy(() => import('views/pages/material/InventoryMaterialDataInfo')));
const KfzxServicetypeInfoDetail = Loadable(lazy(() => import('views/report/kfzx/KfzxServicetypeInfoDetail')));
const KfzxIncompleteWorkDetail = Loadable(lazy(() => import('views/report/kfzx/KfzxIncompleteWorkDetail')));
const KfzxServiceopeCommissionReport = Loadable(lazy(() => import('views/report/kfzx/KfzxServiceopeCommissionReport')));
const KfzxServicetypeReport = Loadable(lazy(() => import('views/report/kfzx/KfzxServicetypeReport')));
const KfzxServiceopeInstallationBudgetCommissionReport = Loadable(lazy(() => import('views/report/kfzx/KfzxServiceopeInstallationBudgetCommissionReport')));
const KfzxServiceopeMaintenanceCommissionReport = Loadable(lazy(() => import('views/report/kfzx/KfzxServiceopeMaintenanceCommissionReport')));
const SYQRetreatUserPackingtypeMaterialTable = Loadable(lazy(() => import('views/report/SYQRetreatUserPackingtypeMaterialTable')));


const PSBNewUserStatisticsOfSalesman = Loadable(lazy(() => import('views/report/PSBNewUserStatisticsOfSalesman')));
const PSBSalesStatisticsOfUnit = Loadable(lazy(() => import('views/report/PSBSalesStatisticsOfUnit')));
const SYQGYQUserAllocateAndTransferRecord = Loadable(lazy(() => import('views/report/SYQGYQUserAllocateAndTransferRecord')));
const PSBSalesStatisticsOfBrand = Loadable(lazy(() => import('views/report/PSBSalesStatisticsOfBrand')));
const HandleGoodsSalesMashupReport2 = Loadable(lazy(() => import('views/report/HandleGoodsSalesMashupReport2')));
const PSBSalesmanDYCommissionStatistics = Loadable(lazy(() => import('views/report/PSBSalesmanDYCommissionStatistics')));
const PSBSalesmanWYCommissionStatistics = Loadable(lazy(() => import('views/report/PSBSalesmanWYCommissionStatistics')));
const PSBsjdxCommissionStatistics = Loadable(lazy(() => import('views/report/PSBsjdxCommissionStatistics')));
const PSByyzxCommissionStatistics = Loadable(lazy(() => import('views/report/PSByyzxCommissionStatistics')));
const PSBNewUserStatistics = Loadable(lazy(() => import('views/report/PSBNewUserStatistics')));
const PSBDepartmentSalesCommissionStatistics = Loadable(lazy(() => import('views/report/PSBDepartmentSalesCommissionStatistics')));
const PSBWaterSummaryOfOutstandingDebts = Loadable(lazy(() => import('views/report/PSBWaterSummaryOfOutstandingDebts')));
const CollectionReportOfFinance = Loadable(lazy(() => import('views/report/CollectionReportOfFinance')));
const SYQNEWUSERCXTable = Loadable(lazy(() => import('views/report/SYQNEWUSERCXTable')));
const ActiveUserNumOfPSB = Loadable(lazy(() => import('views/report/ActiveUserNumOfPSB')));
const GetTransportationExpensesParameter = Loadable(lazy(() => import('views/sys/GetTransportationExpensesParameter')));
const RepairPartsList = Loadable(lazy(() => import('views/sys/RepairPartsList')));
const FeiEPrintConfigList = Loadable(lazy(() => import('views/sys/FeiEPrintConfigList')));
const PackingtypePosition = Loadable(lazy(() => import('views/department/PackingtypePosition')));

const Departmentqrcpde = Loadable(lazy(() => import('views/department/List')));
const UpdateCompanyInfo = Loadable(lazy(() => import('views/sys/UpdateCompanyInfo')));
const DispatchDepartmentList = Loadable(lazy(() => import('views/sys/DispatchDepartmentList')));
const UserAgreementModificationPriceConfigList = Loadable(lazy(() => import('views/sys/UserAgreementModificationPriceConfigList')));
const GetUserAgreementModificationPriceSalesRecord = Loadable(lazy(() => import('views/sys/GetUserAgreementModificationPriceSalesRecord')));
const HandleSpecialUserPackingtypeWarehouse = Loadable(lazy(() => import('views/sys/HandleSpecialUserPackingtypeWarehouse')));
const GetCTIUserOrder = Loadable(lazy(() => import('views/sys/GetCTIUserOrder')));
const GetUserCollectPackingtypeOfSalesRecord = Loadable(lazy(() => import('views/other/GetUserCollectPackingtypeOfSalesRecord')));
const UserTransferDisplayInfo = Loadable(lazy(() => import('views/department/UserTransferDisplayInfo')));
const GetUserSNSPayInfo = Loadable(lazy(() => import('views/other/GetUserSNSPayInfo')));
const BuyUserPackingtypeSaveBill = Loadable(lazy(() => import('views/material/BuyUserPackingtypeSaveBill')));
const GasOrderRouteSummary = Loadable(lazy(() => import('views/report/GasOrderRouteSummary')));
const YYZXGasOrderRouteSummary = Loadable(lazy(() => import('views/report/YYZXGasOrderRouteSummary')));
const SYQSalesRecord = Loadable(lazy(() => import('views/report/SYQSalesRecord')));
const SYQGasOrderRouteSummary = Loadable(lazy(() => import('views/report/SYQGasOrderRouteSummary')));
const SCBResidualAirRecord = Loadable(lazy(() => import('views/report/SCBResidualAirRecord')));
const KfzxServiceOrderDetails = Loadable(lazy(() => import('views/report/KfzxServiceOrderDetails')));
const KfzxServiceOrderCompletionStatistics = Loadable(lazy(() => import('views/report/KfzxServiceOrderCompletionStatistics')));
const YYJDContributionRecordReport = Loadable(lazy(() => import('views/report/YYJDContributionRecordReport')));
const GetInvoiceKpr = Loadable(lazy(() => import('views/sys/GetInvoiceKpr')));
const GetFillRecord = Loadable(lazy(() => import('views/other/GetFillRecord')));
const GetFillBeforeInspectRecord = Loadable(lazy(() => import('views/other/GetFillBeforeInspectRecord')));
const GetFillAfterInspectRecord = Loadable(lazy(() => import('views/other/GetFillAfterInspectRecord')));
const GetWanderAboutRecord = Loadable(lazy(() => import('views/other/GetWanderAboutRecord')));
const GetFillInspectors = Loadable(lazy(() => import('views/sys/GetFillInspectors')));
const PSBDepartmentUserSalesInfo = Loadable(lazy(() => import('views/report/PSBDepartmentUserSalesInfo')));
const UserOtherDataList = Loadable(lazy(() => import('views/pages/users/UserOtherDataList')));
const SCBAccUserInfoRecord = Loadable(lazy(() => import('views/report/SCBAccUserInfoRecord')));
const RepairPartsTypeList = Loadable(lazy(() => import('views/sys/RepairPartsTypeList')));
const GetInOrOutRecord = Loadable(lazy(() => import('views/repair/GetInOrOutRecord')));
const GetSalesSummaryOfGoodsname = Loadable(lazy(() => import('views/repair/GetSalesSummaryOfGoodsname')));
const GetSalesSummaryOfUser = Loadable(lazy(() => import('views/repair/GetSalesSummaryOfUser')));
const GetCostPrice = Loadable(lazy(() => import('views/repair/GetCostPrice')));
const GetSalesSummaryOfDepartment = Loadable(lazy(() => import('views/repair/GetSalesSummaryOfDepartment')));
const GetOpeInventory = Loadable(lazy(() => import('views/repair/GetOpeInventory')));
const GetDepartmentInventory = Loadable(lazy(() => import('views/repair/GetDepartmentInventory')));
const GetOpeCommission = Loadable(lazy(() => import('views/repair/GetOpeCommission')));
const OtherServicesOrderProgressTracking = Loadable(lazy(() => import('views/other/OtherServicesOrderProgressTracking')));
const SettingIntegralMultipleConfig = Loadable(lazy(() => import('views/sys/SettingIntegralMultipleConfig')));
const VerifyPriceAdjustment = Loadable(lazy(() => import('views/sys/VerifyPriceAdjustment')));


// sample page routing
const SamplePage = Loadable(lazy(() => import('views/sample-page')));


// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
    path: '/',
    element: <MainLayout/>,
    children: [
        {
            path: '/',
            element: <DashboardDefault/>
        },
        {
            path: '/chat',
            element: <Chat/>
        },
        {
            path: '/departmentqrcpde',
            element: <Departmentqrcpde/>
        },
        {
            path: '/other/UserTransferDisplayInfo',
            element: <UserTransferDisplayInfo/>
        },

        {
            path: '/other/OtherServicesOrderProgressTracking',
            element: <OtherServicesOrderProgressTracking/>
        },

        {
            path: '/repair/GetInOrOutRecord',
            element: <GetInOrOutRecord/>
        },
        {
            path: '/repair/GetDepartmentInventory',
            element: <GetDepartmentInventory/>
        },
        {
            path: '/repair/GetOpeCommission',
            element: <GetOpeCommission/>
        },
        {
            path: '/repair/GetOpeInventory',
            element: <GetOpeInventory/>
        },
        {
            path: '/repair/GetSalesSummaryOfDepartment',
            element: <GetSalesSummaryOfDepartment />
        },
        {
            path: '/repair/GetCostPrice',
            element: <GetCostPrice/>
        },
        {
            path: '/repair/GetSalesSummaryOfUser',
            element: <GetSalesSummaryOfUser/>
        },
        {
            path: '/repair/GetSalesSummaryOfGoodsname',
            element: <GetSalesSummaryOfGoodsname/>
        },
        {
            path: '/report/SCBAccUserInfoRecord',
            element: <SCBAccUserInfoRecord/>
        },
        {
            path: '/sys/RepairPartsTypeList',
            element: <RepairPartsTypeList/>
        },
        {
            path: '/sys/VerifyPriceAdjustment',
            element: <VerifyPriceAdjustment />
        },
        {
            path: '/sys/GetFillInspectors',
            element: <GetFillInspectors/>
        },
        {
            path: '/sys/SettingIntegralMultipleConfig',
            element: <SettingIntegralMultipleConfig />
        },
        {
            path: '/other/GetFillRecord',
            element: <GetFillRecord/>
        },
        {
            path: '/other/GetFillAfterInspectRecord',
            element: <GetFillAfterInspectRecord/>
        },
        {
            path: '/other/GetWanderAboutRecord',
            element: <GetWanderAboutRecord/>
        },
        {
            path: '/other/GetFillBeforeInspectRecord',
            element: <GetFillBeforeInspectRecord/>
        },
        {
            path: '/users/UserOtherDataList',
            element: <UserOtherDataList/>
        },
        {
            path: '/report/GasOrderRouteSummary',
            element: <GasOrderRouteSummary/>
        },
        {
            path: '/report/PSBDepartmentUserSalesInfo',
            element: <PSBDepartmentUserSalesInfo />
        },

        {
            path: '/report/YYJDContributionRecordReport',
            element: <YYJDContributionRecordReport/>
        },
        {
            path: '/sys/GetInvoiceKpr',
            element: <GetInvoiceKpr/>
        },
        {
            path: '/report/KfzxServiceOrderCompletionStatistics',
            element: <KfzxServiceOrderCompletionStatistics/>
        },
        {
            path: '/report/SCBResidualAirRecord',
            element: <SCBResidualAirRecord/>
        },
        {
            path: '/report/SYQGasOrderRouteSummary',
            element: <SYQGasOrderRouteSummary />
        },
        {
            path: '/report/KfzxServiceOrderDetails',
            element: <KfzxServiceOrderDetails />
        },
        {
            path: '/report/SYQSalesRecord',
            element: <SYQSalesRecord/>
        },
        {
            path: '/users/BuyUserPackingtypeSaveBill',
            element: <BuyUserPackingtypeSaveBill/>
        },
        {
            path: '/other/GetUserSNSPayInfo',
            element: <GetUserSNSPayInfo />
        },
        {
            path: '/dashboard/default',
            element: <DashboardDefault/>
        },
        {
            path: '/sys/SettingServiceType',
            element: <SettingServiceType/>
        },
        {
            path: '/report/FinanceSalesExpress',
            element: < FinanceSalesExpress/>
        },
        {
            path: '/report/YYZXGasOrderRouteSummary',
            element: < YYZXGasOrderRouteSummary/>
        },
        {
            path: '/sys/GetFinanceCollectionProjectConfig',
            element: <GetFinanceCollectionProjectConfig />
        },
        {
            path: '/sys/FeiEPrintConfigList',
            element: <FeiEPrintConfigList/>
        },
        {
            path: '/sys/GetCTIUserOrder',
            element: <GetCTIUserOrder/>
        },
        {
            path: '/other/GetUserCollectPackingtypeOfSalesRecord',
            element: <GetUserCollectPackingtypeOfSalesRecord/>
        },
        {
            path: '/sys/GetUserAgreementModificationPriceSalesRecord',
            element: <GetUserAgreementModificationPriceSalesRecord/>
        },
        {
            path: '/sys/SettingMenu',
            element: <SettingMenu/>
        },
        {
            path: '/sys/HandleSpecialUserPackingtypeWarehouse',
            element: <HandleSpecialUserPackingtypeWarehouse/>
        },
        {
            path: '/sys/UserAgreementModificationPriceConfigList',
            element: <UserAgreementModificationPriceConfigList/>
        },
        {
            path: '/other/GetUserApplyBindingSnsRecord',
            element: <GetUserApplyBindingSnsRecord/>
        },
        {
            path: '/other/GetSnsAppointmentRepairRecord',
            element: <GetSnsAppointmentRepairRecord/>
        },
        {
            path: '/report/HandleGoodsSalesMashupReport',
            element: <HandleGoodsSalesMashupReport/>
        },
        {
            path: '/report/CollectionReportOfFinance',
            element: <CollectionReportOfFinance />
        },
        {
            path: '/report/KfzxServiceopeMaintenanceCommissionReport',
            element: <KfzxServiceopeMaintenanceCommissionReport/>
        },
        {
            path: '/report/SYQNEWUSERCXTable',
            element: <SYQNEWUSERCXTable />
        },
        {
            path: '/report/KfzxServiceopeInstallationBudgetCommissionReport',
            element: <KfzxServiceopeInstallationBudgetCommissionReport/>
        },
        {
            path: '/report/ActiveUserNumOfPSB',
            element: <ActiveUserNumOfPSB />
        },
        {
            path: '/report/BorrowPackingtypeOfUserReport',
            element: <BorrowPackingtypeOfUserReport/>
        },
        {
            path: '/report/HandleGoodsSalesMashupReport2',
            element: <HandleGoodsSalesMashupReport2/>
        },
        {
            path: '/report/SYQRetreatUserPackingtypeMaterialTable',
            element: <SYQRetreatUserPackingtypeMaterialTable/>
        },
        {
            path: '/report/BorrowPackingtypeOfUserRecord',
            element: <BorrowPackingtypeOfUserRecord/>
        },
        {
            path: '/report/GPGLBBuyMaterialStatistics',
            element: <GPGLBBuyMaterialStatistics/>
        },
        {
            path: '/report/SYQGYQUserResidualAirRecord',
            element: <SYQGYQUserResidualAirRecord/>
        },
        {
            path: '/report/PSBNewUserStatisticsOfSalesman',
            element: <PSBNewUserStatisticsOfSalesman/>
        },
        {
            path: '/report/OverdueUnderPackingtypeRecord',
            element: <OverdueUnderPackingtypeRecord/>
        },
        {
            path: '/department/NewGetSalesSecurityCheckRecord',
            element: <NewGetSalesSecurityCheckRecord/>
        },
        {
            path: '/report/LSHQUserNewAccountSalesStatistics',
            element: <LSHQUserNewAccountSalesStatistics/>
        },
        {
            path: '/report/TZUserSalesDetailed',
            element: <TZUserSalesDetailed/>
        },
        {
            path: '/report/SalesArrearsSummary',
            element: <SalesArrearsSummary/>
        },
        {
            path: '/report/KfzxServicetypeReport',
            element: <KfzxServicetypeReport/>
        },
        {
            path: '/report/KfzxIncompleteWorkDetail',
            element: <KfzxIncompleteWorkDetail/>
        },
        {
            path: '/report/PSBSalesStatisticsOfBrand',
            element: <PSBSalesStatisticsOfBrand/>
        },
        {
            path: '/report/SYQGYQUserAllocateAndTransferRecord',
            element: <SYQGYQUserAllocateAndTransferRecord/>
        },
        {
            path: '/report/NewBuyMaterialRecord',
            element: <NewBuyMaterialRecord/>
        },

        {
            path: '/report/PSBSalesStatisticsOfUnit',
            element: <PSBSalesStatisticsOfUnit/>
        },

        {
            path: '/report/DeliverymanDeliveryResidualReport',
            element: <DeliverymanDeliveryResidualReport/>
        },
        {
            path: '/sys/DispatchDepartmentList',
            element: <DispatchDepartmentList/>
        },
        {
            path: '/sys/RepairPartsList',
            element: <RepairPartsList/>
        },
        {
            path: '/department/PackingtypePosition',
            element: <PackingtypePosition/>
        },
        {
            path: '/other/GetUserDiscountApplicationsList',
            element: <GetUserDiscountApplicationsList/>
        },
        {
            path: '/sys/SettingDepartmenGoodsSalesPromotion',
            element: <SettingDepartmenGoodsSalesPromotion/>
        },
        {
            path: '/sys/SettingPackingtypeBillingMode',
            element: <SettingPackingtypeBillingMode/>
        },
        {
            path: '/sys/SettingUserOverlayOfferInSpecifiedRangeForCustomertype',
            element: <SettingUserOverlayOfferInSpecifiedRangeForCustomertype/>
        },
        {
            path: '/sys/GetTransportationExpensesParameter',
            element: <GetTransportationExpensesParameter/>
        },

        {
            path: '/sys/goods',
            element: <Goods/>
        },
        {
            path: '/sys/GetSalesKit',
            element: <GetSalesKit/>
        },
        {
            path: '/report/PSBWaterSummaryOfOutstandingDebts',
            element: <PSBWaterSummaryOfOutstandingDebts/>
        },
        {
            path: '/report/PSBsjdxCommissionStatistics',
            element: <PSBsjdxCommissionStatistics/>
        },
        {
            path: '/report/PSBNewUserStatistics',
            element: <PSBNewUserStatistics/>
        },
        {
            path: '/report/KfzxServiceopeCommissionReport',
            element: <KfzxServiceopeCommissionReport/>
        },
        {
            path: '/report/KfzxServicetypeInfoDetail',
            element: <KfzxServicetypeInfoDetail/>
        },
        {
            path: '/report/PSByyzxCommissionStatistics',
            element: <PSByyzxCommissionStatistics/>
        },
        {
            path: '/report/PSBSalesmanDYCommissionStatistics',
            element: <PSBSalesmanDYCommissionStatistics/>
        },
        {
            path: '/report/PSBSalesmanWYCommissionStatistics',
            element: <PSBSalesmanWYCommissionStatistics/>
        },
        {
            path: '/report/ExchangeMaterialStatistics',
            element: <ExchangeMaterialStatistics/>
        },
        {
            path: '/report/WiringOtherReport',
            element: <WiringOtherReport/>
        },
        {
            path: '/report/PSBDepartmentSalesCommissionStatistics',
            element: <PSBDepartmentSalesCommissionStatistics/>
        },
        {
            path: '/report/LSHQdeliverymanCommissionStatistics',
            element: <LSHQdeliverymanCommissionStatistics/>
        },
        {
            path: '/report/LSHQUserNewAccountStatistics',
            element: <LSHQUserNewAccountStatistics/>
        },
        {
            path: '/report/SYQUserResidualTransactionReport',
            element: <SYQUserResidualTransactionReport/>
        },
        {
            path: '/report/SYQUserResidualWriteoffReport',
            element: <SYQUserResidualWriteoffReport/>
        },
        {
            path: '/report/LSHQUserSalesDetailsStatistics',
            element: <LSHQUserSalesDetailsStatistics/>
        },
        {
            path: '/report/GYQSalesCommission',
            element: <GYQSalesCommission/>
        },
        {
            path: '/report/LSHQUserNewAccountSalesCommissionStatistics',
            element: <LSHQUserNewAccountSalesCommissionStatistics/>
        },
        {
            path: '/report/NewSalesReport',
            element: <NewSalesReport/>
        },
        {
            path: '/report/LSHQdepartmentWarehousingOfZp',
            element: <LSHQdepartmentWarehousingOfZp/>
        },
        {
            path: '/report/LSHQUserSalesStatistics',
            element: <LSHQUserSalesStatistics/>
        },
        {
            path: '/report/TZTransportationOfMaterialsReport',
            element: <TZTransportationOfMaterialsReport/>
        },
        {
            path: '/report/WiringOthsrServicesReport',
            element: <WiringOthsrServicesReport/>
        },
        {
            path: '/report/DepartmentExchangeMaterialStatistics',
            element: <DepartmentExchangeMaterialStatistics/>
        },
        {
            path: '/report/PSBDeliverymanCommissionStatistics',
            element: <PSBDeliverymanCommissionStatistics/>
        },

        {
            path: '/report/DeliverymanDeliveryDetailed',
            element: <DeliverymanDeliveryDetailed/>
        },
        {
            path: '/report/SYQSalesKit',
            element: <SYQSalesKit/>
        },

        {
            path: '/report/DeliverymanDeliveryDetailedSavepackingtype',
            element: <DeliverymanDeliveryDetailedSavepackingtype/>
        },
        {
            path: '/report/SYQNewUserSalesStatisticsTable',
            element: <SYQNewUserSalesStatisticsTable/>
        },
        {
            path: '/report/SYQNewUserSalesStatisticsOldTable',
            element: <SYQNewUserSalesStatisticsOldTable/>
        },
        {
            path: '/report/DeliverymanTransportationOfMaterialsReport',
            element: <DeliverymanTransportationOfMaterialsReport/>
        },
        {
            path: '/report/BuyPackingtypeList',
            element: <BuyPackingtypeList/>
        },
        {
            path: '/report/TZBSalesStatistics',
            element: <TZBSalesStatistics/>
        },
        {
            path: '/report/DeliverymanDeliveryDirectCostReport',
            element: <DeliverymanDeliveryDirectCostReport/>
        },
        {
            path: '/sys/UpdateCompanyInfo',
            element: <UpdateCompanyInfo/>
        },
        {
            path: '/sys/GetSnsPayRecord',
            element: <GetSnsPayRecord/>
        },
        {
            path: '/sys/GetSnsPayRefundRecord',
            element: <GetSnsPayRefundRecord/>
        },
        {
            path: '/sys/SecurityInspectionItemsList',
            element: <SecurityInspectionItemsList/>
        },
        {
            path: '/users/CreateUserGoodsSalesMashup',
            element: <CreateUserGoodsSalesMashup/>
        },
        {
            path: '/other/UserListOfSalesman',
            element: <UserListOfSalesman/>
        },
        {
            path: '/other/GetOpeMinLoginRecord',
            element: <GetOpeMinLoginRecord/>
        },
        {
            path: '/other/InvoiceRecordList',
            element: <InvoiceRecordList/>
        },
        {
            path: '/other/GetOtherSubsidyRecord',
            element: <GetOtherSubsidyRecord/>
        },
        {
            path: '/other/GetDistributionSubsidyOfCompanyRecord',
            element: <GetDistributionSubsidyOfCompanyRecord/>
        },
        {
            path: '/other/UserListOfDepartment',
            element: <UserListOfDepartment/>
        },
        {
            path: '/other/GetOtherAvailableSubsidyRecord',
            element: <GetOtherAvailableSubsidyRecord/>
        },
        {
            path: '/report/SalesReportOfPrice',
            element: <SalesReportOfPrice/>
        },
        {
            path: '/report/SalesReportWater',
            element: <SalesReportWater/>
        },
        {
            path: '/report/LSQUserSalesInfo',
            element: <LSQUserSalesInfo/>
        },
        {
            path: '/report/TransportationOfMaterialsReport',
            element: <TransportationOfMaterialsReport/>
        },
        {
            path: '/report/OutstandingOrdersReport',
            element: <OutstandingOrdersReport/>
        },
        {
            path: '/report/DeliverymanDeliveryNoDirectCostDetailed',
            element: <DeliverymanDeliveryNoDirectCostDetailed/>
        },
        {
            path: '/report/OtherSubsidyReport',
            element: <OtherSubsidyReport/>
        },
        {
            path: '/report/SYQUserSalesGoodsDifferenceTable',
            element: <SYQUserSalesGoodsDifferenceTable/>
        },
        {
            path: '/sys/SettingQuarters',
            element: <SettingQuarters/>
        },
        {
            path: '/department/GetResidualGasToBeConfirmedRecord',
            element: <GetResidualGasToBeConfirmedRecord/>
        },
        {
            path: '/department/SpotCheckCommodityQuality',
            element: <SpotCheckCommodityQuality/>
        },
        {
            path: '/department/SplitUserPackingtypeWarehouse',
            element: <SplitUserPackingtypeWarehouse/>
        },
        {
            path: '/department/MergeUserPackingtypeWarehouse',
            element: <MergeUserPackingtypeWarehouse/>
        },
        {
            path: '/sys/CustomertypeList',
            element: <CustomertypeList/>
        },
        {
            path: '/sys/BuyPackingtypeParameterList',
            element: <BuyPackingtypeParameterList/>
        },
        {
            path: '/sys/OperatorList',
            element: <OperatorList/>
        },
        {
            path: '/sys/GoodsCatList',
            element: <GoodsCatList/>
        },
        {
            path: '/sys/GoodsTypeList',
            element: <GoodsTypeList/>
        },
        {
            path: '/users/CollectUserPackingtypeMaterialNoTraceTheSource',
            element: <CollectUserPackingtypeMaterialNoTraceTheSource/>
        },
        {
            path: '/sys/HousingpropertyList',
            element: <HousingpropertyList/>
        },
        {
            path: '/material/ApplyMaterialTransferPlan',
            element: <ApplyMaterialTransferPlan/>
        },
        {
            path: '/material/SignTransportRecord',
            element: <SignTransportRecord/>
        },
        {
            path: '/material/GetHandleProblemPackingtypeRecord',
            element: <GetHandleProblemPackingtypeRecord/>
        },
        {
            path: '/material/InventoryMaterialDataInfo',
            element: <InventoryMaterialDataInfo/>
        },
        {
            path: '/material/GetTransportBatchnumberInfo',
            element: <GetTransportBatchnumberInfo/>
        },
        {
            path: '/material/OpeAbnormalExchangeRecord',
            element: <OpeAbnormalExchangeRecord/>
        },
        {
            path: '/material/MaterialTransferPlanRecord',
            element: <MaterialTransferPlanRecord/>
        },
        {
            path: '/material/OpeHoldPackingtypeInfoCode',
            element: <OpeHoldPackingtypeInfoCode/>
        },
        {
            path: '/material/WaterNoScanTransferMaterialRecord',
            element: <WaterNoScanTransferMaterialRecord/>
        },
        {
            path: '/users/UserCallRegistrationList',
            element: <UserCallRegistrationList/>
        },
        {
            path: '/users/ownerorder',
            element: <Ownerorder/>
        },
        {
            path: '/users/EditUserExclusiveSalesman',
            element: <EditUserExclusiveSalesman/>
        },
        {
            path: '/material/MChangeMaterialType',
            element: <MChangeMaterialType/>
        },
        {
            path: '/material/NoScanTransferMaterial',
            element: <NoScanTransferMaterial/>
        },
        {
            path: '/department/GetWarningRecord',
            element: <GetWarningRecord/>
        },
        {
            path: '/department/UserNoDirectCostList',
            element: <UserNoDirectCostList/>
        },
        {
            path: '/department/MaterialCirculationRecord',
            element: <MaterialCirculationRecord/>
        },
        {
            path: '/material/TransferMaterialRecord',
            element: <TransferMaterialRecord/>
        },
        {
            path: '/material/InventoryAlert',
            element: <InventoryAlert/>
        },
        {
            path: '/order/OtherServicesOrderList',
            element: <OtherServicesOrderList/>,
            meta: {}
        },
        {
            path: '/sys/ServiceAreaList',
            element: <ServiceAreaList/>
        },
        {
            path: '/sys/GoodsBrandList',
            element: <GoodsBrandList/>
        },
        {
            path: '/users/UserBasicInfo',
            element: <UserBasicInfo/>,

        },
        {
            path: '/sys/InitCompanyInfo',
            element: <InitCompanyInfo/>,

        },
        {
            path: '/users/CreateUserPackingtypeArchives',
            element: <CreateUserPackingtypeArchives/>,

        },
        {
            path: '/sys/SettingPreferentialRecharge',
            element: <SettingPreferentialRecharge/>,

        },
        {
            path: '/users/RetreatUserPackingtypeMoney',
            element: <RetreatUserPackingtypeMoney/>,

        },
        {
            path: '/users/UserPreferentialRecharge',
            element: <UserPreferentialRecharge/>,

        },
        {
            path: '/users/UpdateUserBasicInfo',
            element: <UpdateUserBasicInfo/>,

        },
        {
            path: '/users/Invoice',
            element: <Invoice/>,

        },
        {
            path: '/sys/PermissionProgrammeList',
            element: <PermissionProgrammeList/>,

        },
        {
            path: '/sys/GoodsSalesMashupList',
            element: <GoodsSalesMashupList/>,

        },
        {
            path: '/users/RetreatUserGoodsWarehouse',
            element: <RetreatUserGoodsWarehouse/>,

        },
        {
            path: '/users/UserRecharge',
            element: <UserRecharge/>,

        },
        {
            path: '/users/UserRefund',
            element: <UserRefund/>,

        },
        {
            path: '/users/VagueQueryUserInfo',
            element: <VagueQueryUserInfo/>
        },
        {
            path: '/department/ConfirmSaleOrderRecord',
            element: <ConfirmSaleOrderRecord/>,

        },
        {
            path: '/department/GetPackingInspectRecord',
            element: <GetPackingInspectRecord/>,

        },
        {
            path: '/department/GetSafetyProductionRecord',
            element: <GetSafetyProductionRecord/>,

        },
        {
            path: '/department/GetSpotCheckCommodityQualityRecord',
            element: <GetSpotCheckCommodityQualityRecord/>,

        },
        {
            path: '/department/DepartmentUserOrderInfo',
            element: <DepartmentUserOrderInfo/>,

        },
        {
            path: '/department/AddContributionRecord',
            element: <AddContributionRecord/>,

        },
        {
            path: '/department/AdvancePaymentOrderList',
            element: <AdvancePaymentOrderList/>,

        },
        {
            path: '/department/AddDistributionSubsidyOfCompanyRecord',
            element: <AddDistributionSubsidyOfCompanyRecord/>,

        },
        {
            path: '/department/GetSalesSecurityCheckRecord',
            element: <GetSalesSecurityCheckRecord/>,

        },
        {
            path: '/department/HandleMaterial',
            element: <HandleMaterial/>,

        },
        {
            path: '/department/GetCanRevokeBusiness',
            element: <GetCanRevokeBusiness/>,

        },
        {
            path: '/users/Business',
            element: <Business/>
        },

        {
            path: '/users/CommodityExchange',
            element: <CommodityExchange/>
        },
        {
            path: '/users/RetreatUserPackingtypeMaterial',
            element: <RetreatUserPackingtypeMaterial/>
        },
        {
            path: '/sys/ChangePassword',
            element: <ChangePassword/>
        }, {
            path: '/sys/AutoAllocationList',
            element: <AutoAllocationList/>
        },
        {
            path: '/users/ApplyUserGoodsSalespromotion',
            element: <ApplyUserGoodsSalespromotion/>
        },
        {
            path: '/users/ApplyUserPackingtypeChargeSalespromotion',
            element: <ApplyUserPackingtypeChargeSalespromotion/>
        },
        {
            path: '/users/BuyUserPackingtypeMaterial',
            element: <BuyUserPackingtypeMaterial/>
        },
        {
            path: '/users/BuyUserTongPackingtypeMaterial',
            element: <BuyUserTongPackingtypeMaterial/>
        },

        {
            path: '/users/CollectUserPackingtypeCharge',
            element: <CollectUserPackingtypeCharge/>
        },
        {
            path: '/users/AddUserBasicInfo',
            element: <AddUserBasicInfo/>
        },
        {
            path: '/material/OpeHoldPackingtypeInfo',
            element: <OpeHoldPackingtypeInfo/>
        },
        {
            path: '/users/ApplyUserPackingtypeSalespromotion',
            element: <ApplyUserPackingtypeSalespromotion/>
        },
        {
            path: '/order/ConfirmSaleOrderRecord',
            element: <ConfirmSaleOrderRecord/>
        },
        {
            path: '/users/gasbuy',
            element: <Gasbuy/>
        },
        {
            path: '/other/SendGiveProgrammeToSalesman',
            element: <SendGiveProgrammeToSalesman/>
        },
        {
            path: '/other/GetUserInfoOfMateralCode',
            element: <GetUserInfoOfMateralCode/>
        },
        {
            path: '/other/GetOpeDailyWorkLoad',
            element: <GetOpeDailyWorkLoad/>
        },
        {
            path: '/material/StaffTransferMaterial',
            element: <StaffTransferMaterial/>
        },
        {
            path: '/users/UserBottleEntry',
            element: <UserBottleEntry/>
        },
        {
            path: '/order/OrderList',
            element: <OrderList/>
        },
        {
            path: '/order/OrderListYSGS',
            element: <OrderListYSGS/>
        },
        {
            path: '/report/DeliverymanWorkFloorStatistics',
            element: <DeliverymanWorkFloorStatistics/>
        },
        {
            path: '/report/SYQUserFollowUpTaskRecordTable',
            element: <SYQUserFollowUpTaskRecordTable/>
        },
        {
            path: '/report/SYQKHCXTable',
            element: <SYQKHCXTable/>
        },
        {
            path: '/report/SYQKHYHCXTable',
            element: <SYQKHYHCXTable/>
        },
        {
            path: '/report/SYQSalesStatisticsTable',
            element: <SYQSalesStatisticsTable/>
        },
        {
            path: '/report/SYQKHYHCXTable',
            element: <SYQKHYHCXTable/>
        },
        {
            path: '/report/SYQUserFollowUpTable',
            element: <SYQUserFollowUpTable/>
        },
        {
            path: '/report/TraceTheSourceMaterialStockBookkeepingInfo',
            element: <TraceTheSourceMaterialStockBookkeepingInfo/>
        },
        {
            path: '/report/DeliverymanWorkFloorStatisticsDetailed',
            element: <DeliverymanWorkFloorStatisticsDetailed/>
        },
        {
            path: '/report/SYQUserTransferTable',
            element: <SYQUserTransferTable/>
        },
        {
            path: '/report/NewUserTransactionsStatistics',
            element: <NewUserTransactionsStatistics/>
        },
        {
            path: '/report/DeliveryUserCommodityReport',
            element: <DeliveryUserCommodityReport/>
        },
        {
            path: '/report/SYQSalesmanSalesCostTable',
            element: <SYQSalesmanSalesCostTable/>
        },
        {
            path: '/report/OtherServicesReportDetailed',
            element: <OtherServicesReportDetailed/>
        },
        {
            path: '/report/OverdueSalesArrearsRecord',
            element: <OverdueSalesArrearsRecord/>
        },
        {
            path: '/report/SYQSalesmanHoldUserTable',
            element: <SYQSalesmanHoldUserTable/>
        },
        {
            path: '/report/ResidualAirRecord',
            element: <ResidualAirRecord/>
        },
        {
            path: '/report/SalesArrearsRecord',
            element: <SalesArrearsRecord/>
        },
        {
            path: '/report/OtherServicesReport',
            element: <OtherServicesReport/>
        },
        {
            path: '/report/NewUserTransactionsStatisticsDetailed',
            element: <NewUserTransactionsStatisticsDetailed/>
        },
        {
            path: '/report/SustainSalesStatisticsDetailed',
            element: <SustainSalesStatisticsDetailed/>
        },
        {
            path: '/report/SyqRetreatUserPackingtypeMaterialNotMoneyTable',
            element: <SyqRetreatUserPackingtypeMaterialNotMoneyTable/>
        },
        {
            path: '/report/SustainSalesStatistics',
            element: <SustainSalesStatistics/>
        },
        {
            path: '/report/UnconfirmedCollectionRecord',
            element: <UnconfirmedCollectionRecord/>
        },
        {
            path: '/report/UserCallRegistrationReport',
            element: <UserCallRegistrationReport/>
        },
        {
            path: '/report/UserLastTransactionsRecord',
            element: <UserLastTransactionsRecord/>
        },
        {
            path: '/report/UserSalesStatistics',
            element: <UserSalesStatistics/>
        },
        {
            path: '/report/SYQUserOtherServicesRecordTable',
            element: <SYQUserOtherServicesRecordTable/>
        },
        {
            path: '/report/WiringSalesReport',
            element: <WiringSalesReport/>
        },
        {
            path: '/report/SYQRetreatUserPackingtypeMoneyTable',
            element: <SYQRetreatUserPackingtypeMoneyTable/>
        },
        {
            path: '/order/GetPrintInfo',
            element: <GetPrintInfo/>
        },
        {
            path: '/order/GetCtiErrorRecord',
            element: <GetCtiErrorRecord/>
        },
        {
            path: '/report/WriteOffCommodityVoucherRecord',
            element: <WriteOffCommodityVoucherRecord/>
        },
        {
            path: '/report/CollectionReport',
            element: <CollectionReport/>
        },
        {
            path: '/report/ArrearsCollectionReport',
            element: <ArrearsCollectionReport/>
        },
        {
            path: '/report/UserTransactionsRecordOfFrequency',
            element: <UserTransactionsRecordOfFrequency/>
        },
        {
            path: '/report/DistributionSubsidyOfCompanyReport',
            element: <DistributionSubsidyOfCompanyReport/>
        },
        {
            path: '/report/BorrowPackingtypeReport',
            element: <BorrowPackingtypeReport/>
        },
        {
            path: '/report/NoTraceTheSourceMaterialStockReport',
            element: <NoTraceTheSourceMaterialStockReport/>
        },
        {
            path: '/report/PackingtypeUseBillReport',
            element: <PackingtypeUseBillReport/>
        },
        {
            path: '/report/SignTransportRecordReport',
            element: <SignTransportRecordReport/>
        },
        {
            path: '/report/TraceTheSourceMaterialStockReport',
            element: <TraceTheSourceMaterialStockReport/>
        },
        {
            path: '/report/SalesReport',
            element: <SalesReport/>
        },
        {
            path: '/report/SYQSalesmanHoldUserTransactionTable',
            element: <SYQSalesmanHoldUserTransactionTable/>
        },
        {
            path: '/sys/department',
            element: <Department/>
        },
        {
            path: '/sys/CollectionReportProjectConfigList',
            element: <CollectionReportProjectConfigList/>
        },
        {
            path: '/sys/SalesReportGoodsConfigList',
            element: <SalesReportGoodsConfigList/>
        },
        {
            path: '/sys/GiveProgrammeList',
            element: <GiveProgrammeList/>
        },
        {
            path: '/sys/PackingtypeMode',
            element: <PackingtypeMode/>
        },
        {
            path: '/sys/PackingtypeList',
            element: <PackingtypeList/>
        },
        {
            path: '/material/CreateMaterialPackingtypeArchives',
            element: <CreateMaterialPackingtypeArchives/>
        },
        {
            path: '/material/MaterialPackingtypeArchivesList',
            element: <MaterialPackingtypeArchivesList/>
        },
        {
            path: '/material/MaterialPackingtypeBasicArchives',
            element: <MaterialPackingtypeBasicArchives/>
        },
        {
            path: '/material/NoTraceTheSourceMaterialStockBookkeeping',
            element: <NoTraceTheSourceMaterialStockBookkeeping/>
        },
        {
            path: '/utils/util-typography',
            element: <UtilsTypography/>
        },
        {
            path: '/utils/util-color',
            element: <UtilsColor/>
        },
        {
            path: '/users/ApplyAdjustUserQuota',
            element: <ApplyAdjustUserQuota/>
        },
        {
            path: '/utils/util-shadow',
            element: <UtilsShadow/>
        },
        {
            path: '/icons/tabler-icons',
            element: <UtilsTablerIcons/>
        },
        {
            path: '/icons/material-icons',
            element: <UtilsMaterialIcons/>
        },
        {
            path: '/sample-page',
            element: <SamplePage/>
        }
    ]
};

export default MainRoutes;
