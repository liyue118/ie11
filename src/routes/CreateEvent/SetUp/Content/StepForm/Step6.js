import React, { Component } from 'react';
import { Row,Col,Button,Card,Modal,Upload,List,Avatar,message,Alert } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import { routerRedux } from 'dva/router';
import { formatMessage,injectIntl,intlShape } from 'react-intl';
import {getPageQuery,getCookie} from '../../../../../utils/utils';
const confirm = Modal.confirm;
@connect(({ eventDocumentList, loading }) => ({
    eventDocumentList,
    submitting: loading.effects['eventDocumentList/getEventDocumentList'],
  }))
  @connect(({ eventDocumentDelete, loading }) => ({
    eventDocumentDelete,
    submitting: loading.effects['eventDocumentDelete/getEventDocumentDelete'],
  }))
class Step6 extends Component{
    constructor(){
        super()
        this.delDoc = this.delDoc.bind(this);
    }
    state={
        loading: false
    }
    beforeUpload = (file) => {
        const {intl} = this.props;
        const isLt1M = file.size / 1024 / 1024 < 1;
        if (!isLt1M) {
            message.error(intl.formatMessage({id:'event.content.Image must smaller than 1MB'}));
        }
        return isLt1M;
    };
    componentDidMount(){
        this.eventDocumentList()
    }
    eventDocumentList(){
        this.props.dispatch({
            type: 'eventDocumentList/getEventDocumentList',
            payload: {
                EventId:getPageQuery(location.search).id
            },
        })
    }
    delDoc = (Id) => {
        const _this = this;
        confirm({
            title: 'Do you want to delete this item?',
            //content: 'Some descriptions',
            onOk() {
                _this.props.dispatch({
                    type: 'eventDocumentDelete/getEventDocumentDelete',
                    payload: {
                        EventId:getPageQuery(location.search).id,
                        EventDocumentId:Id
                    }
                })
                .then(()=>{
                    _this.eventDocumentList();
                })
            },
            onCancel() {
              //console.log('Cancel');
            },
          });
        
        
    }
    render(){
        const{eventDocumentList:{eventDocumentList}}=this.props;
        const {intl} = this.props;
        const _this = this;
        const props = {
            name: 'file',
            action: 'http://10.173.0.139:8001/api/common/UploadAttachment',
            headers:{
                "SessionKey": getCookie("sk")!=null?getCookie("sk"):''
            },
            data: {
                EventId:getPageQuery(location.search).id,
            },
            onChange(info) {
              if (info.file.status !== 'uploading') {
                //console.log(info.file, info.fileList);
              }
              if (info.file.status === 'done') {
                message.success(`${info.file.name}`+intl.formatMessage({id:'event.content.file uploaded successfully'}));
                _this.eventDocumentList()
              } else if (info.file.status === 'error') {
                message.error(`${info.file.name}`)+intl.formatMessage({id:'event.content.file upload failed'});
              }
            },
          };
        return(
            <Row gutter={24}>
            <Col xl={24} lg={24} md={24} sm={24} xs={24}>
                <Card>
                            <Card
                                title={intl.formatMessage({id:'event.content.Document list'})}
                                extra={<Upload {...props} 
                                    beforeUpload={this.beforeUpload}
                                    showUploadList={false}>
                                    <Button>{intl.formatMessage({id:'event.content.Upload documents'})}</Button>
                                    </Upload>}
                            >
                            {(typeof(eventDocumentList)==='undefined' || eventDocumentList.length<1 || eventDocumentList == null)?(
                                <Alert
                                message={intl.formatMessage({id:'event.content.No attached documents'})}
                                description={intl.formatMessage({id:'event.content.Upload attached documents, which can be viewed or downloaded by participants'})}
                                type="info"
                                showIcon
                              />
                            ):(
                                <List
                                    className="documentlist"
                                    itemLayout="horizontal"
                                    dataSource={eventDocumentList}
                                    renderItem={item => (
                                        <List.Item actions={[<a onClick={()=>this.delDoc(item.EventDocumentId)}>{intl.formatMessage({id:'event.content.Delete documents'})}</a>]}>
                                        <List.Item.Meta
                                             avatar={<Avatar style={{backgroundColor: '#60b8e8' }}>{item.FileType}</Avatar>}
                                             title={<a>{item.DocumentName}</a>}
                                        />
                                        <div>{moment(item.CreateDate).format('YYYY-MM-DD HH:mm:ss')}</div>
                                    </List.Item>
                                    )}
                                />
                            )}  
                            </Card>
                </Card>
            </Col>
        </Row>                    
        )
    }
}

export default connect(({ form, loading }) => ({
    //submitting: loading.effects['form/submitStepForm'],
    //data: form.step,
  }))(injectIntl(Step6));