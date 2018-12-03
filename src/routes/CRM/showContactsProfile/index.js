import React, { Component } from 'react';
import {Tabs, Row, Col ,Input,DatePicker,Icon,TimePicker,Select,Form,Progress,Avatar} from 'antd';
import styles from './index.less'
const FormItem=Form.Item;
const TabPane = Tabs.TabPane;
const Search = Input.Search;
const { Option, OptGroup } = Select;
const { TextArea } = Input;
const { MonthPicker, RangePicker, WeekPicker } = DatePicker;

export default class ShowContactsProfie extends Component {    
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
          <div>
               <div className={styles.Cheaders}>
                    Event
                    <div className={styles.CHRight}>
                        Contacts
                    </div>
               </div>
               <Row gutter={24} style={{margin:"10px 20px"}}>
                <Col span={8} style={{background:'#fff'}}>
                  <Col span={24} style={{marginTop:20,fontSize:16,color:"#15b0b2"}}>
                      <Col span={16}>
                        <Icon type="user" theme="outlined" style={{border:'1px solid',borderRadius:"50%",marginRight:5}}  />个人名片 
                      </Col>
                      <Col span={8} style={{textAlign:"right"}}>
                        <Icon type="form" theme="outlined" style={{fontSize:20,cursor:'pointer'}} onClick={this.handleEdit}/>
                      </Col>
                  </Col>
                  <Col span={24} style={{textAlign:"center",margin:"20px 0",color:"#f5f5f5"}}>
                      <Avatar size={100} icon="user" />
                  </Col>
                  <Col span={24}>
                      <FormItem className={styles.fromItem} label="姓：">
                         <Input defaultValue="周" disabled={this.state.disabled}/>
                      </FormItem>
                      <FormItem className={styles.fromItem} label="名：">
                         <Input defaultValue="华" disabled={this.state.disabled}/>
                      </FormItem>
                      <FormItem className={styles.fromItem} label="电话：">
                         <Input defaultValue="18502397444" disabled={this.state.disabled}/>
                      </FormItem>
                      <FormItem className={styles.fromItem} label="邮箱：">
                         <Input defaultValue="wueo@163.com" disabled={this.state.disabled}/>
                      </FormItem>
                      <FormItem className={styles.fromItem} label="公司：">
                         <Input defaultValue="AAP公司" disabled={this.state.disabled}/>
                      </FormItem>
                      <FormItem className={styles.fromItem} label="职位：">
                         <Input defaultValue="财务经理" disabled={this.state.disabled}/>
                      </FormItem>
                      <FormItem className={styles.fromItem} label="行业：">
                         <Input defaultValue="金融" disabled={this.state.disabled}/>
                      </FormItem>
                      <FormItem className={styles.fromItem} label="个人地址：">
                         <Input defaultValue="重庆万州区" disabled={this.state.disabled}/>
                      </FormItem>
                      <FormItem className={styles.fromItem} label="公司地址：">
                         <Input defaultValue="重庆渝中区" disabled={this.state.disabled}/>
                      </FormItem>
                      <FormItem className={styles.fromItem} label="所属列表：">
                         <Input defaultValue="新建列表" disabled={this.state.disabled}/>
                      </FormItem>
                      <div style={{marginLeft:12,color:'#000'}}>
                        <span>所属联系人</span>
                        <div style={{margin:10}}>
                         <Avatar size='default' icon="user" /> Grace Jiang
                        </div>
                      </div>
                      <div style={{marginLeft:12,color:'#000'}}>
                        <span>联系人名单</span>
                        <div style={{margin:10}}>
                         <Avatar size='default' icon="user" /> Grace Jiang
                        </div>
                      </div>
                      
                  </Col>
                </Col>
                <Col span={8} style={{background:'#fff',height:"705px"}}>
                  <Col span={24} style={{marginTop:20,fontSize:16,color:"#15b0b2"}}>
                      <Col span={16}>
                      <Icon type="message" theme="outlined"  style={{marginRight:5}}  />发票信息 
                      </Col>
                  </Col>
                 <Col span={24}>
                    <div style={{paddingLeft:12,marginTop:30}} className={styles.fpDiv}>
                              <div ><span style={{width:"11em",display:'inline-block'}}>增值税发票6位开票码：</span><span>2321321</span></div>
                              <div><span style={{width:"11em",display:'inline-block'}}>公司注册登记全名：</span><span>2321321</span></div>
                              <div><span style={{width:"11em",display:'inline-block'}}>纳税人识别码：</span><span>2321321</span></div>
                              <div><span style={{width:"11em",display:'inline-block'}}>发票邮寄地址：</span><span>2321321</span></div>
                              <div><span style={{width:"11em",display:'inline-block'}}>开户行名称： </span><span>2321321</span></div>
                              <div><span style={{width:"11em",display:'inline-block'}}>银行账户： </span><span>2321321</span></div>
                      </div> 
                 </Col>
                 <Col span={24} className={styles.fpItems}>
                    <Col span={24} style={{marginBottom:10}}>
                        <Col span={1} offset={1}><div className={styles.point}></div></Col>
                        <Col span={7}>税务大会</Col>
                        <Col span={8}>发票寄送中</Col>
                        <Col span={7}>2018-0218</Col>
                    </Col>  
                    <Col span={24} style={{marginBottom:10}}>
                        <Col span={1} offset={1}><div className={styles.point}></div></Col>
                        <Col span={7}>税务大会</Col>
                        <Col span={8}>发票寄送中</Col>
                        <Col span={7}>2018-0218</Col>
                    </Col>  
                 </Col>
                </Col>
                <Col span={8} style={{background:'#fff',height:"705px"}}>
                  <Col span={24} style={{marginTop:20,fontSize:16,color:"#15b0b2"}}>
                      <Col span={16}>
                      <Icon type="message" theme="outlined"  style={{marginRight:5}}  />活动信息 
                      </Col>
                   </Col>
                   <Col span={24}>
                     <div className={styles.progressDiv}><div className={styles.title}>参会率：</div>
                     <Progress percent={60} /></div>
                    <Col span={24} style={{marginTop:20}}>
                        <Col span={24} style={{marginBottom:10}}>
                            <Col span={23} offset={1} style={{marginBottom:10}}>
                              <Col span={1}><div className={styles.point}></div></Col>
                              <Col span={22}>税务大会</Col></Col>
                            <Col span={23} offset={2}>
                                <Col span={5}>未开始</Col>
                                <Col span={5}>未付款</Col>
                                <Col span={7}>参会者</Col>
                                <Col span={7}>2018-0218</Col>
                            </Col>
                        </Col>  
                        <Col span={24} style={{marginBottom:10}}>
                            <Col span={23} offset={1} style={{marginBottom:10}}>
                              <Col span={1}><div className={styles.point}></div></Col>
                              <Col span={22}>税务大会</Col></Col>
                            <Col span={23} offset={2}>
                                <Col span={5}>未开始</Col>
                                <Col span={5}>未付款</Col>
                                <Col span={7}>参会者</Col>
                                <Col span={7}>2018-0218</Col>
                            </Col>
                        </Col>  
                    </Col>

                   </Col>
                </Col>
               </Row>
          </div>
        );
      }
}
