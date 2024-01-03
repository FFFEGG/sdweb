import {Box, Button} from "@mui/material";
import {useState} from "react";
import request from "utils/request";

const GetCTIUserOrder = () => {
    const [list, setList] = useState([])
    const getlist = async () => {
        const rew = await request('post', '/api/getInfo', {
            url: 'Srapp.Web_SystemInfo.GetCTIUserOrder'
        })
        if (rew.data.msg === 'SUCCESS') {
            setList(rew.data.info)
        } else {
            setList([])
        }

    }

    const exportToExcel = () => {
        const params = {
            fileName: 'CTI订单列表',
            allColumns: true
        };
        gridApi.exportToExcel(params);
    }

    let gridApi;

    const onGridReady = (params) => {
        gridApi = params.api;
    }
    const base64 = (content) => {
        return window.btoa(unescape(encodeURIComponent(content)));
    }
    const toexcel = (tableID, fileName) => {
        console.log('toexcel')
        var excelContent = document.getElementById(tableID).innerHTML;
        // 		alert(excelContent);
        // console.log(excelContent);

        excelContent = excelContent.replace(/memberid"/g,'memberid" style="mso-number-format:/@"')

        var excelFile = "<html xmlns:o='urn:schemas-microsoft-com:office:office'  xmlns:x='urn:schemas-microsoft-com:office:excel' xmlns='http://www.w3.org/TR/REC-html40'><meta charset='UTF-8'>";
        excelFile += "<head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head>";
        excelFile += "<body><table width='10%'  border='1' style='mso-number-format:/@;'>";
        excelFile += excelContent;
        excelFile += "</table></body>";
        excelFile += "</html>";
        var link = "data:application/vnd.ms-excel;base64," + base64(excelFile);
        var a = document.createElement("a");
        a.download = fileName + ".xls";
        a.href = link;
        a.click();
    }

    return (
        <Box p={3} bgcolor={'#FFF'} borderRadius={1}>
            <Box fontSize={18} mb={2}>CTI订单列表</Box>
            <Button onClick={getlist} variant="contained">搜索</Button>
            <Button sx={{ml:2}} onClick={()=>toexcel('table','CTI订单列表')} variant="contained">导出</Button>


            <Box mt={3}>
                <table className="my-table" id={'table'}>
                    <thead>
                    <tr>
                        <td>userid</td>
                        <td>会员号</td>
                        <td>用户类型</td>
                        <td>姓名</td>
                        <td>地址ID</td>
                        <td>地址</td>
                        <td>电话</td>
                        <td>商品ID</td>
                        <td>商品类型</td>
                        <td>商品品牌</td>
                        <td>规格</td>
                        <td>单价</td>
                        <td>数量</td>
                        <td>部门</td>
                    </tr>
                    </thead>
                    <tbody>
                    {list.map((item, index) => {
                        return (
                            <tr key={index}>
                                <td>{item.userid}</td>
                                <td className="memberid">{item.memberid}</td>
                                <td>{item.customertype}</td>
                                <td>{item.name}</td>
                                <td>{item.addressid}</td>
                                <td>{item.address}</td>
                                <td>{item.telephone}</td>
                                <td>{item.goodsid}</td>
                                <td>{item.goodstype}</td>
                                <td>{item.goodsbrand}</td>
                                <td>{item.suttle  * 1}</td>
                                <td>{item.price}</td>
                                <td>{item.num  * 1}</td>
                                <td>{item.department}</td>
                            </tr>
                        )
                    })}
                    </tbody>


                </table>


            </Box>
        </Box>
    );
}

export default GetCTIUserOrder;
