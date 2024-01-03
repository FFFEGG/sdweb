import React, { useEffect, useState } from 'react';
import LunarCalendar from 'lunar-calendar';

const LastLunarHolidays = () => {
    const [LastLunarHolidays, setLastLunarHolidays] = useState([]);

    useEffect(() => {
        const getLastLunarHolidays = () => {
            const holidays = [
                { name: '春节（农历新年）', month: 1, day: 1 },
                { name: '元宵节（上元节、正月十五）', month: 1, day: 15 },
                { name: '端午节（农历五月初五）', month: 5, day: 5 },
                { name: '七夕节（农历七月初七）', month: 7, day: 7 },
                { name: '中秋节（农历八月十五）', month: 8, day: 15 },
                // { name: '重阳节（农历九月初九）', month: 9, day: 9 },
                { name: '三月三', month: 3, day: 3 },
                { name: '中元节', month: 7, day: 15 },
                // 添加其他农历节假日
            ];

            const thisYear = new Date().getFullYear();
            // 去年
            const LastYear = thisYear - 1;

            const LastLunarHolidays = holidays.map((holiday) => {
                const solarDate = LunarCalendar.lunarToSolar(LastYear, holiday.month, holiday.day);
                return {
                    name: holiday.name,
                    date: `${solarDate.year}-${solarDate.month}-${solarDate.day}`,
                };
            });

            setLastLunarHolidays(LastLunarHolidays);
        };

        getLastLunarHolidays();
    }, []);

    return (
        <div>
            <h1>去年农历节假日</h1>
            <ul>
                {LastLunarHolidays.map((holiday, index) => (
                    <li key={index}>
                        {holiday.name}：{holiday.date}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default LastLunarHolidays;
