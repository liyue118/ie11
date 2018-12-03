import React, { Component } from 'react';
import { Row, Col ,Card,List, Avatar,Button ,Input , Table, Icon, Divider  } from 'antd';
import { connect } from 'dva';
import { Route, Redirect, Switch, routerRedux, Router } from 'dva/router';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import styles from './Report.less';


const Search = Input.Search;
const { Column, ColumnGroup } = Table;
const data = [{
    key: '1',
    firstName: 'John',
    lastName: 'Brown',
    position: 'Senior',
    company: 'New York...',
  }, {
    key: '2',
    firstName: 'Jim',
    lastName: 'Green',
    position: 'Assistant',
    company: 'London...',
  }, {
    key: '3',
    firstName: 'Joe',
    lastName: 'Black',
    position: 'Director',
    company: 'Sidney...',
  }];
  
class Report extends Component {
    // constructor(){
    //     super()
        
    // }
    openlink(names){;
        names=='contacts'?(this.props.dispatch(routerRedux.push({
            pathname: '/crm/contacts',
            query:  { isshow: 'true'},
        }))):(this.props.dispatch(routerRedux.push({
            pathname: '/crm/company',
            query:  { isshow: 'true'},
        })))
    }
    render(){
        const extraContent = (
            <div className={styles.extraContent}>
              <div className={styles.statItem}>
                <p>Contacts</p>
                <p>3000</p>
                <p style={{marginBottom:16}}></p>
                <h6><Button type="primary" shape="circle" icon="plus" size="small" style={{marginRight:6}} onClick={this.openlink.bind(this,'contacts')}/>Add Contacts</h6>

              </div>
              {/* <div className={styles.statItem}>
                <p>companies</p>
                <p>
                  8
                  <span> / 24</span>
                </p>
              </div> */}
              <div className={styles.statItem}>
                <p>Companies</p>
                <p>1023</p>
                <p style={{marginBottom:16}}></p>
                <h6><Button type="primary" shape="circle" icon="plus" size="small" style={{marginRight:6}} onClick={this.openlink.bind(this,'company')}/>Add Company</h6>
              </div>
            </div>
          );
        return(   
            <PageHeaderLayout  extraContent={extraContent}>
                <Row gutter={24}>
                    <Col xl={24} lg={24} md={24} sm={24} xs={24}>
                    <div className={styles.seachBox}>
                        <Search
                        placeholder="Search Contacts by Name or Company"
                        onSearch={value => console.log(value)}
                        style={{ width: 400}}
                        />
                    </div>
                    </Col>
                </Row>
                <Row gutter={24}>
                    <Col xl={20} lg={20} md={20} sm={20} xs={20} offset={2}>
                    <p style={{margin:"24px 24px 24px 0"}}> Recent Added Contacts</p>
                        <Table dataSource={data}>
                            <Column
                                title="Last Name"
                                dataIndex="lastName"
                                key="lastName"
                            />
                            <Column
                                title="First Name"
                                dataIndex="firstName"
                                key="firstName"
                            />
                            <Column
                            title="Position"
                            dataIndex="position"
                            key="position"
                            />
                            <Column
                            title="Company"
                            dataIndex="company"
                            key="company"
                            />
                            <Column
                            title="Action"
                            key="action"
                            render={(text, record) => (
                                <span>
                                <a href="javascript:;">Editor{record.name}</a>
                                <Divider type="vertical" />
                                <a href="javascript:;">Tel</a>
                                <Divider type="vertical" />
                                <a href="javascript:;">Email</a>
                                <Divider type="vertical" />
                                {/* <a href="javascript:;" className="ant-dropdown-link">
                                    More actions <Icon type="down" />
                                </a> */}
                                </span>
                            )}
                            />
                        </Table>                       
                    </Col>
                </Row>
            </PageHeaderLayout>
                
               
        )
    }
}
export default connect()(Report)