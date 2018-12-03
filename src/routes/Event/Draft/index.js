import React, { Component,Fragment } from 'react';
import { Route, Redirect,routerRedux } from 'dva/router';
import { stringify } from 'qs';
import { Link } from 'dva/router';
import { Row, Col, Icon, Menu, Dropdown, Input, Table, Button, Modal } from 'antd';
import { connect } from 'dva';
import {injectIntl} from 'react-intl';
import styles from './style.less';
const Search = Input.Search;
const confirm = Modal.confirm;

class Draft extends Component {
    constructor(){
        super();
        this.state={
            selectedRowKeys: [],
            id:'',
            dataList:[],
            pageSize:15,
            page: {
              ItemsPerPage: 15,
              Page: 1,
              TotalPages: 1,
              TotalRecords: 0,
            }
        }
    }
    componentDidMount(){
      this.EventListByStatus()
    }

    EventListByStatus() {
      const {dispatch}=this.props;
      dispatch({
        type:'event/Efeventlist',
        payload: {
          'Filter': '1009001',
          'QueryClause': null,
          'OrderBy': '',
          'Page': 1,
          'ItemsPerPage': '15',
          'IsExport': false
        },    
        callback:(data,page)=>{
          this.setState({ dataList: data, page: page})
        }
      })
    }

    handleButtonClick(value){
      this.setState({
        id:value
      })
    }

    handleMenuClick = (key,data) => {
      const _this = this;
      const {dispatch} = _this.props;
      key=(key=='manage')?'manage':key.key;
      if(key == 'manage'){
        dispatch(routerRedux.push({
          pathname: '/createEvent/setUp/general',
          search:stringify({
            id: data,
            eventstatus:'1009001'
          })})
        );
      }
      if(key =='preview'){
        window.open('/#/userInterface/eventDetails?id='+_this.state.id)
      }
      if(key =='delete'){
        confirm({
          title:  this.props.intl.formatMessage({id:'event.message.deleteSure'}),
          okText: this.props.intl.formatMessage({id:'event.Confirm'}),
          cancelText:  this.props.intl.formatMessage({id:'event.Cancel'}),
          onOk() {
            dispatch({
              type: 'event/EventDelete',
              payload:{
                "EventId": _this.state.id
              }
            }).then(()=>{
              _this.EventListByStatus();
            });
          },
          onCancel() {},
        });
      }
    }
    
    render(){
        const {eventlistDate,intl}=this.props;
        const {dataList,page,pageSize}=this.state;
        const menu = (
          <Menu onClick={this.handleMenuClick}>
            <Menu.Item key='preview'>
             {intl.formatMessage({id:'event.table.preview'})}
            </Menu.Item>
            {/* <Menu.Item key='Duplicate'>
              {intl.formatMessage({id:'event.table.duplicate'})}
            </Menu.Item> */}
            <Menu.Item key='delete'>
               {intl.formatMessage({id:'event.table.delete'})}
            </Menu.Item>
          </Menu>
        );
      const columns = [{
          title: intl.formatMessage({id:'event.table.eventId'}),
          dataIndex: 'number',
          // render:title => console.log(title),
          // render: title => `${name.first} ${name.last}`,
          // sorter: (a, b) => a.name.length - b.name.length,
        },
        {
          title: intl.formatMessage({id:'event.table.eventTitle'}),
          dataIndex: 'title',
          render: (text, record) => (
            <a href={'/#/createEvent/setUp/general?id='+text.id+'&eventstatus=1009001'}>{text.title}</a>
          )
          // render:title => console.log(title),
          // render: title => `${name.first} ${name.last}`,
          // sorter: (a, b) => a.name.length - b.name.length,
        }, 
        {
          title:  intl.formatMessage({id:'event.table.location'}),
          dataIndex: 'location',
          // sorter: (a, b) => a.industry.length - b.industry.length,
        }, 
        {
          title:  intl.formatMessage({id:'event.table.startDate'}),
          dataIndex: 'start',
          // sorter: (a, b) => a.email.length - b.email.length,
        },
        {
          title:  intl.formatMessage({id:'event.table.creation'}),
          dataIndex: 'creation',
          // sorter: (a, b) => a.email.length - b.email.length,
        },
        {
          title:intl.formatMessage({id:'event.table.action'}),
          dataIndex: 'action',
          render: (text, record) => (
             <div>
              <Button className={styles.EditB} onClick={this.handleMenuClick.bind(this,'manage',text)}>
                <Icon type="form" theme="outlined"/>
              </Button> 
              <Dropdown overlay={menu} placement="bottomLeft" onClick={this.handleButtonClick.bind(this,text)} trigger={['click']}>
                <Button className={styles.DactionContent} style={{color:'#00a1de',marginLeft:10}} >
                  <Icon type="ellipsis"/>
                </Button>
              </Dropdown>
             </div>
          ),
        }];
        return(
            <div className={styles.main}>
               <div className={styles.Cheaders}>
                    Event
                    <div className={styles.CHRight}>
                        Event/Draft
                    </div>
               </div>
                <Row gutter={24} style={{padding:"24px 24px 0"}}>
                    <Col span={24} style={{textAlign:'left'}}>
                      <Link to="/event/create" className={styles.logo} key="logo">
                          <Button type="primary" icon="plus" style={{marginLeft:10}}>{intl.formatMessage({id:'event.createEvent'})}</Button>
                      </Link>
                      <Button type="primary" icon="download" onClick={this.showModal} style={{marginLeft:10}}></Button>
                    </Col>
                    <Col span={24}>
                         <Table columns={columns} dataSource={dataList} style={{marginTop:10}} 
                            pagination={{
                              onShowSizeChange: (current, pageSize) => {
                                const { dispatch } = this.props;
                                dispatch({
                                  type: "event/changePageSize",
                                  payload: pageSize,
                                  callback:data=>{
                                    this.setState({
                                      pageSize:data
                                    })
                                  }
                                })
                              },
                              onChange: (pageNumber) => {
                                const { dispatch } = this.props;
                                const {pageSize} = this.state
                                dispatch({
                                  type: 'event/Efeventlist',
                                  payload: {
                                    'Filter': '1009001',
                                    'QueryClause': null,
                                    'OrderBy': '',
                                    'Page': pageNumber,
                                    'ItemsPerPage': pageSize,
                                    'IsExport': false
                                  },
                                  callback: (data, page) => {
                                    this.setState({ dataList: data, page: page })
                                  }
                                })
                              },
                              //showSizeChanger: true,
                              pageSize: pageSize,
                              total: page.TotalRecords,
                            }}
                         />
                    </Col>
                </Row>
            </div>
        )
    }
}
export default connect(({ event = { }, loading }) => ({
}))(injectIntl(Draft)); 