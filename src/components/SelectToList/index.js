import React, { PureComponent, Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { Input, Icon, AutoComplete,Select, Divider,Col,List,Avatar} from 'antd';
import styles from './index.less';
const { Option, OptGroup } = Select;
var newSelectData=[],hasSelect=true;
var Skey=0,nowValue='';
export default class SelectToList extends PureComponent {
  static propTypes = {
    splaceholder: PropTypes.string,
    selectData: PropTypes.array,
    listData: PropTypes.array,
    noTitle:PropTypes.bool
  };
  static defaultProps = {
    splaceholder: '',
    selectData: [],
    listData: [],
    hasChange:'',
    noTitle:false,
    hasAvt:false
  };
  constructor(props) {
    super(props);
    newSelectData=[{'select':props.selectData,'list':props.listData}];
    console.log(props.noTitle);
    this.state = {
      hasChange:(props.listData.length>0)?true:false,
      splaceholder:props.splaceholder,
      value:'1',
      hasListCount:false,
      noTitle:props.noTitle

    };
  }
  SelectChange=(values,events)=>{
        var stitle=events.props.label;
        var key=events.key.substr(2,1);
        nowValue=values;
        newSelectData[0].select.forEach(element => {
        if(element.title==stitle){
          if(element.content.length>1){
            element.content.splice(element.content.findIndex(item => item.value === values), 1);
          }else{
            newSelectData[0].select.splice(newSelectData[0].select.findIndex(item => item.title === stitle), 1);
          }
        }
      })
      newSelectData[0].select.length===0?(hasSelect=true):hasSelect=false;
      var isFind=false;
      newSelectData[0].list.findIndex((item)=>{
        if(item.title==stitle){
          item.content.push({'id':key,'value':values});
          isFind=true;
        }
      },1)
      if(!isFind)(newSelectData[0].list.push({'title':stitle,content:[{'id':key,'value':values}]}));
      this.props.testF(newSelectData[0].list);
      this.setState({
        value:values,
        hasChange:true
      })
  }
  ListDelete=(values,stitle,event)=>{
    var statech=true;
    newSelectData[0].list.forEach(element => {
      if(element.title==stitle){
        if(element.content.length>1){
          element.content.splice(element.content.findIndex(item => item.value === values), 1);
        }else{
          newSelectData[0].list.splice(newSelectData[0].list.findIndex(item => item.title === stitle), 1);
        }
      }
    })
    newSelectData[0].list.length<1?(statech=false):'';
    var isFind=false;
      newSelectData[0].select.findIndex((item)=>{
        if(item.title==stitle){
          item.content.push({'id':item.id,'value':values});
          isFind=true;
        }
      },1)
    if(!isFind)(newSelectData[0].select.push({'title':stitle,content:[{'id':1,'value':values}]}));
    this.props.testF(newSelectData[0].list);
    (values==nowValue)?(nowValue='samevalue'):(nowValue=values);
     this.setState({
      value:nowValue,
      hasChange:statech
    })
  }
  render(){
    var key='';
    var listkey=0;
    return(
      <div style={{marginTop:3,width:'100%'}}>
            {this.state.hasChange?(
              <div style={{marginBottom:10}} >
                <span className={this.state.noTitle?styles.listHeaderHide:''}><div className={styles.listHeader}>{this.state.splaceholder}</div></span>
                {newSelectData[0].list.map(element=>
                  <div key={'E'+element.id}>
                  {/* <div className={styles.listTitle}>{element.title}({element.content.length})</div> */}
                    <ul className={styles.listCh}>  
                    {element.content.map(data =>
                      <li key={'D'+data.id}>{this.props.hasAvt?(<Avatar shape="square" icon="user" />):null}{data.value}<Icon type="close" className={styles.delete} onClick={this.ListDelete.bind(this,data.value,element.title)}/></li>
                    )}
                    </ul>
                  </div>
                )} 
                </div>):''}
            <Select placeholder={this.state.splaceholder} onChange={this.SelectChange} value={undefined}>
            {
                newSelectData[0].select.map(element => 
                  <OptGroup label={element.title} key={'OPG'+element.id}>
                          {element.content.map(data =>
                              <Option label={element.title} key={'OP'+data.id} value={data.value}>{this.props.hasAvt?(<Avatar shape="square"  icon="user" />):null} {data.value}</Option>
                          )}
                  </OptGroup>)
            }</Select>
       </div>
    )
  }
}