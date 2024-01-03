import React, { useState } from "react";
import './CylinderPriceTable.css';
import request from "../../utils/request";
import {toast} from "react-toastify";
const CylinderPriceTable = ({list}) => {
    console.log(list)


    const [cylinders, setCylinders] = useState(list || []);

    const currentYear = new Date().getFullYear();
    const [productionYears,setProductionYears] = useState(Array.from({ length: 12 }, (_, i) => currentYear - i));
    const [inspectionYears,setInspectionYears] = useState(Array.from({ length: 12 }, (_, i) => currentYear - i));
    const [packagingTypes,setPackagingTypes] = useState([...new Set(cylinders.map((c) => c.packagingType))])

    const [activeType, setActiveType] = useState(packagingTypes[0]);

    const handlePriceEdit = (cylinder, productionYear, inspectionYear, isOwnUnit) => {
        const currentPrice = cylinder ? cylinder.price : 0;
        const newPrice = parseFloat(prompt("请输入新的指导价格:", currentPrice));

        if (isNaN(newPrice)) {
            alert("输入的价格无效，请输入有效的数字");
            return;
        }

        if (cylinder) {
            if (newPrice !== currentPrice) {
                setCylinders((prevCylinders) =>
                    prevCylinders.map((c) =>
                        c === cylinder ? { ...cylinder, price: newPrice } : c
                    )
                );
            }
        } else {
            setCylinders((prevCylinders) => [
                ...prevCylinders,
                {
                    packagingType: activeType,
                    productionYear: productionYear,
                    inspectionYear: inspectionYear,
                    isOwnUnit: isOwnUnit,
                    price: newPrice,
                },
            ]);
        }
    };



    // 添加到 CylinderPriceTable 组件的函数区域
    const handleSave = async () => {
        if (cylinders.length === 0) {
            return
        }
        const data = JSON.stringify(cylinders);
        // Srapp.Web_SystemSetting.SettingBuyPackingtypeParameter
        // 设置收购包装物价格接口
        const rew  = await request('post','/api/getInfo',{
            url: 'Srapp.Web_SystemSetting.SettingBuyPackingtypeParameter',
            detailed: data
        })
        if (rew.code === 200) {
            toast.success('保存成功')
        } else {
            toast.error('保存失败')
        }
        return
        const blob = new Blob([data], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "cylinders.json");
        document.body.appendChild(link);
        link.click();
        link.remove();
    };

    const handleAddYear = () => {
        const newYear = parseInt(prompt("请输入新的年份:"));
        if (isNaN(newYear)) {
            alert("输入的年份无效，请输入有效的数字");
            return;
        }
        if (!productionYears.includes(newYear)) {
            setProductionYears((prevYears) => [newYear, ...prevYears].sort((a, b) => b - a));
            setInspectionYears((prevYears) => [newYear, ...prevYears].sort((a, b) => b - a));
        } else {
            alert("该年份已存在");
        }
    };

    const handleAddPackagingType = () => {
        const newType = prompt("请输入新的钢瓶类型:");
        if (newType === null || newType.trim() === "") {
            alert("输入的钢瓶类型无效，请输入有效的类型");
            return;
        }
        if (!packagingTypes.includes(newType)) {
            setPackagingTypes((prevTypes) => [newType, ...prevTypes]);
        } else {
            alert("该钢瓶类型已存在");
        }
    };
    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.readAsText(file);

        reader.onload = () => {
            const fileContent = reader.result;
            const jsonData = JSON.parse(fileContent);
            console.log('jsonData',jsonData)
            // this.setState({ jsonData });
            const arr1 =  jsonData.map(item=>{
                return {
                    packagingType: item.packagingType,
                    productionYear: item.productionYear * 1,
                    inspectionYear: item.inspectionYear * 1,
                    isOwnUnit: item.isOwnUnit === "false" ? false : true,
                    price: item.price * 1
                }
            })
            // 合并cylinders,和arr1 并去重
            const arr2 = [...cylinders,...arr1]
            const uniqueArr = Array.from(new Set(arr2.map((obj) => JSON.stringify(obj)))).map((str) => JSON.parse(str));
            console.log('uniqueArr',uniqueArr)
            setCylinders(uniqueArr)
        };
    };

    const renderTable = (isOwnUnit) => (
        <table className="table-container">
            <thead>
            <tr>
                <th>检测年份↓</th>
                {productionYears.map((year, index) => (
                    <th key={index}>{year}</th>
                ))}
            </tr>
            </thead>
            <tbody>
            {inspectionYears.map((inspectionYear, rowIndex) => (
                <tr key={rowIndex}>
                    <td>{inspectionYear}</td>
                    {productionYears.map((productionYear, colIndex) => {
                        const cylinder = cylinders.find(
                            (c) =>
                                c.productionYear === productionYear &&
                                c.inspectionYear === inspectionYear &&
                                c.isOwnUnit === isOwnUnit &&
                                c.packagingType === activeType
                        );
                        return (
                            <td
                                key={colIndex}
                                className="editable"
                                onClick={() => handlePriceEdit(cylinder, productionYear, inspectionYear, isOwnUnit)}
                            >
                                {cylinder ? cylinder.price : ""}
                            </td>
                        );
                    })}
                </tr>
            ))}
            </tbody>
        </table>
    );

    return (
        <div>
            <div className="header">
                <div className="tabs">
                    {packagingTypes.map((type, index) => (
                        <button
                            key={index}
                            className={`tab ${activeType === type ? "active" : ""}`}
                            onClick={() => setActiveType(type)}
                        >
                            {type}
                        </button>
                    ))}
                    <button className="tab" onClick={handleAddYear}>添加年份</button>
                    <button className="tab" onClick={handleAddPackagingType}>添加钢瓶类型</button>


                    <input type="file" className="tab" onChange={handleFileUpload} />


                    <button className="tab" onClick={()=>setCylinders([])}>
                        清空
                    </button>

                    <button className="tab" onClick={handleSave}>
                        保存
                    </button>

                </div>

            </div>
            <h2>本单位钢瓶</h2>
            {renderTable(true)}

            <h2>非本单位钢瓶</h2>
            {renderTable(false)}
        </div>
    );
};

export default CylinderPriceTable;
