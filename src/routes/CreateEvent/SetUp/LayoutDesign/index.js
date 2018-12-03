import React, { PureComponent ,Fragment} from 'react';
import { Row,Col,Tabs, Card,Upload, message, Button, Icon,Select,Modal} from 'antd';
import { connect } from 'dva';
import {injectIntl,formatMessage} from 'react-intl';
import {getPageQuery} from '../../../../utils/utils';
import styles from './index.less';
import layoutDesign1 from '../../../../assets/layoutDesign1.jpg';
const TabPane = Tabs.TabPane;
const Option = Select.Option;
const confirm = Modal.confirm;

function getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  }
  
function beforeUpload(file) {
    const isJPG = file.type === 'image/jpeg';
    if (!isJPG) {
      message.error('You can only upload JPG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
    }
    return isJPG && isLt2M;
  }
  

class layoutDesign extends PureComponent {
     constructor(props){
         super(props);
         this.state = {
            loading: false,
            publishLoading:false,
            maxFileSize:1,
            IsHideList:{
                HeaderImage: "",
                VenueImage: "",
                ShowDetails: true,
                ShowSchedule: true,
                ShowSpeaker: true,
                ShowSponsor: true,
                ShowDocument: true,
                ShowTicket: true,
                ShowDttEntity:true,
                ShowRegisterInfo:true,
                Template:'default',
            },
            EventId:getPageQuery(props.location.search).id
          };
     }
     componentWillMount(){
         const {dispatch}=this.props;
         dispatch({
            type:'event/EventLayoutDetail',
            payload:{EventId:this.state.EventId}
        })
     }
     beforeUpload = (file) => {
        const maxFileSize = this.state.maxFileSize;
        if (maxFileSize) {
            const isLtMax = file.size / 1024 / 1024 < maxFileSize;
            if (!isLtMax) {
                message.error(`文件大小超过${maxFileSize}M限制`);
            }
            return isLtMax;
        }
    };
    handleChange = (info) => {
        if (info.file.status === 'uploading') {
          this.setState({ loading: true });
          return;
        }
        getBase64(info.file.originFileObj, imageUrl => {
            console.log(imageUrl)
        this.setState({
            IsHideList:{
                ...this.state.IsHideList,
                VenueImage:imageUrl
            },
            loading: false,
          })
        });
    }
    handleChange2 = (info) => {
        if (info.file.status === 'uploading') {
          this.setState({ loading: true });
          return;
        }
        getBase64(info.file.originFileObj, imageUrl2=>{
            console.log(imageUrl2)
            this.setState({
                IsHideList:{
                    ...this.state.IsHideList,
                    HeaderImage:imageUrl2
                },
                loading: false,
              })
        });
    }
    
    DitemClick=(index)=>{
        const states=this.state.IsHideList[index];
        var jsonObj =this.state.IsHideList;
        jsonObj[index] = !states;
        this.setState(
            {IsHideList:{
                ...jsonObj
            }}
        )
    }
    //nextProps
    componentWillReceiveProps(nextProps){
        const {ContentLayoutList}=nextProps;
        if(ContentLayoutList.length!=0){
            this.setState({
                IsHideList:{
                    HeaderImage:ContentLayoutList.HeaderImage,
                    VenueImage: ContentLayoutList.VenueImage,
                    ShowDetails: ContentLayoutList.ShowDetails,
                    ShowSchedule: ContentLayoutList.ShowSchedule,
                    ShowSpeaker: ContentLayoutList.ShowSpeaker,
                    ShowSponsor: ContentLayoutList.ShowSponsor,
                    ShowDocument: ContentLayoutList.ShowDocument,
                    ShowTicket: ContentLayoutList.ShowTicket,
                    ShowDttEntity:ContentLayoutList.ShowDttEntity,
                    Template:ContentLayoutList.Template,
                    ShowRegisterInfo:true,
                }
            })
        }
    }
    handleSave =()=>{
        const {dispatch}=this.props;
        const {IsHideList}=this.state;
        if(IsHideList.HeaderImage==''){
            message.success(this.props.intl.formatMessage({id:'event.template.uploadBanner'}));
            return;
        }else{
            this.setState({
                loading:true
            })
            const values={
                ...IsHideList,
                HeaderImage:IsHideList.HeaderImage==undefined?null:IsHideList.HeaderImage,
                VenueImage:IsHideList.VenueImage==undefined?null:IsHideList.VenueImage,
                Template:'default',
                EventId:this.state.EventId
            }
            dispatch({
                type:'event/EventLayout',
                payload:values,
                callback:(data)=>{
                    this.setState({loading:false});
                if(data){
                    message.success(this.props.intl.formatMessage({id:'event.SaveSuccess'}));
                }
                }
            })
        }
    }
    preview =()=>{
        window.open('/#/userInterface/eventDetails?id='+this.state.EventId)
    }
    handlePublish=()=>{
        const {intl,dispatch}=this.props;
        const {EventId}=this.state;
        confirm({
            title: intl.formatMessage({id:'event.layout.messagePublish'}),
            okText: intl.formatMessage({id:'event.Confirm'}),
            cancelText: intl.formatMessage({id:'event.Cancel'}),
            onOk() {
                dispatch({
                    type:'event/EventPublish',
                    payload:{EventId:EventId},
                    callback:(data)=>{
                       if(data.ReturnCode=='1001'){
                        message.success(intl.formatMessage({id:'event.layout.messagePublishSuccess'}));
                       }else{
                        message.error(data.Message)   
                       }
                    }
                })
            },
            onCancel() {},
          });
    }
    render(){
        const {intl,ContentLayoutList}=this.props;
        const {IsHideList}=this.state;
        return(
           <div className={styles.main}>
           <div className={styles.Cheaders}>
                    Event
                    <div className={styles.CHRight}>
                      {intl.formatMessage({id:'event.menu.Content Layout'})}
                    </div>
            </div>
           <div className={styles.EventContent} style={{paddingBottom:20}}>
           <Row gutter={24} style={{marginTop:20}}  className={styles.LayoutContent}>
            <Col span={11}>
                <Col span={22} offset={1} style={{textAlign:'center',paddingTop:50}}>
                    <Select placeholder={intl.formatMessage({id:'event.template.SelectTemplate'})} value="default">
                                <Option value="default">{intl.formatMessage({id:'event.template.defaultTemplate'})}</Option>
                    </Select>
                    <img src={layoutDesign1} style={{width:'80%',display:'inline-block',marginTop:20}}/>
                    <Col span={24} style={{marginTop:'20%'}}>
                        <Button type="primary" htmlType="submit" className={styles.SaveButton} onClick={this.preview} style={{color:'#15b0b2 !important '}}>
                        {intl.formatMessage({id:'event.common.preview'})}</Button>
                        <Button type="primary" htmlType="submit"className={styles.SavePrimaryButton} loading={this.state.publishLoading} onClick={this.handlePublish} >
                        {intl.formatMessage({id:'event.common.publish'})}</Button>
                    </Col>
                </Col>
            </Col>
            <Col span={11} offset={1} style={{paddingTop:50}}>
                <div style={{fontSize:20,fontWeight:'bolder'}}>{intl.formatMessage({id:'event.template.cdefinition'})}</div>
                <Col span={24} style={{marginTop:30}}>
                <Col span={12}>
                    <div className={styles.uploadDiv} style={{float:'right',marginRight:20}} >
                        <span style={{color:'#a0a0a0'}}>{intl.formatMessage({id:'event.template.uploadBanner'})}</span>
                        <Upload
                            name="avatar"
                            listType="picture-card"
                            className="avatar-uploader"
                            showUploadList={false}
                            // action=""
                            beforeUpload={this.beforeUpload}
                            onChange={this.handleChange2}>
                            <div className={styles.UploadImgD}>
                                {IsHideList.HeaderImage ? <img src={IsHideList.HeaderImage} alt="avatar" /> :<Icon type="plus" theme="outlined" />}
                            </div>
                            <Button className={styles.uploadB}>
                                <Icon type="upload"  />{intl.formatMessage({id:'event.template.upload'})}
                            </Button>
                        </Upload>
                    </div>
                </Col>
                <Col span={12}>
                <div className={styles.uploadDiv} style={{marginLeft:20}}>
                        <span style={{color:'#a0a0a0'}}>{intl.formatMessage({id:'event.template.uploadlocation'})}</span>
                        <Upload
                            name="avatar"
                            listType="picture-card"
                            className="avatar-uploader"
                            showUploadList={false}
                            // action=""
                            beforeUpload={this.beforeUpload}
                            onChange={this.handleChange}
                            >   
                            <div className={styles.UploadImgD}>
                                {IsHideList.VenueImage ? <img src={IsHideList.VenueImage} alt="avatar" /> :<Icon type="plus" theme="outlined" />}
                            </div>    
                            <Button className={styles.uploadB}>
                                <Icon type="upload"  />{intl.formatMessage({id:'event.template.upload'})}
                            </Button>
                        </Upload>
                    </div>
                </Col>
                </Col>
               <Col span={24} style={{marginTop:20}}>
               <Col span={12}>
                     <div className={`${styles.Ditems}  ${!IsHideList.ShowDetails?styles.isDMandatory:''}`} onClick={this.DitemClick.bind(this,'ShowDetails')}>
                            <span>{intl.formatMessage({id:'event.template.summary'})}</span>
                            <div className={`${styles.isAllowed}`}>
                                        <Icon type="eye" theme="outlined" />
                                </div>
                           </div>
                </Col>
                <Col span={12}>
                         <div className={`${styles.Ditems} ${!IsHideList.ShowSchedule?styles.isDMandatory:''}`} onClick={this.DitemClick.bind(this,'ShowSchedule')}>
                            <span>{intl.formatMessage({id:'event.template.agenda'})}</span>
                            <div className={`${styles.isAllowed}`}>
                                        <Icon type="eye" theme="outlined" />
                                </div>
                           </div>
                </Col>
                <Col span={12}>
                         <div className={`${styles.Ditems} ${!IsHideList.ShowSpeaker?styles.isDMandatory:''}`} onClick={this.DitemClick.bind(this,'ShowSpeaker')}>
                            <span>{intl.formatMessage({id:'event.template.speakers'})}</span>
                            <div className={`${styles.isAllowed}`}>
                                        <Icon type="eye" theme="outlined" />
                                </div>
                           </div>
                </Col>
                <Col span={12}>
                         <div className={`${styles.Ditems} ${!IsHideList.ShowDocument?styles.isDMandatory:''}`} onClick={this.DitemClick.bind(this,'ShowDocument')}>
                            <span>{intl.formatMessage({id:'event.template.documents'})}</span>
                            <div className={`${styles.isAllowed}`}>
                                        <Icon type="eye" theme="outlined" />
                                </div>
                           </div>
                </Col>
                <Col span={12}>
                         <div className={`${styles.Ditems} ${!IsHideList.ShowSponsor?styles.isDMandatory:''}`} onClick={this.DitemClick.bind(this,'ShowSponsor')}>
                            <span>{intl.formatMessage({id:'event.template.sponsors'})}</span>
                            <div className={`${styles.isAllowed}`}>
                                        <Icon type="eye" theme="outlined" />
                                </div>
                           </div>
                </Col>
                <Col span={12}>
                         <div className={`${styles.Ditems} ${!IsHideList.ShowTicket?styles.isDMandatory:''}`} onClick={this.DitemClick.bind(this,'ShowTicket')}>
                            <span>{intl.formatMessage({id:'event.template.tickets'})}</span>
                            <div className={`${styles.isAllowed}`}>
                                        <Icon type="eye" theme="outlined" />
                                </div>
                           </div>
                </Col>
                <Col span={12}>
                         <div className={`${styles.Ditems} ${!IsHideList.ShowDttEntity?styles.isDMandatory:''}`} onClick={this.DitemClick.bind(this,'ShowDttEntity')}>
                            <span>{intl.formatMessage({id:'event.template.accountinformation'})}</span>
                            <div className={`${styles.isAllowed}`}>
                                        <Icon type="eye" theme="outlined" />
                                </div>
                           </div>
                </Col>
                <Col span={12}>
                         <div className={`${styles.Ditems}`}>
                            <span>{intl.formatMessage({id:'event.template.ShowRegisterInfo'})}</span>
                            <div className={`${styles.isAllowed}`}>
                                        <Icon type="eye" theme="outlined" />
                                </div>
                           </div>
                </Col>
                <Col span={24} style={{textAlign:'center',marginTop:20}}>
                         <Button type="primary" htmlType="submit"className={styles.SavePrimaryButton} loading={this.state.loading} onClick={this.handleSave} >
                        {intl.formatMessage({id:'event.common.save'})}</Button>
                </Col>
               </Col>
            </Col>    
           </Row>
           </div>
           </div> 
        )
    }
}
export default connect(({event = {}, loading }) => ({
    ContentLayoutList:event.ContentLayoutList
  }))(injectIntl(layoutDesign));