import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import AddIcon from '@mui/icons-material/Add';
import RepeatIcon from '@mui/icons-material/Repeat';
import ReorderIcon from "@mui/icons-material/Reorder";
// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const material = {
    id: 'materials',
    title: '物资管理',
    type: 'group',
    children: [

        {
            id: 'OpeHoldPackingtypeInfo',
            title: '员工持有包装物',
            type: 'item',
            url: '/material/OpeHoldPackingtypeInfo',
            icon: RepeatIcon,
            breadcrumbs: false
        },
        {
            id: 'MaterialPackingtypeArchivesList',
            title: '钢瓶档案列表',
            type: 'item',
            url: '/material/MaterialPackingtypeArchivesList',
            icon: PersonSearchIcon,
            breadcrumbs: false
        },
        {
            id: 'MaterialPackingtypeBasicArchives',
            title: '包装物原始档案信息',
            type: 'item',
            url: '/material/MaterialPackingtypeBasicArchives',
            icon: PersonSearchIcon,
            breadcrumbs: false
        },
        {
            id: 'CreateMaterialPackingtypeArchives',
            title: '钢瓶新增',
            type: 'item',
            url: '/material/CreateMaterialPackingtypeArchives',
            icon: AddIcon,
            breadcrumbs: false
        },
        {
            id: 'marteril',
            title: '物资调运',
            type: 'collapse',
            icon: ReorderIcon,
            children: [
                {
                    id: 'MaterialTransferPlanRecord',
                    title: '获取物资计划调拨记录',
                    type: 'item',
                    url: '/material/MaterialTransferPlanRecord'
                },
                {
                    id: 'ApplyMaterialTransferPlan',
                    title: '申请物资调运计划',
                    type: 'item',
                    url: '/material/ApplyMaterialTransferPlan'
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
};

export default material;
