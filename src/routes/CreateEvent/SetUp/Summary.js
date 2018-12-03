import React, { Component } from 'react';
import { Row,Col,Form, Input, DatePicker, Select,Checkbox,Radio ,Button,Card,Alert,Modal, Upload, Icon, message } from 'antd';
import { connect } from 'dva';

const FormItem = Form.Item;
const Option = Select.Option;

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
  
@Form.create()
class Summary extends Component{
    state={
        speaker:0,
        visible: false,
        hideNewModal:false,
        loading: false,
    }
    showModal = () => {
        this.setState({
          visible: true,
        });
      }
    
      handleOk = (e) => {
        console.log(e);
        this.setState({
          visible: false,
        });
      }
    
      handleCancel = (e) => {
        console.log(e);
        this.setState({
          visible: false,
        });
      }
      newSpeakerOk = (e) => {
        console.log(e);
        this.setState({
          hideNewModal: false,
        });
      }
      
      newSpeakerCancel = (e) => {
        console.log(e);
        this.setState({
          hideNewModal: false,
        });
      }
    newSpeaker =()=>{
        this.setState({
            hideNewModal: true,
          });
    }
    avatarChange = (info) => {
        if (info.file.status === 'uploading') {
          this.setState({ loading: true });
          return;
        }
        if (info.file.status === 'done') {
          // Get this url from response in real world.
          getBase64(info.file.originFileObj, imageUrl => this.setState({
            imageUrl,
            loading: false,
          }));
        }
      }
      handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
          if (!err) {
            console.log('Received values of form: ', values);
          }
        });
      }
    
    render(){
        const uploadButton = (
            <div>
              <Icon type={this.state.loading ? 'loading' : 'plus'} />
              <div className="ant-upload-text">Upload</div>
            </div>
          );
          const imageUrl = this.state.imageUrl;
          const { getFieldDecorator } = this.props.form;
          const formItemLayout = {
            labelCol: {
              xs: { span: 0 },
              sm: { span: 0 },
            },
            wrapperCol: {
              xs: { span: 24 },
              sm: { span: 24 },
            },
          };
        return(
            <Row gutter={24}>
                    <Col xl={24} lg={24} md={24} sm={24} xs={24}>
                        <Button type="primary" style={{float:'right',margin:"24px 0"}} onClick={this.showModal}>Add Speaker</Button>
                    </Col>
                    <Col xl={24} lg={24} md={24} sm={24} xs={24}>
                        <Card>
                            {this.state.speaker !== 0 ? (
                                <span>1</span>
                                ):(
                                <div>
                                    <Alert
                                        message="No Event Speakers"
                                        description="Please add your speakers."
                                        type="info"
                                        showIcon
                                    />
                                    <div style={{textAlign:'center',margin:'24px auto'}}>
                                        <a onClick={this.showModal}>+ Add Speaker </a>
                                    </div>
                                    <Modal
                                    title="Add a New Speaker"
                                    visible={this.state.visible}
                                    onOk={this.handleOk}
                                    onCancel={this.handleCancel}
                                    footer={null}
                                    >
                                     <Select 
                                        defaultValue="Search for a speaker by name or company"
                                        onChange={this.newSpeaker}
                                        >
                                        <Option value="newSpeaker">+ Add a new speaker manually</Option>
                                        
                                    </Select>
                                    </Modal> 
                                    <Modal
                                    title="Add a New Speaker"
                                    visible={this.state.hideNewModal}
                                    onOk={this.newSpeakerOk}
                                    onCancel={this.newSpeakerCancel}
                                    width={800}
                                    >
                                    <Form onSubmit={this.handleSubmit}>
                                        <Row gutter={24}>
                                            <Col span={4}>
                                            <Upload
                                                name="avatar"
                                                listType="picture-card"
                                                className="avatar-uploader"
                                                showUploadList={false}
                                                action=""
                                                beforeUpload={beforeUpload}
                                                onChange={this.avatarChange}
                                            >
                                                {imageUrl ? <img src={imageUrl} alt="avatar" /> : uploadButton}
                                            </Upload>
                                            </Col>
                                            <Col span={20}>
                                                <h3>Contact Information</h3>
                                                <FormItem
                                                {...formItemLayout}
                                                >
                                                <Row gutter={24}>
                                                    <Col span={12}>
                                                    {getFieldDecorator('firstName', {
                                                    rules: [{
                                                    type: 'firstName', message: 'The input is not valid First Name',
                                                    }, {
                                                    required: true, message: 'Please input your First Name!',
                                                    }],
                                                })(
                                                    <Input placeholder="First Name"/>
                                                )}
                                                    </Col>
                                                    <Col span={12}>
                                                    {getFieldDecorator('lastName', {
                                                    rules: [{
                                                    type: 'lastName', message: 'The input is not valid Last Name',
                                                    }, {
                                                    required: true, message: 'Please input your Last Name!',
                                                    }],
                                                })(
                                                    <Input placeholder="Last Name"/>
                                                )}
                                                    </Col>
                                                </Row>    
                                                </FormItem>

                                                <FormItem
                                                {...formItemLayout}
                                                >
                                                <Row gutter={24}>
                                                    <Col span={12}>
                                                    {getFieldDecorator('position', {
                                                    rules: [{
                                                    type: 'position', message: '',
                                                    }, {
                                                    required: true, message: 'Please input your position!',
                                                    }],
                                                })(
                                                    <Input placeholder="Position"/>
                                                )}
                                                    </Col>
                                                    <Col span={12}>
                                                    {getFieldDecorator('company', {
                                                    rules: [{
                                                    type: 'company', message: '',
                                                    }, {
                                                    required: true, message: 'Please input your Company!',
                                                    }],
                                                })(
                                                    <Input placeholder="Company" />
                                                )}
                                                    </Col>
                                                </Row>    
                                                </FormItem>
                                                <FormItem
                                                {...formItemLayout}
                                                >
                                                {getFieldDecorator('website', {
                                                    rules: [{
                                                    type: 'website', message: '',
                                                    }, {
                                                    required: true, message: 'Please input your website!',
                                                    }],
                                                })(
                                                    <Input placeholder="Website"/>
                                                )}
                                                </FormItem>
                                                <FormItem
                                                {...formItemLayout}
                                                >
                                                {getFieldDecorator('description', {
                                                    rules: [{
                                                    type: 'description', message: '',
                                                    }, {
                                                    required: true, message: 'Please input your description!',
                                                    }],
                                                })(
                                                    <Input
                                                    placeholder="Give a description of your event's speaker."
                                                    style={{height:60}}
                                                    />
                                                )}
                                                </FormItem>
                                            </Col>
                                        </Row>
                                    </Form>
                                    </Modal> 
                                </div>  
                                )}      
                        </Card>    
                    </Col>     
                </Row>        
        )
    }
}
export default connect()(Summary)