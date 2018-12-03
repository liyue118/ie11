import React, { Component } from 'react';
import {Cascader,Input,Form} from 'antd';
import { connect } from 'dva';
import {injectIntl,formatMessage} from 'react-intl';
import styles from './index.less';
const FormItem=Form.Item;
@Form.create()
class CascaderAdress extends Component{
  constructor(props) {
    super(props);
    this.state={
        cascaderOptions:[],
        chooseData:''

    }
  }
  componentDidMount(props){
    const{dispatch}=this.props;
    dispatch({
        type:'common/AddressDropDownList',
        payload:{Country:"中国"},
        callback:data=>{
            console.log(data);
            this.setState({cascaderOptions:data})
        }
    })
  }
  onCascaderAdressChange = (value, selectedOptions) => {
    console.log(value,selectedOptions)
    
  }

  loadData = (selectedOptions) => {
    // console.log(selectedOptions);
    
  }
  InputChange=(value)=>{
    const lastValue=this.state.chooseData;
    lastValue.push(value);
  }
  render() {
      const {cascaderOptions}=this.state;
    return (
        <Cascader style={{width:'48%'}}
        options={cascaderOptions}
        loadData={this.loadData}
        defaultValue={['zhejiang', 'hangzhou', 'xihu']}
        onChange={this.onCascaderAdressChange}
        changeOnSelect/>
    );
  }
}
export default connect(({common = {}, loading }) => ({
    cascaderOptions:common.cascaderOptions
}))(injectIntl(CascaderAdress)); 