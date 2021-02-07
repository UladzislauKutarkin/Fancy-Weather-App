import React, { Component } from 'react'
import MapGoogle from "./MapGoogle";
import '../Components/component-styles.css'





class MapWrapper extends Component {

    render() {
        return (

            <div className='mapWrapper'>
                <MapGoogle/>
            </div>
        )
    }
}

export default MapWrapper