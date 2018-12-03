import React, { Component } from 'react';
import { Map } from 'react-amap';
import {Input} from 'antd';
import styles from './index.less';
class PoiPicker extends React.Component {
  constructor() {
    super();
    this.loadUI();
    
  }
  state={
    _poiResult : []
  }
  handleValue = (e) =>{
    const _this = this; 
      if(this.state._poiResult == undefined || this.state._poiResult.length<1){
       
      }else{
        _this.props.changeForm(this.state._poiResult);
      }
  }
  loadUI() {
    window.AMapUI.loadUI(['misc/PoiPicker'], (PoiPicker) => {
        var poiPicker = new PoiPicker({
            //city:'北京',
            input: 'pickerInput'
        });

        //初始化poiPicker
        this.poiPickerReady(poiPicker);
    })
  }

  poiPickerReady(poiPicker) {
    const map = this.props.__map__;
    const _this = this; 
    window.poiPicker = poiPicker;

    var marker = new AMap.Marker();

    var infoWindow = new AMap.InfoWindow({
        offset: new AMap.Pixel(0, -20)
    });

    //选取了某个POI
    poiPicker.on('poiPicked', function(poiResult) {
        
        var source = poiResult.source,
            poi = poiResult.item,
            info = {
                source: source,
                id: poi.id,
                name: poi.name,
                location: poi.location.toString(),
                address: poi.address
            };

        marker.setMap(map);
        //infoWindow.setMap(map);

        marker.setPosition(poi.location);
        //infoWindow.setPosition(poi.location);

        //infoWindow.setContent('POI信息: <pre>' + JSON.stringify(info, null, 2) + '</pre>');
        infoWindow.open(map, marker.getPosition());

        map.setCenter(marker.getPosition());
        _this.setState({
            _poiResult : poiResult
        },()=>{
            _this.handleValue()
        })
        poiPicker.onCityReady(function() {
            poiPicker.suggest('')
            poiPicker.searchByKeyword(poiResult.item.name);
        });
        
    })
  }

  render() {
    return(
        <div>
        <div id={styles.container} className="map" id="container"></div>
        <div id={styles.pickerBox}>
            <Input id={styles.pickerInput} id="pickerInput" placeholder="输入关键字选取地点" onChange={this.handleValue}/>
            <div id={styles.poiInfo}></div>
        </div>
        </div>
    )
  }
}

export default PoiPicker;