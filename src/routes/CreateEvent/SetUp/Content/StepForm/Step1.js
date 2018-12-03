import React, { Component } from 'react';
import { Row,Col,Button,Card} from 'antd';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import E from 'wangeditor';
import styles from './style.less';
import { injectIntl } from 'react-intl';
import {getPageQuery} from '../../../../../utils/utils';
import { json } from 'graphlib';
@connect(({ eventSummaryDetails, loading }) => ({
  eventSummaryDetails,
  submitting: loading.effects['eventSummaryDetails/getEventSummaryDetails'],
}))
@connect(({ eventSummaryAddition, loading }) => ({
  eventSummaryAddition,
  submitting: loading.effects['eventSummaryAddition/getEventSummaryAddition'],
}))
class Step1 extends Component{
  constructor(props, context) {
    super(props, context);
    this.state = {
      editorContent: '',
    }
  }
  componentDidMount(){
    const elem = this.refs.editorElem
    const editor = new E(elem)
    editor.customConfig.menus = [
      'head',  // 标题
      'fontSize',  // 字号
      'fontName',  // 字体
      'strikeThrough',  // 删除线
      'link',  // 插入链接
      'list',  // 列表
      'justify',  // 对齐方式
      //'quote',  // 引用
      'bold',  // 粗体
      'italic',  // 斜体
      'underline',  // 下划线
      'undo',  // 撤销
    ]
    editor.customConfig.fontNames = [
      '宋体',
      '微软雅黑',
      'Arial',
      'Tahoma',
      'Verdana'
    ]
    editor.customConfig.linkCheck = function (text, link) {
      console.log(text) // 插入的文字
      console.log(link) // 插入的链接
  
      return true // 返回 true 表示校验成功
      // return '验证失败' // 返回字符串，即校验失败的提示信息
    }
    editor.customConfig.pasteIgnoreImg = true
    // 使用 onchange 函数监听内容的变化，并实时更新到 state 中
    editor.customConfig.onchange = html => {
      //var json = editor.txt.getJSON()  // 获取 JSON 格式的内容
      //var jsonStr = JSON.stringify(json)
      this.setState({
        editorContent: html
      })
    }
    
    editor.create();
    editor.txt.html('')

    
    this.props.dispatch({
      type: 'eventSummaryDetails/getEventSummaryDetails',
      payload: {
        EventId:getPageQuery(location.search).id
      },
    })
    .then(()=>{
      const {eventSummaryDetails:{eventSummaryDetails}} = this.props;
      {eventSummaryDetails.ContentSummary!==null || typeof(eventSummaryDetails)!==String?(
        editor.txt.html(eventSummaryDetails.ContentSummary)
      ):('')}
      this.setState({
        editorContent:eventSummaryDetails.ContentSummary
      })
    })
  }
    render(){
        const {location,intl} =this.props;
        const {eventSummaryAddition,eventSummaryDetails:{eventSummaryDetails}} = this.props;
        const onValidateForm = () => {
          this.props.dispatch({
            type: 'eventSummaryAddition/getEventSummaryAddition',
            payload: {
                EventId:getPageQuery(location.search).id,
                ContentSummary:this.state.editorContent
            }
          })
          .then(()=>{
            this.props.dispatch(
              routerRedux.push({
                pathname: '/createEvent/setUp/content/step-form/speakers',
                search:location.search
              })
            )
          })
          
        }
        return(
          <Row gutter={24}>
          <Col xl={24} lg={24} md={24} sm={24} xs={24}>
              <div ref="editorElem" style={{textAlign: 'left',padding:24}}>
              </div>  
          </Col>
          <Col xl={24} lg={24} md={24} sm={24} xs={24}>
              <div style={{position:'relative',height:'30px'}}>
                <Button onClick={onValidateForm} className={styles.saveButton}>
                  {intl.formatMessage({id:'event.content.Save'})}
                </Button> 
              </div>
          </Col>     
      </Row>        
        )
    }
}
export default connect()(injectIntl(Step1));