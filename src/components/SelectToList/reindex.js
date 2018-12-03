import React, { PureComponent, Component } from 'react';
// import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { Input, Icon, AutoComplete,Select, Divider,Col,List } from 'antd';
import styles from './index.less';
const { Option, OptGroup } = Select;
export default class SelectToList extends PureComponent {
  // static propTypes = {
  //   splaceholder: PropTypes.string,
  //   selectData: PropTypes.array,
  //   listData: PropTypes.array,
    
  // };
  static defaultProps = {
    splaceholder: '',
    selectData: [],
    listData: [],
    hasChange:'',
  };
  constructor(props) {
    super(props);
    this.state = {
      selectData:props.selectData,
      listData:props.listData,
      splaceholder:props.splaceholder,
      hasChange:false,
    };
  }
  //push list remove select 

 SelectChange = (values,events) => {
     var Skey=events.key;
     var stitle=events.props.label; 
    
    // this.setState({
    //   selectData:newSelectData,
    //   listData:this.state.listData,
    //   hasChange:true,
    // })
    this.setState(()=>{
      var hastitle=false,newSelectData=this.state.selectData;
      newSelectData.forEach(element => {
       if(element.title==stitle){
         element.content.forEach((data,index) =>{
           if(Skey==data.id){
            element.content.splice(index,index);
           }
         })
       }
     })
      return{
        selectData:newSelectData,
        listData:this.state.listData,
        hasChange:true,
      };
    })
 }
  render() {
    var key='';
    return (
        <span>
          {this.state.hasChange?(<List
            size="small"
            header={<div>{this.state.splaceholder}</div>}
            renderItem={
              this.state.listData.map(element => 
                <div label={element.title} key={key}>
                        {element.content.map(data =>
                            <div key={data.id} value={data.value}>{data.value}</div>
                        )}
                </div>)
            }
          />):""}
          <Select  placeholder={this.state.splaceholder} onChange={this.SelectChange}>
           {
              this.state.selectData.map(element => 
                <OptGroup label={element.title} key={key}>
                        {element.content.map(data =>
                            <Option label={element.title} key={data.id} value={data.value}>{data.value}</Option>
                        )}
                </OptGroup>)
           }
          </Select>
        </span>
      );
  }
}
