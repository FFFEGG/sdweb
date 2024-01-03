import React, {useState} from 'react';
import {Box} from "@mui/system";
import {Form} from "@douyinfe/semi-ui";
import moment from "moment";
import {Button} from "@mui/material";
import request from "../../utils/request";

const FinanceSalesExpress = () => {

    const [list,setlist] = useState([])
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
        <Box p={3} bgcolor={'#fff'} borderRadius={1}
        >
            <Box
                fontSize={18}
                mb={3}
            >财务销售快报</Box>

            <Form layout={'horizontal'} labelPosition={'inset'} onSubmit={async e => {
                const rew =await request('post','/api/getInfo',{
                    url: 'Srapp.Web_Report_Finance_Infos.FinanceSalesExpress',
                    ...e
                })
                setlist(rew.data.info)
            }}>
                <Form.Input field={'begintime'} label={'开始时间'} type={'date'} initValue={moment().format('YYYY-MM-DD')} />
                <Form.Input field={'endtime'} label={'结束时间'} type={'date'} initValue={moment().format('YYYY-MM-DD')} />
                <Button variant={'outlined'} type={'submit'} size={'small'}>搜索</Button>
                <Button onClick={
                    ()=>toexcel('table1','财务销售快报')
                } sx={{ml:2}} variant={'outlined'} type={'button'} size={'small'}>导出</Button>
            </Form>


            <Box mt={3}>
                <table className={'my-table'} id={'table1'}>
                    <thead>
                    <tr>

                        <td>业务</td>
                        <td>重量</td>
                        <td>金额</td>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        list.map((item,index)=>(
                            <tr key={index}>
                                <td>{item.projectname}</td>
                                <td>{item.suttle}</td>
                                <td>{parseFloat(item.total).toFixed(2)}</td>
                            </tr>
                        ))
                    }
                    <tr>
                        <td>合计</td>
                        <td>{list.reduce((total,item)=>total+parseFloat(item.suttle),0).toFixed(2)}</td>
                        <td>{list.reduce((total,item)=>total+parseFloat(item.total),0).toFixed(2)}</td>
                    </tr>
                    </tbody>

                </table>
            </Box>
        </Box>
    );
};

export default FinanceSalesExpress;
