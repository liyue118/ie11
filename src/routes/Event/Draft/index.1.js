import React, { Component,Fragment } from 'react';
import { Route, Redirect, Switch } from 'dva/router';
import { Link } from 'dva/router';
import { Row, Col ,Card,Icon,Steps, Menu, Dropdown,Input,Table,Divider ,Button,Tooltip,Modal,List,Select } from 'antd';
import { getRoutes } from '../../../utils/utils';
import styles from './style.less';
const { Option, OptGroup } = Select;
const Search = Input.Search;
const { Column, ColumnGroup } = Table;
const { Step } = Steps;
const data = [{
    key: '1',
    titile: '税收优惠机遇与风险研讨会',
    location: 'BeiJing',
    Startdate: '2018/07/25',
    totalattendees: 'A',
    checkedattendees: 'B',
  },{
    key: '2',
    titile: '税收优惠机遇与风险研讨会',
    location: 'BeiJing',
    Startdate: '2018/07/25',
    totalattendees: 'A',
    checkedattendees: 'B',
  },{
    key: '3',
    titile: '税收优惠机遇与风险研讨会',
    location: 'BeiJing',
    Startdate: '2018/07/25',
    totalattendees: 'A',
    checkedattendees: 'B',
  },{
    key: '4',
    titile: '税收优惠机遇与风险研讨会',
    location: 'BeiJing',
    Startdate: '2018/07/25',
    totalattendees: 'A',
    checkedattendees: 'B',
  },{
    key: '5',
    titile: '税收优惠机遇与风险研讨会',
    location: 'BeiJing',
    Startdate: '2018/07/25',
    totalattendees: 'A',
    checkedattendees: 'B',
  },{
    key: '6',
    titile: '税收优惠机遇与风险研讨会',
    location: 'BeiJing',
    Startdate: '2018/07/25',
    totalattendees: 'A',
    checkedattendees: 'B',
  }];

const menu = (
    <Menu>
      <Menu.Item key="0">
        <a>New York</a>
      </Menu.Item>
      <Menu.Item key="1">
        <a>London</a>
      </Menu.Item>
      {/* <Menu.Divider /> */}
      <Menu.Item key="3">BeiJing</Menu.Item>
    </Menu>
  );

  const menu1 = (
    <Menu>
      <Menu.Item key="0">
        <a>Delete</a>
      </Menu.Item>
      <Menu.Item key="1">
        <a>Manage</a>
      </Menu.Item>
      {/* <Menu.Divider /> */}
      <Menu.Item key="3">Copy</Menu.Item>
      <Menu.Item key="3">Archive</Menu.Item>
    </Menu>
  );
  
  const listdata = [
    {
      title: 'Event ID',
    },
    {
      title: 'Event Title',
    },
    {
      title: 'Event Subtitle',
    },
    {
      title: 'Start Date',
    },{
      title: 'End Date',
    },
    {
      title: 'Venue Name',
    },
    {
      title: 'Event Type',
    },
    {
      title: 'Event Tags',
    },{
      title: 'Organization Role',
    },
    {
      title: 'Total Attendees',
    },
  ]

  function handleChange(value) {
    console.log(`selected ${value}`);
  }

  const SetColumns = [{
    title: 'Columns Headers',
    dataIndex: 'ColumnsHeaders',
    key: 'ColumnsHeaders',
  }, {
    title: 'Shown in Table',
    dataIndex: 'ShowninTable',
    key: 'ShowninTable',
  }];
  const SetData = [{
    key: '1',
    ColumnsHeaders: 'Event ID',
    ShowninTable: <a><Icon type="eye" /></a>,
  }, {
    key: '2',
    ColumnsHeaders: 'Event Title',
    ShowninTable: <a><Icon type="eye" /></a>,
  }, {
    key: '3',
    ColumnsHeaders: 'Start Date',
    ShowninTable: <a><Icon type="eye" /></a>
  }, {
    key: '4',
    ColumnsHeaders: 'Location',
    ShowninTable: <a><Icon type="eye" /></a>,
  },{
    key: '5',
    ColumnsHeaders: 'Checked in',
    ShowninTable: <a><Icon type="eye" /></a>,
  },{
    key: '6',
    ColumnsHeaders: 'End Date',
    ShowninTable: <a><Icon type="eye" /></a>,
  },{
    key: '7',
    ColumnsHeaders: 'Event Type',
    ShowninTable: <a><Icon type="eye" /></a>,
  },{
    key: '8',
    ColumnsHeaders: 'New Attendees',
    ShowninTable: <a><Icon type="eye" /></a>,
  },{
    key: '9',
    ColumnsHeaders: 'Organization Role',
    ShowninTable: <a><Icon type="eye" /></a>,
  },{
    key: '10',
    ColumnsHeaders: 'Pending Approval',
    ShowninTable: <a><Icon type="eye" /></a>,
  }];
export default class Draft extends Component {
    // constructor(){
    //     super()
        
    // }
    state = {
      visible: false,
      confirmLoading: false,
      visible2: false,
      confirmLoading2: false,
    }
    showModal = () => {
      this.setState({
        visible: true,
      });
    }
  
    showModal2 = () => {
      this.setState({
        visible2: true,
      });
    }
    handleOk = () => {
      this.setState({
        ModalText: 'The modal will be closed after two seconds',
        confirmLoading: true,
      });
      setTimeout(() => {
        this.setState({
          visible: false,
          confirmLoading: false,
        });
      }, 2000);
    }
    handleOk2 = () => {
      this.setState({
        ModalText: 'The modal will be closed after two seconds',
        confirmLoading2: true,
      });
      setTimeout(() => {
        this.setState({
          visible2: false,
          confirmLoading2: false,
        });
      }, 2000);
    }
  
    handleCancel = () => {
      console.log('Clicked cancel button');
      this.setState({
        visible: false,
      });
    }

    handleCancel2 = () => {
      console.log('Clicked cancel button');
      this.setState({
        visible2: false,
      });
    }
  
    getCurrentStep() {
        const { location } = this.props;
        const { pathname } = location;
        const pathList = pathname.split('/');
        switch (pathList[pathList.length - 1]) {
          case 'info':
            return 0;
          case 'confirm':
            return 1;
          case 'result':
            return 2;
          default:
            return 0;
        }
      }
    render(){
        const { match, routerData, location } = this.props;
        const { visible, confirmLoading, ModalText } = this.state;
        const setForm = <div>
          <p>Select which fields to include in the exported list.Select fields to be exported *:</p>
          <Card title="Fields to Select (10)">
            <List
                className="demo-loadmore-list"
                itemLayout="horizontal"
                dataSource={listdata}
                renderItem={item => (
                  <List.Item actions={[<a>Delete</a>]}>
                    <List.Item.Meta
                      title={item.title}
                    />
                  </List.Item>
                )}
              />
          </Card>
          <Select defaultValue="Select fields to be exported" style={{width:'100%',marginTop:22}} onChange={handleChange}>
                <Option value="1">Select fields to be exported</Option>
                <OptGroup label="Fields to Select">
                  <Option value="2">All Default Fields (22 Default Fields)</Option>
                  <Option value="3">Description for Search Engines</Option>
                  <Option value="4">Event Visibility</Option>
                  <Option value="5">Venue Address</Option>
                </OptGroup>
              </Select>
        </div>

        const settingForm = <Table columns={SetColumns} dataSource={SetData} pagination={false}  hideOnSinglePage={true}/>
        return(
            <div className={styles.main}>
                <Row gutter={24}>
                    <Col xl={4} lg={4} md={4} sm={4} xs={4}>
                        <Dropdown overlay={menu} trigger={['click']}>
                            <a className="ant-dropdown-link" href="#" style={{display:'block',margin:24}}>
                            City <Icon type="down" />
                            </a>
                        </Dropdown>
                    </Col>
                    <Col xl={11} lg={11} md={11} sm={11} xs={11} offset={9}>
                              <div style={{width:'100%',textAlign:"right"}}>
                                <div style={{margin:'0 auto'}}>
                                <Search
                                style={{width:200,marginLeft:10}}
                                placeholder="Input Search Text"
                                onSearch={value => console.log(value)}
                                enterButton
                                />
                                <Button type="primary" icon="download" onClick={this.showModal} style={{marginLeft:10}}></Button>
                                <Modal title="Export List"
                                  visible={visible}
                                  onOk={this.handleOk}
                                  confirmLoading={confirmLoading}
                                  onCancel={this.handleCancel}
                                  okText="Export"
                                  cancelText="Cancel"
                                >
                                  <p>{setForm}</p>
                                </Modal>
                                <Button type="primary" icon="setting" onClick={this.showModal2} style={{marginLeft:10}}></Button>
                                <Modal title="Select the columns you want to display in this list"
                                  visible={this.state.visible2}
                                  onOk={this.handleOk2}
                                  confirmLoading2={this.state.confirmLoading2}
                                  onCancel={this.handleCancel2}
                                  footer={null}
                                >
                                  <p>{settingForm}</p>
                                </Modal>
                                <Link to="/event/draf/create" className={styles.logo} key="logo">
                                    <Button type="primary" icon="plus" style={{marginLeft:10}}>Create Event</Button>
                                </Link>
                                
                                </div>
                                
                        </div>       
                    </Col>
                </Row>
                <Row gutter = {24}>
                    <Col span={24} className="draftCard">
                    <Card >
                    <Table dataSource={data}>
                            <Column
                                title="Titile"
                                dataIndex="titile"
                                key="titile"
                            />
                            <Column
                            title="Location"
                            dataIndex="location"
                            key="location"
                            />
                            <Column
                            title="Start Date"
                            dataIndex="Startdate"
                            key="Startdate"
                            />
                            <Column
                            title="Total Attendees"
                            dataIndex="totalattendees"
                            key="totalattendees"
                            />
                            <Column
                            title="Checked Attendees"
                            dataIndex="checkedattendees"
                            key="checkedattendees"
                            />
                            <Column
                            title="Action"
                            key="action"
                            render={(text, record) => (
                                <span>
                                <a href="javascript:;">View{record.name}</a>
                                <Divider type="vertical" />
                                <a href="javascript:;">Edit</a>
                                <Divider type="vertical" />
                                <Dropdown overlay={menu1} trigger={['click']}>
                                    <a className="ant-dropdown-link" href="#">
                                    More<Icon type="down" />
                                    </a>
                                </Dropdown>

                                </span>
                            )}
                            />
                        </Table>                
                        </Card>
                    </Col>
                </Row>
            </div>
        )
    }

}