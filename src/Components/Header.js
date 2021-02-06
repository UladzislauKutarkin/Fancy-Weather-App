import React, {useEffect, useState, Fragment} from 'react'
import {useTranslation} from "react-i18next";
import './component-styles.css'
import refreshVector from '../assets/img/Vector.png'
import SpeechRecognition, {useSpeechRecognition} from "react-speech-recognition";
import microphone from '../assets/img/microphone.png'
import WeatherCard from "./WeatherCard";
import {API_BASE_URL, API_KEY} from "../apis/config";
import MainCard from "./MainCard";



export default (props) => {
    const [query, setQuery] = useState("");
    const [weather, setWeather] = useState({});
    const [degreeType, setDegreeType] = useState('imperial');
    const [language, setLanguage] = useState("en");
    const [city, setCity] = useState("Minsk")
    useEffect(() => {
        fetch(`${API_BASE_URL}q=Minsk&units=${degreeType}&APPID=${API_KEY}`)
            .then((res) => res.json())
            .then((result) => {
                const dailyData = result.list.filter(reading => reading.dt_txt.includes("18:00:00"))
                const currentCity = result.city.name;
                setCity(currentCity)
                setWeather(dailyData);
            })
    }, []);

    const search = (e) => {
        if (e.key === "Enter") {
            e.preventDefault()
            searchHandler()
        }
    };
    const {
        transcript,
        interimTranscript,
        finalTranscript,
        resetTranscript,
        listening,
    } = useSpeechRecognition();
    useEffect(() => {
        if (finalTranscript !== '') {
            console.log('Got final result:', finalTranscript);
        }
    }, [interimTranscript, finalTranscript]);
    if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
        return null;
    }

    if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
        console.log('Your browser does not support speech recognition software! Try Chrome desktop, maybe?');
    }
    const listenContinuously = () => {
        SpeechRecognition.startListening({
            continuous: true,
            language: 'en-GB',
        });
    };

    function searchHandler() {
        if (finalTranscript !== '') {
            fetch(`${API_BASE_URL}q=${query}&units=${degreeType}&APPID=${API_KEY}`)
                .then((res) => res.json())
                .then((result) => {
                    setQuery("");
                    const dailyData = result.list.filter(reading => reading.dt_txt.includes("18:00:00"))
                    setWeather(dailyData);
                    const currentCity = result.city.name;
                    setCity(currentCity);
                })
        } else {
            if (query === '') {
                alert('Введите город для поиска')
            } else {
                setQuery('')
                fetch(`${API_BASE_URL}q=${query}&units=${degreeType}&APPID=${API_KEY}`)
                    .then((res) => res.json())
                    .then((result) => {
                        setQuery("");
                        const dailyData = result.list.filter(reading => reading.dt_txt.includes("18:00:00"))
                        setWeather(dailyData);
                        const currentCity = result.city.name;
                        setCity(currentCity)
                        console.log(dailyData);
                    });
            }
        }
    }


    function changeValueHandler(event) {
        if (finalTranscript === '') {
            setQuery(event.target.value)
        } else {
            setQuery(transcript)
        }
    }

    function refreshHandler() {
        let vector = document.querySelector('.refresh-Button-Vector')
        if (vector.classList.contains('rotated')) {
            vector.classList.remove('rotated')
        } else {
            vector.classList.add('rotated')
        }
    }

    function chooseDegreeHandler(event) {
        let actives = document.getElementsByClassName('active-degree');
        let currentActive = actives[0];
        if (currentActive)
            currentActive.classList.remove("active-degree");
        event.target.classList.toggle('active-degree')
        if (degreeType === 'imp') {
            setDegreeType('metric')
        } else {
            setDegreeType('imp')
        }
    }

    function chooseLanguageHandlerRu(event) {
        let actives = document.getElementsByClassName('active');
        let currentActive = actives[0];
        if (currentActive)
            currentActive.classList.remove("active");
        props.onChangeLanguage('ru')
        event.target.classList.toggle('active')
        setLanguage('ru')
    }

    function chooseLanguageHandlerEn(event) {
        let actives = document.getElementsByClassName('active');
        let currentActive = actives[0];
        if (currentActive)
            currentActive.classList.remove("active");
        props.onChangeLanguage('en')
        event.target.classList.toggle('active')
        setLanguage('en')
    }

    const {t, i18n} = useTranslation();

    return (
        <Fragment>
            <div className="headerWrapper">
                <div className="refreshButton" onClick={refreshHandler}>
                    <img src={refreshVector}
                         alt="refresh button vector"
                         className="refresh-Button-Vector"
                    />
                </div>
                <div className="headerElementsWrapper">
                    <div onClick={chooseLanguageHandlerEn} className='languageBtn active'>En</div>
                    <div onClick={chooseLanguageHandlerRu} className='languageBtn'>Ru</div>
                </div>
                <div className="headerElementsWrapper">
                    <div className='degreeButtons active-degree' onClick={chooseDegreeHandler}>°F</div>
                    <div className='degreeButtons' onClick={chooseDegreeHandler}>°С</div>
                </div>
                <form className='searchFormWrapper'
                      onKeyDown={search}
                >
                    <input className='input-value'
                           type="text"
                           placeholder={t("placeholder")}
                           onChange={changeValueHandler}
                           value={query}
                    />
                    <img className='microphone' src={microphone}
                         alt='microphone'
                         onClick={listenContinuously}
                         onDoubleClick={SpeechRecognition.stopListening}
                    />
                    <div className="searchBtn"
                         onClick={searchHandler}
                    >
                        {t("search")}
                    </div>
                </form>
            </div>
            <div className="mainDayCard">
                {weather[0] && <MainCard weather={weather[0]}
                                            degree={degreeType}
                                            language={language}
                                            city={city}
                />}
            </div>
            <div>
                {weather[0] && <WeatherCard weather={weather[1]}
                                            degree={degreeType}
                                            language={language}
                />}
            </div>
            <div>
                {weather[1] && <WeatherCard weather={weather[2]}
                                            degree={degreeType}
                                            language={language}
                />}
            </div>
            <div>
                {weather[2] && <WeatherCard weather={weather[3]}
                                            degree={degreeType}
                                            language={language}
                />}
            </div>
            <div>
                {weather[3] && <WeatherCard weather={weather[4]}
                                            degree={degreeType}
                                            language={language}
                />}
            </div>
        </Fragment>
    )
}