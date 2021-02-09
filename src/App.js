import React, { useState } from 'react'
import { useTranslation } from "react-i18next";
import Header from "./Components/Header";
import '../src/Components/component-styles.css'
import bg1 from '../src/assets/img/rainbow-weather.jpg'
import bg2 from '../src/assets/img/snow.jpg'
import bg3 from '../src/assets/img/Weather_Seasons.__72 DPI.jpg'


function App() {
    const [bg, setBg] = useState('0')
    const { t, i18n } = useTranslation();
    function backgroundScheduler_1() {
        setTimeout(() => {
            document.querySelector(".img1").style.opacity = 0;
            document.querySelector(".img2").style.opacity = 1;
            document.querySelector(".img3").style.opacity = 1;
            order(["-3", "-1", "-2"]);
        }, 100);
    }

    function backgroundScheduler_2() {
        setTimeout(() => {
            document.querySelector(".img1").style.opacity = 1;
            document.querySelector(".img2").style.opacity = 0;
            document.querySelector(".img3").style.opacity = 1;
            order(["-2", "-3", "-1"]);
        }, 100);
    }

    function backgroundScheduler_3() {
        setTimeout(() => {
            document.querySelector(".img1").style.opacity = 1;
            document.querySelector(".img2").style.opacity = 1;
            document.querySelector(".img3").style.opacity = 0;
            order(["-1", "-2", "-3"]);
        }, 100);
    }

    function order(array, time) {
        setTimeout(() => {
            document.querySelector(".img1").style.zIndex = array[0];
            document.querySelector(".img2").style.zIndex = array[1];
            document.querySelector(".img3").style.zIndex = array[2];
        }, time);
    }

    function changeBgHandler (){
        if (bg==='0') {
            setBg('1')
            backgroundScheduler_1()
        } else if (bg==='1') {
            setBg('2')
            backgroundScheduler_2()
        } else {
            setBg('0')
            backgroundScheduler_3()
        }
    }

    const changeLanguage = (language) => {
        i18n.changeLanguage(language);
    };
  return (
      <div className='wrapper' >
          <img className="bg img1" src={bg1}/>
          <img className="bg img2" src={bg2}/>
          <img className="bg img3" src={bg3}/>
        <Header onChangeLanguage={changeLanguage}
                onChangeBg={changeBgHandler}
        />
      </div>
  );
}

export default App;
