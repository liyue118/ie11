import React, { Component } from 'react';
import {Tabs, Row, Col ,Input,DatePicker,Icon,TimePicker,Select,Form,Progress,Avatar} from 'antd';
import styles from './index.less'
const FormItem=Form.Item;
const TabPane = Tabs.TabPane;
const Search = Input.Search;
const { Option, OptGroup } = Select;
const { TextArea } = Input;
const { MonthPicker, RangePicker, WeekPicker } = DatePicker;

export default class ShowCompanyProfie extends Component {    
      state={
        disabled:true
      }
      handleEdit=()=>{
        const disabled=this.state.disabled;
        this.setState({
          disabled:!disabled
        })
      }
      render() {
        return ( 
          <div style={{background:'#fff'}}>
               <div className={styles.Cheaders}>
                    Event
                    <div className={styles.CHRight}>
                        Contacts
                    </div>
               </div>
               <Row gutter={24} style={{margin:"10px 20px"}}>
                <Col span={12} >
                    <div  className={styles.companyDet}>
                        <div className={styles.imgDiv}><Icon type="reconciliation" theme="outlined" /></div>
                        <div className={styles.contentDiv}>
                            <div><Icon type="user" theme="outlined" />金融公司</div>
                            <div><Icon type="phone" theme="outlined" />3234923</div>
                            <div><Icon type="paper-clip" theme="outlined" />www.test.com</div>
                        </div>
                    </div>
                    <div style={{marginLeft:30}}>
                        <div style={{color:'#00a1de',margin:"20px 0"}}>详细信息</div>
                        <div className={styles.companyDetails}>
                          <div>公司名称：<span>金融公司</span></div>
                          <div>公司电话：<span>3234923</span></div>
                          <div>公司网址：<span>www.test.com</span></div>
                          <div>公司邮箱：<span>test@163.com</span></div>
                          <div>所属行业：<span>金融</span></div>
                        </div>
                    </div>

                </Col>
                <Col span={12} style={{background:'#fff'}}>
                <div sytle={{marginLeft:30}}>
                  <div style={{color:'#00a1de',margin:"20px 0"}}>联系人</div>
                  <div  className={styles.companyDet}>
                          <div className={styles.avtDiv}>
                              <Avatar icon="user" />
                              <span>陈琳琳</span>
                          </div>
                          <div className={styles.contentDiv}>
                              <div><Icon type="user" theme="outlined" />金融公司</div>
                              <div><Icon type="phone" theme="outlined" />3234923</div>
                              <div><Icon type="mail" theme="outlined" />test@163.com</div>
                          </div>
                    </div>
                    <div  className={styles.companyDet}>
                          <div className={styles.avtDiv}>
                              <Avatar icon="user" />
                              <span>陈琳琳</span>
                          </div>
                          <div className={styles.contentDiv}>
                          <div><Icon type="user" theme="outlined" />金融公司</div>
                              <div><Icon type="phone" theme="outlined" />3234923</div>
                              <div><Icon type="mail" theme="outlined" />test@163.com</div>
                          </div>
                    </div>
                    <div  className={styles.companyDet}>
                          <div className={styles.avtDiv}>
                              <Avatar icon="user" />
                              <span>陈琳琳</span>
                          </div>
                          <div className={styles.contentDiv}>
                          <div><Icon type="user" theme="outlined" />金融公司</div>
                              <div><Icon type="phone" theme="outlined" />3234923</div>
                              <div><Icon type="mail" theme="outlined" />test@163.com</div>
                          </div>
                    </div>
                    <div  className={styles.companyDet}>
                          <div className={styles.avtDiv}>
                              <Avatar icon="user" />
                              <span>陈琳琳</span>
                          </div>
                          <div className={styles.contentDiv}>
                          <div><Icon type="user" theme="outlined" />金融公司</div>
                              <div><Icon type="phone" theme="outlined" />3234923</div>
                              <div><Icon type="mail" theme="outlined" />test@163.com</div>
                          </div>
                    </div>
                </div>
                </Col>
               </Row>
          </div>
        );
      }
}
