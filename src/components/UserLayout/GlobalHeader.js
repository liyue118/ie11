import React, { Component } from 'react'
//import { Menu, Icon } from 'antd'
import { Layout, Row, Col } from 'antd';
import { connect } from 'dva'
//import { Link, routerRedux } from 'dva/router'
//import qs from 'qs'
import styles from './GlobalHeader.less'

const { Header } = Layout;
class GlobalHeader extends Component {
    // constructor(){
    //     super()
    // }
    render(){
        return (
            <div>
                <Row gutter={24}>
                    <Col xl={24} lg={24} md={24} sm={24} xs={24}>
                    <Header className={styles.header}>
                        <div className={styles.dttlogo} />
                            </Header>
                        </Col>
                </Row>    
               
            </div>
        )
    }
}

export default connect()(GlobalHeader)