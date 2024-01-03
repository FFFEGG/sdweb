import React, { Component } from 'react';
import qishou from 'assets/images/icons/qishou.png'
class BaiduMap extends Component {
    // couriers = [
    //     {
    //         id: 1,
    //         name: '张三',
    //         phone: '12345678901',
    //         status: '配送中',
    //         position: { lng: 108.35449, lat: 22.820598 },
    //     },
    //     {
    //         id: 2,
    //         name: '李四',
    //         phone: '12345678902',
    //         status: '空闲中',
    //         position: { lng: 108.353717, lat: 22.817716 },
    //     },
    //     {
    //         id: 2,
    //         name: '李四',
    //         phone: '12345678902',
    //         status: '空闲中',
    //         position: { lng: 108.379939, lat: 22.836661 },
    //     },
    //     {
    //         id: 2,
    //         name: '李四',
    //         phone: '12345678902',
    //         status: '空闲中',
    //         position: { lng: 108.280191, lat: 22.78809 },
    //     },
    //     // 添加更多配送员数据...
    // ];

    componentDidMount() {
        this.initMap(this.props.WorkDepdeliverymanList);
    }

    initMap(couriers) {
        const { BMap } = window;
        const map = new BMap.Map('map-container');
        const centerPoint = new BMap.Point(couriers[0].position.longitude, couriers[0].position.latitude); // 北京坐标
        map.centerAndZoom(centerPoint, 13);
        map.enableScrollWheelZoom(true);

        // 为每个配送员添加自定义标注
        couriers.forEach((courier) => {
            const point = new BMap.Point(courier.position.longitude, courier.position.latitude);
            this.addCustomMarker(map, point, courier);
        });
    }

    createInfoWindow(courierInfo) {
        const { BMap } = window;
        const content = `
            <div>
              <h4>配送员信息</h4>
              <p>姓名：${courierInfo.name}</p>
              <p>时间：${courierInfo.lasttime}</p>
              <p>工作部门：${courierInfo.workdepartment}</p>
            </div>
          `;
        return new BMap.InfoWindow(content, {
            width: 250, // 信息窗口宽度

            title: '', // 信息窗口标题
        });
    }

    addCustomMarker(map, point, courier) {
        const { BMap } = window;
        const marker = new BMap.Marker(point);

        // 自定义标注的样式
        const icon = new BMap.Icon(qishou, new BMap.Size(30, 30));
        marker.setIcon(icon);

        // 创建信息窗口对象
        const infoWindow = this.createInfoWindow(courier);

        // 给标注添加点击事件
        marker.addEventListener('click', () => {
            map.openInfoWindow(infoWindow, point);
        });

        map.addOverlay(marker);
    }



    render() {
        return (
            <div id="map-container" style={{ width: '100%', height: '800px' }}></div>
        );
    }
}

export default BaiduMap;
