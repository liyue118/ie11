import React, { Component } from 'react';
import { Row, Col ,Card,List, Avatar, Icon, Menu, Dropdown,Button,Input,Table,Divider } from 'antd';
import styles from './New.less';

const Search = Input.Search;
const { Column, ColumnGroup } = Table;
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
  

export default class New extends Component {
    // constructor(){
    //     super()
        
    // }
    render(){
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
                    <Col xl={8} lg={8} md={8} sm={8} xs={8} offset={11}>
                        <div style={{margin:'0 auto'}}>
                            <Button type="primary" icon="plus">Create Event</Button>
                                <Search
                                style={{width:200,marginLeft:10}}
                                placeholder="Input Search Text"
                                onSearch={value => console.log(value)}
                                enterButton
                                />
                        </div>       
                    </Col>
                </Row>
                <Row gutter = {24}>
                    <Col span={24}>
                    <Card>
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