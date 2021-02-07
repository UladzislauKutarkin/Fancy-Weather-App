import React from 'react';
import { useState, useEffect } from 'react';
import { useTranslation } from "react-i18next";

const MainCard = (props) => {
    const [date, setDate] = useState(new Date());
    const { t, i18n } = useTranslation();
    useEffect(() => {
        let timerID = setInterval( () => tick(), 1000 );

        return function cleanup() {
            clearInterval(timerID);
        };
    });
    function tick() {
        setDate(new Date());
    }
    function FormatType(value, metric) {
        if (metric==='metric') {
            return Math.floor(value) + '°C'
        } else {
            return Math.floor(Math.trunc(value * 1.8 +32) )+ '°F'
        }
    }
    const imgURL = "owf owf-"+ props.weather.weather[0].id +" owf-5x icon-style"
    const ms = props.weather.dt * 1000;
    const weekdayName = new Date(ms).toLocaleString(props.language, {weekday: 'long'});

    return (
            <div>
                <div className="mainCarTitile">{props.city}</div>
                <div className="mainCardDayTimeAndName">
                    <div className="mainCardDay">{weekdayName}</div>
                    <div className="mainCardTime">{date.toLocaleTimeString()}</div>
                </div>
                <div className="mainCardDayTimeAndName">
                    <div className="mainCardDayDegrees">{FormatType(props.weather.main.temp, props.degree)}</div>
                    <i className={imgURL}/>
                </div>
                <div className='weatherDiscriptionWrapper'>
                    <div className="weatherDiscriptionRow">
                        <div className="weatherDiscriptionRow-item">
                            {`${t("feels-like")}:  ${Math.floor((props.weather.main.feels_like))}°`}
                        </div>
                        <div>{`${t("wind")}:  ${Math.floor((props.weather.wind.speed))} m/s`}</div>
                    </div>
                    <div className="weatherDiscriptionRow">
                        <div>
                            {`${t("Humidity")}:  ${Math.floor((props.weather.main.humidity))}%`}
                        </div>
                    </div>
                </div>
        </div>
    );
};

export default MainCard;