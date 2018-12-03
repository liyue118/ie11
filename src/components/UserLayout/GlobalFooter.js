import React, { Component } from 'react'
//import { Menu, Icon } from 'antd'
import { Layout } from 'antd';
import { Row, Col,Icon } from 'antd';
import { connect } from 'dva'
//import { Link, routerRedux } from 'dva/router'
//import qs from 'qs'
import styles from './GlobalFooter.less'

const { Footer } = Layout;
class GlobalFooter extends Component {
    // constructor(){
    //     super()
    // }
    render(){
        return (
            <div>
                <Footer>
                        <Row gutter={24}>
                            <Col xl={24} lg={24} md={24} sm={24} xs={24}>
                                <h5 style={{textAlign:'center'}}>
                                    Powered by Deloitte
                                </h5>
                            </Col>
                        </Row>
                        <div style={{width:'100%'}}>
                                <div style={{width:270,margin:'20px auto'}}>
                                    <a><Icon type="facebook" className={styles.footerIcon} style={{color:'rgb(54,87,153)'}}/></a>
                                    <a><Icon type="twitter" className={styles.footerIcon} style={{color:'rgb(56,168,222)'}}/></a>
                                    <a><Icon type="linkedin" className={styles.footerIcon} style={{color:'rgb(0,102,153)'}}/></a>    
                                    <a><Icon type="wechat" className={styles.footerIcon} style={{color:'rgb(3,178,15'}}/></a>
                                    <a><Icon type="weibo-circle" className={styles.footerIcon} style={{color:'rgb(214,43,42)'}}/></a>
                                    <a><Icon type="dribbble" className={styles.footerIcon} style={{color:'rgb(207,52,39)'}}/></a>
                                    <a><Icon type="youtube" className={styles.footerIcon} style={{color:'rgb(69,170,54)'}}/></a>
                                </div>
                        </div>
                    </Footer>
            </div>
        )
    }
}

export default connect()(GlobalFooter)