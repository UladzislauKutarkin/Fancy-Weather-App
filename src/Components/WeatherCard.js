import React from 'react';

const WeatherCard = (props) => {
    const imgURL = "owf owf-"+ props.weather.weather[0].id +" owf-4x icon-style"
    const ms = props.weather.dt * 1000;
    const weekdayName = new Date(ms).toLocaleString(props.language, {weekday: 'long'});


    function FormatType(value, metric) {
        if (metric==='metric') {
            return Math.floor(value) + '°C'
        } else {
            return Math.floor(Math.trunc(value * 1.8 +32) )+ '°F'
        }
        this.value=0;
    }
    return (
        <div style={{width: '18rem'}}>
            <div>
                <div>{weekdayName}</div>
                <div>{FormatType(props.weather.main.temp,props.degree)}</div>
                <i className={imgURL}/>
            </div>
        </div>
    );
};

export default WeatherCard;