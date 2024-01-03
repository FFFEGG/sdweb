import React, { Component } from 'react';
import axios from 'axios';

class WeatherTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            loading: true,
            error: null
        };
    }

    componentDidMount() {
        const url = 'http://lishi.tianqi.com/nanning/202111.html';
        axios.get(url)
            .then(response => {
                const data = response.data;
                this.setState({
                    data: data,
                    loading: false,
                    error: null
                });
            })
            .catch(error => {
                this.setState({
                    data: [],
                    loading: false,
                    error: error
                });
            });
    }

    render() {
        const { data, loading, error } = this.state;

        if (loading) {
            return <p>Loading...</p>;
        }

        if (error) {
            return <p>Error: {error.message}</p>;
        }

        return (
            <table>
                <thead>
                <tr>
                    <th>日期</th>
                    <th>最高温度</th>
                    <th>最低温度</th>
                    <th>天气状况</th>
                </tr>
                </thead>
                <tbody>
                {data.map((rowData, index) => (
                    <tr key={index}>
                        {rowData.map((cellData, cellIndex) => (
                            <td key={cellIndex}>{cellData}</td>
                        ))}
                    </tr>
                ))}
                </tbody>
            </table>
        );
    }
}

export default WeatherTable;
