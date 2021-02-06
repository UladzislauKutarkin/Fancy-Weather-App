import React from 'react'
import { useTranslation } from "react-i18next";
import Header from "./Components/Header";
import '../src/Components/component-styles.css'


function App() {

    const { t, i18n } = useTranslation();

    const changeLanguage = (language) => {
        i18n.changeLanguage(language);
    };
  return (
      <div className='wrapper'>
        <Header onChangeLanguage={changeLanguage}/>
      </div>
  );
}

export default App;
