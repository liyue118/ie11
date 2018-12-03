import React, { PureComponent ,Fragment} from 'react';
import { Row,Col,Button,Form, Input ,Select,message,Icon, Avatar} from 'antd';
import { connect } from 'dva';
import {injectIntl,formatMessage} from 'react-intl';
import {getPageQuery} from '../../../utils/utils';
import styles from './Registration.less';
const FormItem = Form.Item;
const Option = Select.Option;

class Registration extends PureComponent {
    constructor(props){
        super(props);
        this.state={
            IsHideList:{
                ...props.IsRegHideList,
                Avatar:false,	
                FirstName:true,
                LastName:true,
                CompanyName:true,
                JobTitle:false,
                PhoneNumber:true,	
                EmailAddress:true,	
                CompanyIndustry:true,
                CompanyPhone:false,
                CompanyAddress:false,
                CompanySector:true,
                Address:false,
                CustomField:false,
                CustomFieldLabel:''

            },
            eventid:getPageQuery(props.location.search).id,
            RegId:'',
            inputDisable:true,
        }
    }
    componentWillMount(){
        const {dispatch}=this.props;
        dispatch({
            type:'event/EventRegisterLayoutDetail',
            payload:{EventId:this.state.eventid}
        })
    }
    componentWillReceiveProps(nextProps){
       if(nextProps.IsRegHideList.length!=0){
            this.setState({
                IsHideList:{
                    Avatar:nextProps.IsRegHideList.Avatar,	
                    FirstName:true,		
                    LastName:true,		
                    CompanyName:true,
                    JobTitle:nextProps.IsRegHideList.JobTitle,		
                    PhoneNumber:true,		
                    EmailAddress:true,		
                    CompanyIndustry:nextProps.IsRegHideList.CompanyIndustry,		
                    CompanyPhone:nextProps.IsRegHideList.CompanyPhone,		
                    CompanyAddress:nextProps.IsRegHideList.CompanyAddress,	
                    CompanySector:nextProps.IsRegHideList.CompanySector,
                    Address:nextProps.IsRegHideList.Address,
                    CustomField:nextProps.IsRegHideList.CustomField,
                    CustomFieldLabel:nextProps.IsRegHideList.CustomFieldLabel,
                    	
                },
                RegId:nextProps.IsRegHideList.Id,
                inputDisable:nextProps.IsRegHideList.CustomField?false:true
            })
       }
    }
    handleSubmit = (e) => {
        e.preventDefault();
        const {dispatch}=this.props;
        const {IsHideList}=this.state;
        let lable=this.refs.CustomFieldInput.input.value
        if(IsHideList.CustomField){
            if(lable==null || lable=='' ){
                message.success("请输入自定义字段")
                return
            }
        }else{
            lable='';
        }
       
        const paylod={
            ...IsHideList,
            EventId:this.state.eventid,
            Id:this.state.RegId,
            CustomFieldLabel:lable
        }
        dispatch({
            type:'event/RegisterLayout',
            payload:paylod,
            callback:(data)=>{
                if(data.ReturnCode=='1001'){
                    message.success(this.props.intl.formatMessage({id:'event.SaveSuccess'}));
                }
            }
        })

      }
    DitemClick=(index,onFocus)=>{
        const states=this.state.IsHideList[index];
        var jsonObj =this.state.IsHideList;
        jsonObj[index] = !states;
        if(index=='CustomField' && onFocus){
            jsonObj[index] = true;
        }
        this.setState(
            {IsHideList:{
                ...jsonObj
            }}
        )
    }
    render(){
        const {intl,IsRegHideList}=this.props; 
        const {IsHideList}=this.state;
        return(
           <div className={styles.main}>
                <Row>
                  <Col span={22} offset={1} style={{marginTop:20}}>
                    <div className={styles.CeventTile} style={{textAlign:'left'}}>
                    {intl.formatMessage({id:'event.reg.tips'})}</div>
                    <div  className={styles.CEventContent}>
                    <Row style={{marginLeft:-12}}>
                        <Col span={24}>
                            <div className={`${styles.Ditems} ${!IsHideList["Avatar"]?styles.isDMandatory:''}`} onClick={this.DitemClick.bind(this,"Avatar")} style={{textAlign:'center',padding:20}}>
                                    <Avatar size={64} icon="user" />
                                <div className={`${styles.isAllowed}`}>
                                        <Icon type="eye" theme="outlined" />
                                </div>
                            </div>
                        </Col>
                        <Col span={24}>
                         <div className={`${styles.Ditems} ${styles.bitdiv}`}>
                            <span className={styles.title}>{intl.formatMessage({id:'event.reg.company'})}</span>
                            <span className={styles.DMandatory}>{intl.formatMessage({id:'event.reg.mandatory'})}</span>
                           </div>
                        </Col>
                        
                        <Col span={12}>
                         <div className={`${styles.Ditems}  ${styles.bitdiv}`}>
                            <span className={styles.title}>{intl.formatMessage({id:'event.reg.fname'})}</span>
                            <span className={styles.DMandatory}>{intl.formatMessage({id:'event.reg.mandatory'})}</span>
                           </div>
                        </Col>
                        <Col span={12}>
                         <div className={`${styles.Ditems}  ${styles.bitdiv}`}>
                            <span className={styles.title}>{intl.formatMessage({id:'event.reg.lname'})}</span>
                            <span className={styles.DMandatory}>{intl.formatMessage({id:'event.reg.mandatory'})}</span>
                           </div>
                        </Col>
                        <Col span={12}>
                         <div className={`${styles.Ditems}  ${styles.bitdiv}`}>
                            <span className={styles.title}>{intl.formatMessage({id:'event.reg.phone'})}</span>
                            <span className={styles.DMandatory}>{intl.formatMessage({id:'event.reg.mandatory'})}</span>
                           </div>
                        </Col>
                        <Col span={12}>
                         <div className={`${styles.Ditems}  ${styles.bitdiv}`}>
                            <span className={styles.title}>{intl.formatMessage({id:'event.reg.email'})}</span>
                            <span className={styles.DMandatory}>{intl.formatMessage({id:'event.reg.mandatory'})}</span>
                           </div>
                        </Col>
                        <Col span={12}>
                         <div className={`${styles.Ditems} ${!IsHideList.CompanyPhone?styles.isDMandatory:''}`} onClick={this.DitemClick.bind(this,'CompanyPhone')}>
                            <span className={styles.title}>{intl.formatMessage({id:'event.reg.companyPhone'})}</span>
                            <div className={`${styles.isAllowed}`}>
                                        <Icon type="eye" theme="outlined" />
                                </div>
                           </div>
                        </Col>
                        <Col span={12}>
                         <div className={`${styles.Ditems} ${!IsHideList.JobTitle?styles.isDMandatory:''}`} onClick={this.DitemClick.bind(this,'JobTitle')}>
                            <span className={styles.title}>{intl.formatMessage({id:'event.reg.position'})}</span>
                            <div className={`${styles.isAllowed}`}>
                                        <Icon type="eye" theme="outlined" />
                                </div>
                           </div>
                        </Col>
                        <Col span={12}>
                         <div className={`${styles.Ditems} ${!IsHideList.CompanyIndustry?styles.isDMandatory:''}`} onClick={this.DitemClick.bind(this,'CompanyIndustry')}>
                            <span className={styles.title}>{intl.formatMessage({id:'event.reg.companyIndustry'})}</span>
                            <div className={`${styles.isAllowed}`}>
                                        <Icon type="eye" theme="outlined" />
                                </div>
                           </div>
                        </Col>
                        <Col span={12}>
                         <div className={`${styles.Ditems} ${!IsHideList.CompanySector?styles.isDMandatory:''}`} onClick={this.DitemClick.bind(this,'CompanySector')}>
                            <span className={styles.title}>{intl.formatMessage({id:'event.reg.industry'})}</span>
                            <div className={`${styles.isAllowed}`}>
                                        <Icon type="eye" theme="outlined" />
                                </div>
                           </div>
                        </Col>
                        <Col span={12}>
                         <div className={`${styles.Ditems} ${styles.AdressFDiv} ${!IsHideList.CompanyAddress?styles.isDMandatory:''}`} onClick={this.DitemClick.bind(this,'CompanyAddress')}>
                            <div className={styles.AdressDiv}>
                                 <span className={styles.title}>{intl.formatMessage({id:'event.reg.companyAddress'})}&nbsp;&nbsp;{intl.formatMessage({id:'event.reg.country'})}</span>
                            </div>
                            <div className={styles.AdressDiv}>
                                 <span>{intl.formatMessage({id:'event.reg.state'})}</span>
                            </div>
                            <div className={styles.AdressDiv}>
                                 <span>{intl.formatMessage({id:'event.reg.city'})}</span>
                            </div>
                            <div className={`${styles.isAllowed}`}>
                                        <Icon type="eye" theme="outlined" />
                                </div>
                           </div>
                        </Col>
                        <Col span={12}>
                         <div className={`${styles.Ditems} ${styles.AdressFDiv}  ${!IsHideList.Address?styles.isDMandatory:''}`} onClick={this.DitemClick.bind(this,'Address')}>
                            <div className={styles.AdressDiv}>
                                 <span className={styles.title}>{intl.formatMessage({id:'event.reg.PersonalAddress'})}&nbsp;&nbsp;{intl.formatMessage({id:'event.reg.country'})}</span>
                            </div>
                            <div className={styles.AdressDiv}>
                                 <span>{intl.formatMessage({id:'event.reg.state'})}</span>
                            </div>
                            <div className={styles.AdressDiv}>
                                 <span>{intl.formatMessage({id:'event.reg.city'})}</span>
                            </div>
                            <div className={`${styles.isAllowed}`}>
                                        <Icon type="eye" theme="outlined" />
                                </div>
                           </div>
                        </Col>
                        <Col span={24}>
                        <Input ref="CustomFieldInput" 
                            style={{display:'inline-block',width:"80%"}}  
                            // disabled={this.state.inputDisable}
                            defaultValue={this.state.IsHideList.CustomFieldLabel}
                            className={`${styles.CustomFieldInput} ${this.state.IsHideList.CustomField?'':styles.unclick}`}
                            onFocus={(e)=>{
                                e.preventDefault();
                                this.DitemClick('CustomField',true)
                            }}
                            />
                         <div className={`${styles.Ditems} ${!IsHideList.CustomField?styles.isDMandatory:''}`} style={{textAlign:'left'}} onClick={this.DitemClick.bind(this,'CustomField',false)}>
                            <span className={styles.title}>{intl.formatMessage({id:'event.reg.CustomField'})}</span>
                            <div className={`${styles.isAllowed}`} style={{cursor:'pointer'}}>
                                        <Icon type="eye" theme="outlined" />
                                </div>
                           </div>
                        </Col>
                        <Col style={{textAlign:'center'}}>
                              <Button type="primary" onClick={this.handleSubmit} className={styles.SaveButton} style={{marginTop:20}}>{intl.formatMessage({id:'event.common.save'})}</Button>
                        </Col>
                    </Row>
                    </div>
                  </Col>
                 </Row>  

           </div>
        )
    }
}
export default  connect(({event = {}, loading }) => ({
    // eventlistDate:homelist.eventlistDate
    IsRegHideList:event.IsRegHideList
  }))(injectIntl(Registration));