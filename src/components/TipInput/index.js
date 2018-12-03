import React, { Component } from 'react';
import { Map } from 'react-amap';

class TipInput extends React.Component {
    constructor(){
        super()
        this.loadUI();
        
    }
    loadUI(){
        window.AMapUI.loadUI(['misc/PoiPicker'], (PoiPicker) => {
            var poiPicker = new PoiPicker({
                //city:'北京',
                input: 'pickerInput'
            });
    
            //初始化poiPicker
            this.poiPickerReady(poiPicker);
        })
        console.log(this.props);
        const map = this.props.__map__;
        const map1 = new AMap.Map("container", {
            resizeEnable: true
        });
        //输入提示
        const auto = new AMap.Autocomplete({
            input: "tipinput"
        });
        map1.setMap(map);
        auto.setMap(map);
    }
    render() {
        return(
            <div>
            <div id="container" className="map"></div>
            <input id="tipinput"/>
            </div>
        )
    }
}

export default TipInput;