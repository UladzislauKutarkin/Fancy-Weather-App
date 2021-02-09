import React, {useEffect, useState, Fragment} from 'react'
import {useTranslation} from "react-i18next";
import './component-styles.css'
import refreshVector from '../assets/img/Vector.png'
import SpeechRecognition, {useSpeechRecognition} from "react-speech-recognition";
import microphone from '../assets/img/microphone.png'
import WeatherCard from "./WeatherCard";
import {API_BASE_URL, API_KEY} from "../apis/config";
import MainCard from "./MainCard";
import MapWrapper from "./MapWrapper";



export default (props) => {
    const [query, setQuery] = useState("");
    const [weather, setWeather] = useState({});
    const [degreeType, setDegreeType] = useState('imperial');
    const [language, setLanguage] = useState("en");
    const [city, setCity] = useState("Vitebsk")
    useEffect(() => {
        fetch(`${API_BASE_URL}q=Vitebsk&units=${degreeType}&APPID=${API_KEY}`)
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
    let controller = new AbortController();
    setTimeout(() => controller.abort(), 1000);

    function searchHandler() {
        if (finalTranscript !== '') {
            fetch(`${API_BASE_URL}q=${query}&units=${degreeType}&APPID=${API_KEY}`, {
                signal: controller.signal
            })
                .then((res) => res.json())
                .then((result) => {
                    setQuery("");
                    const dailyData = result.list.filter(reading => reading.dt_txt.includes("18:00:00"))
                    setWeather(dailyData);
                    const currentCity = result.city.name;
                    setCity(currentCity);
                })
                .catch(e => {
                    console.warn(`Fetch 2 error: ${e.message}`)
                    alert('Не корректно указан город')
                })}
                else {
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
                    })
                    .catch(e => {
                        console.warn(`Fetch 2 error: ${e.message}`)
                        alert('Не корректно указан город')})

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
            props.onChangeBg()

        }
    }

    function chooseDegreeHandlerF(event) {
        let Fbtn = document.querySelector('.F')
        let Cbtn = document.querySelector('.C')
        if(Fbtn.classList.contains('active-degree')){
            Fbtn.classList.remove('active-degree')
        } else {
            Fbtn.classList.add('active-degree')
            setDegreeType('imperial')
            Cbtn.classList.remove('active-degree')
        }
    }
    function chooseDegreeHandlerC(event) {
        let Cbtn = document.querySelector('.C')
        let Fbtn = document.querySelector('.F')
        if(Cbtn.classList.contains('active-degree')){
            Cbtn.classList.remove('active-degree')
        } else {
            Cbtn.classList.add('active-degree')
            setDegreeType('metric')
            Fbtn.classList.remove('active-degree')
        }
    }



    function chooseLanguageHandlerRu(event) {
        let actives = document.getElementsByClassName('active');
        let currentActive = actives[0];
        if (currentActive){
            currentActive.classList.remove("active");}
        setLanguage('ru')
        props.onChangeLanguage('ru')
        event.target.classList.toggle('active')
    }

    function chooseLanguageHandlerEn(event) {
        let actives = document.getElementsByClassName('active');
        let currentActive = actives[0];
        if (currentActive){
            currentActive.classList.remove("active");}
        setLanguage('en')
        props.onChangeLanguage('en')
        event.target.classList.toggle('active')

    }

    const {t, i18n} = useTranslation();

    return (
        <Fragment>
            <div className="headerWrapper">
                <div className="refreshButton btn" onClick={refreshHandler}>
                    <img src={refreshVector}
                         alt="refresh button vector"
                         className="refresh-Button-Vector"
                    />
                </div>
                <div className="headerElementsWrapper">
                    <div onClick={chooseLanguageHandlerEn} className='languageBtn active btn'>En</div>
                    <div onClick={chooseLanguageHandlerRu} className='languageBtn btn'>Ru</div>
                </div>
                <div className="headerElementsWrapper">
                    <div className='degreeButtons active-degree F btn' onClick={chooseDegreeHandlerF}>°F</div>
                    <div className='degreeButtons C btn' onClick={chooseDegreeHandlerC}>°С</div>
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
                    <img className='microphone btn' src={microphone}
                         alt='microphone'
                         onClick={listenContinuously}
                         onDoubleClick={SpeechRecognition.stopListening}
                    />
                    <div className="searchBtn btn"
                         onClick={searchHandler}
                    >
                        {t("search")}
                    </div>
                </form>
            </div>
            <div className='WrapperMaps'>
            <div className="mainDayCard">
                {weather[0] && <MainCard weather={weather[0]}
                                            degree={degreeType}
                                            language={language}
                                            city={city}
                />}
            </div>
                <MapWrapper/>
            </div>
            <div className='otherDayWrapper'>
            <div className="otherDayCard">
                {weather[0] && <WeatherCard weather={weather[1]}
                                            degree={degreeType}
                                            language={language}
                />}
            </div>
            <div className="otherDayCard">
                {weather[1] && <WeatherCard weather={weather[2]}
                                            degree={degreeType}
                                            language={language}
                />}
            </div>
            <div className="otherDayCard">
                {weather[2] && <WeatherCard weather={weather[3]}
                                            degree={degreeType}
                                            language={language}
                />}
            </div>
            <div className="otherDayCard">
                {weather[3] && <WeatherCard weather={weather[4]}
                                            degree={degreeType}
                                            language={language}
                />}
            </div>
            </div>

        </Fragment>
    )
}