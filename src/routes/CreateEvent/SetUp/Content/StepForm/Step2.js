import React, { Component } from 'react';
import { Row, Col, Form, Input, InputNumber, Button, Card, Select, Modal, Upload, Icon, message, Spin } from 'antd';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import styles from './style.less';
import speakers from '../../../../../assets/250x263.jpg';
import addSpeaker from '../../../../../assets/add.jpg';
import { formatMessage, injectIntl, intlShape } from 'react-intl';
import { getPageQuery, Ip, getCookie } from '../../../../../utils/utils';
const Option = Select.Option;
const FormItem = Form.Item;
const { TextArea } = Input;
const { Meta } = Card;
const confirm = Modal.confirm;
@connect(({ eventSpeakerList, loading }) => ({
    eventSpeakerList,
    submitting: loading.effects['eventSpeakerList/eventSpeakerList'],
}))
@connect(({ eventSpeakerManuallyAddition, loading }) => ({
    eventSpeakerManuallyAddition,
    submitting: loading.effects['eventSpeakerManuallyAddition/getEventSpeakerManuallyAddition'],
}))
@connect(({ eventSpeakerDelete, loading }) => ({
    eventSpeakerDelete,
    submitting: loading.effects['eventSpeakerDelete/getEventSpeakerDelete'],
}))
@connect(({ eventSpeakerEdit, loading }) => ({
    eventSpeakerEdit,
    submitting: loading.effects['eventSpeakerEdit/getEventSpeakerEdit'],
}))
@connect(({ speakerDetail, loading }) => ({
    speakerDetail,
    submitting: loading.effects['speakerDetail/getSpeakerDetail'],
}))
@connect(({ speakerSearch, loading }) => ({
    speakerSearch,
    submitting: loading.effects['speakerSearch/getSpeakerSearch'],
}))

@Form.create()
class Step2 extends Component {
    constructor() {
        super();
        this.showDelConfirm = this.showDelConfirm.bind(this);
        this.editSpeaker = this.editSpeaker.bind(this);
    }

    state = {
        data: [],
        value: '',
        fetching: false,
        maxFileSize: 1,
        previewVisible: false,
        previewImage: '',
        speakerType: "",
        visible: false,
        hideNewModal: false,
        loading: false,
        imageUrl: '',
        eventId: getPageQuery(location.search).id,
        EventSpeakerId: '',
        speakOpen: false
    }
    speakBlur = () => {
        console.log('111');
        this.setState({
            speakOpen: false
        })
    }
    speakChange = (value) => {
        this.setState({
            value,
            data: [],
            fetching: false,
        });
    }
    speakSearch = (value) => {
        console.log('speak search', value);
        if (value == '') {
            this.setState({
                speakOpen: true
            })
        }
        this.setState({ data: [], fetching: true });
        fetch(Ip + '/api/event/SpeakerSearch', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "SessionKey": getCookie("sk") != null ? getCookie("sk") : ''
            },
            body: JSON.stringify({ "QueryClause": value })
        })
            .then(response => response.json())
            .then((body) => {
                const data = body.map(item => ({
                    text: `${item.FirstName}` + `${item.LastName}`,
                    value: item.Id,
                }))
                this.setState({ data, fetching: false });
            })

    }
    saveSelSpon = (key) => {
        const { intl } = this.props;
        console.log(this.state.value.key);
        this.setState({
            visible: false,
        });
        fetch(Ip + '/api/event/EventSpeakerAddition', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "SessionKey": getCookie("sk") != null ? getCookie("sk") : ''
            },
            body: JSON.stringify({ "EventId": getPageQuery(location.search).id, "PersonId": this.state.value.key })
        })
            .then(response => response.json())
            .then((body) => {
                if (body.ReturnCode == "1001") {
                    message.success(intl.formatMessage({ id: 'event.content.Add speaker successful' }))
                } else {
                    message.warn(intl.formatMessage({ id: 'event.content.this speakers has already exists' }))
                }
            })
            .then(() => {
                this.getSpeakerList()
            })
    }
    showModal = () => {
        this.setState({
            visible: true,
            speakerType: 'add'
        });
    }
    cancelSelSpon = (e) => {
        this.setState({
            visible: false,
        });
    }
    newSpeakerCancel = (e) => {
        this.setState({
            hideNewModal: false,
        });
    }
    newSpeaker = () => {
        this.setState({
            hideNewModal: true,
        });
    }
    handlePreview = (file) => {
        this.setState({
            previewImage: file.url || file.thumbUrl,
            previewVisible: true,
        });
    }
    getBase64(img, callback) {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    }
    beforeUpload = (file) => {
        const { intl } = this.props;
        const isJPG = file.type === 'image/jpeg';
        if (!isJPG) {
            message.error(intl.formatMessage({ id: 'event.content.You can only upload JPG file' }));
        }
        const isLt1M = file.size / 1024 / 1024 < 1;
        if (!isLt1M) {
            message.error(intl.formatMessage({ id: 'event.content.Image must smaller than 1MB' }));
        }
        return isJPG && isLt1M;
    };
    handleChange = (info) => {
        if (info.file.status === 'uploading') {
            this.setState({ loading: true });
            return;
        }
        if (info.file.status === 'done') {
            this.getBase64(info.file.originFileObj, imageUrl => this.setState({
                imageUrl,
                loading: false,
            }));
        }
    }
    handleSubmit = (e) => {
        e.preventDefault();
        if (this.state.EventSpeakerId == '' || this.state.EventSpeakerId == null) {
            console.log(this.state.EventSpeakerId);
            this.props.form.setFieldsValue({
                Photo: this.state.imageUrl,
                EventId: this.state.eventId,
            });
            this.props.form.validateFieldsAndScroll((err, values) => {
                if (!err) {
                    console.log('Received values of form: ', values);
                    this.setState({
                        hideNewModal: false,
                        visible: false
                    });
                    this.props.dispatch({
                        type: 'eventSpeakerManuallyAddition/getEventSpeakerManuallyAddition',
                        payload: values
                    })
                        .then(() => {
                            this.getSpeakerList();
                        });
                }
            });
        }
        else {
            this.props.form.setFieldsValue({
                Photo: this.state.imageUrl,
                EventId: this.state.eventId,
            });
            this.props.form.validateFieldsAndScroll((err, values) => {
                if (!err) {
                    console.log('Edite values of form: ', values);
                    this.setState({
                        hideNewModal: false,
                    });
                    this.props.dispatch({
                        type: 'eventSpeakerEdit/getEventSpeakerEdit',
                        payload: values
                    })
                        .then(() => {
                            this.getSpeakerList();
                        });
                }
            });
            this.setState({
                EventSpeakerId: ''
            })
        }
    }
    componentDidMount() {
        this.getSpeakerList();
        this.timer = setInterval(() => this.speakSearch, 1500);
    }
    componentWillUnmount() {
        clearInterval(this.timer);
     }
    getSpeakerList() {
        const { dispatch } = this.props;
        dispatch({
            type: 'eventSpeakerList/eventSpeakerList',
            payload: {
                EventId: getPageQuery(location.search).id
            }
        });
    }
    editSpeaker(EventSpeakerId) {
        this.setState({
            hideNewModal: true,
            EventSpeakerId: EventSpeakerId,
            speakerType: 'edit'
        })
        this.props.dispatch({
            type: 'speakerDetail/getSpeakerDetail',
            payload: {
                EventSpeakerId: EventSpeakerId
            }
        })
            .then(() => {
                const { speakerDetail: { speakerDetail } } = this.props;
                this.props.form.setFieldsValue({
                    EventId: this.state.eventId,
                    EventSpeakerId: speakerDetail.EventSpeakerId,
                    FirstName: speakerDetail.FirstName,
                    LastName: speakerDetail.LastName,
                    JobTitle: speakerDetail.JobTitle,
                    CompanyName: speakerDetail.CompanyName,
                    Email: speakerDetail.Email,
                    Order: speakerDetail.OrderNumber,
                    Website: speakerDetail.Website,
                    Photo: speakerDetail.Photo,
                    Introduction: speakerDetail.Introduction
                })
                this.setState({
                    Photo: speakerDetail.Photo,
                    imageUrl: speakerDetail.Photo
                })

            })
    }

    showDelConfirm = (EventSpeakerId) => {
        const { intl } = this.props;
        const _this = this;
        confirm({
            title: intl.formatMessage({ id: 'event.content.Do you want to delete this speaker' }),
            onOk() {
                _this.delSpeaker(EventSpeakerId);
            },
            onCancel() {
                return;
            },
        });
    }
    delSpeaker = (EventSpeakerId) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'eventSpeakerDelete/getEventSpeakerDelete',
            payload: {
                EventId: getPageQuery(location.search).id,
                EventSpeakerId: EventSpeakerId
            }
        })
            .then(() => {
                this.getSpeakerList();
            });
    }

    render() {
        const { imageUrl } = this.state;
        const { intl, form, location } = this.props;
        const { getFieldDecorator } = form;
        const { fetching, data, value } = this.state;
        const uploadButton = (
            <div>
                <Icon type={this.state.loading ? 'loading' : 'plus'} />
                <div className="ant-upload-text">{intl.formatMessage({ id: 'event.content.Upload avatar' })}</div>
            </div>
        );
        const formItemLayout = {
            labelCol: {
                xs: { span: 0 },
                sm: { span: 8 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 16 },
            },
        };
        const websiteLayout = {
            labelCol: {
                xs: { span: 0 },
                sm: { span: 4 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 20 },
            },
        };
        const { eventSpeakerList: { eventSpeakerList } } = this.props;
        const saveSubmit = () => {
            this.props.dispatch(
                routerRedux.push({
                    pathname: '/createEvent/setUp/content/step-form/venue',
                    search: location.search
                })
            );
        }
        return (
            <div style={{ padding: '30px' }}>
                <Row gutter={16}>
                    {(eventSpeakerList == null || typeof (eventSpeakerList) === 'undefined' || eventSpeakerList.length < 1 || typeof (eventSpeakerList) == String) ? ('') : (
                        <div>
                            {eventSpeakerList.map(item => (
                                <Col span={4}>
                                    <Card
                                        className="speakCard"
                                        //style={{ width: 200}}
                                        cover={<img alt="avatar" src={item.Photo ? item.Photo : speakers} />}
                                        actions={[<a onClick={() => this.showDelConfirm(item.EventSpeakerId)}><Icon type="delete" /></a>,
                                        <a onClick={() => this.editSpeaker(item.EventSpeakerId)}><Icon type="edit" /></a>
                                        ]}
                                        key={item.EventSpeakerId}
                                    >
                                        <Meta
                                            title={item.FirstName + ',' + item.LastName}
                                            description={item.CompanyName + '----' + item.JobTitle}
                                        />
                                    </Card>
                                </Col>
                            ))}
                        </div>
                    )}
                    <Col span={4}>
                        <Card
                            bordered={false}
                            //className="addCard"
                            hoverable
                            cover={<img alt="speakCard" src={addSpeaker} />}
                            onClick={this.showModal}
                        >
                        </Card>
                    </Col>
                </Row>
                <Row>
                    <Col xl={24} lg={24} md={24} sm={24} xs={24}>
                        <div style={{ position: 'relative', height: '30px' }}>
                            <Button onClick={saveSubmit} className={styles.saveButton}>
                                {intl.formatMessage({ id: 'event.content.Save' })}
                            </Button>
                        </div>
                    </Col>
                </Row>
                <Modal
                    destroyOnClose
                    title={intl.formatMessage({ id: 'event.content.Add speakers' })}
                    visible={this.state.visible}
                    onOk={this.saveSelSpon}
                    onCancel={this.cancelSelSpon}
                    cancelText={intl.formatMessage({ id: 'event.content.Cancel' })}
                    okText={intl.formatMessage({ id: 'event.content.Save' })}
                >
                    <Select
                        defaultActiveFirstOption={false}
                        showArrow={false}
                        filterOption={false}
                        showSearch
                        labelInValue
                        onChange={this.speakChange}
                        onSearch={this.speakSearch}
                        placeholder="Select Speakers"
                        notFoundContent={fetching ? <Spin size="small" /> : null}
                        onFocus={() => this.speakSearch('')}
                        onBlur={this.speakBlur}
                        open={this.state.speakOpen}
                        style={{ width: '100%' }}
                    >
                        {data.map(d => <Option key={d.value}>{d.text}</Option>)}
                    </Select>
                    <a style={{ display: 'block', marginTop: 10 }} onClick={() => this.speakSearch('')}>查看全部演讲嘉宾</a>
                    <a
                        onClick={this.newSpeaker}
                        style={{ display: 'block', marginTop: 12 }}
                    >
                        {intl.formatMessage({ id: 'event.content.Add a new speaker' })}
                    </a>
                </Modal>
                <Modal
                    destroyOnClose
                    zIndex={1001}
                    title={this.state.speakerType == 'add' ?
                        intl.formatMessage({ id: 'event.content.Add speakers' }) :
                        intl.formatMessage({ id: 'event.content.Edit speakers' })
                    }
                    visible={this.state.hideNewModal}
                    onOk={this.handleSubmit}
                    onCancel={this.newSpeakerCancel}
                    cancelText={intl.formatMessage({ id: 'event.content.Cancel' })}
                    okText={intl.formatMessage({ id: 'event.content.Save' })}
                    width={800}
                >
                    <Form onSubmit={this.handleSubmit}>
                        <Row gutter={24}>
                            <Col span={4}>
                                <div className="clearfix">
                                    <Upload
                                        name={intl.formatMessage({ id: 'event.content.Upload avatar' })}
                                        listType="picture-card"
                                        showUploadList={false}
                                        beforeUpload={this.beforeUpload}
                                        onChange={this.handleChange}
                                    >
                                        {imageUrl ? <img src={this.state.imageUrl} style={{ maxWidth: '100%', maxHeight: '100%' }} alt="avatar" /> : uploadButton}
                                    </Upload>
                                </div>
                            </Col>
                            <Col span={20}>
                                <h3>{intl.formatMessage({ id: 'event.content.Contact Information' })}</h3>
                                <FormItem
                                    style={{ display: 'none' }}
                                >
                                    {getFieldDecorator('Photo', {

                                    })(
                                        <Input />
                                    )}
                                </FormItem>
                                <FormItem
                                    style={{ display: 'none' }}
                                >
                                    {getFieldDecorator('EventSpeakerId', {

                                    })(
                                        <Input />
                                    )}
                                </FormItem>
                                <FormItem
                                    style={{ display: 'none' }}
                                >
                                    {getFieldDecorator('EventId', {

                                    })(
                                        <Input />
                                    )}
                                </FormItem>
                                <Row gutter={24}>
                                    <Col span={12}>
                                        <FormItem
                                            {...formItemLayout}
                                            label={intl.formatMessage({ id: 'event.content.First name' })}
                                            className="formItemLabel"
                                        >
                                            {getFieldDecorator('FirstName', {
                                                rules: [{
                                                    required: true, message: 'Please input your First Name!',
                                                }],
                                            })(
                                                <Input />
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={12}>
                                        <FormItem
                                            {...formItemLayout}
                                            label={intl.formatMessage({ id: 'event.content.Last name' })}
                                            className="formItemLabel"
                                        >
                                            {getFieldDecorator('LastName', {
                                                rules: [{
                                                    required: true, message: 'Please input your Last Name!',
                                                }],
                                            })(
                                                <Input />
                                            )}
                                        </FormItem>
                                    </Col>
                                </Row>


                                <Row gutter={24}>
                                    <Col span={12}>
                                        <FormItem
                                            {...formItemLayout}
                                            label={intl.formatMessage({ id: 'event.content.Position' })}
                                            className="formItemLabel"
                                        >
                                            {getFieldDecorator('JobTitle', {
                                                rules: [{
                                                    required: true, message: 'Please input your position!',
                                                }],
                                            })(
                                                <Input />
                                            )}
                                        </FormItem>
                                    </Col>

                                    <Col span={12}>
                                        <FormItem
                                            {...formItemLayout}
                                            label={intl.formatMessage({ id: 'event.content.Company' })}
                                            className="formItemLabel"
                                        >
                                            {getFieldDecorator('CompanyName', {
                                                rules: [{
                                                    required: true, message: 'Please input your Company!',
                                                }],
                                            })(
                                                <Input />
                                            )}
                                        </FormItem>
                                    </Col>
                                </Row>



                                <Row gutter={24}>
                                    <Col span={12}>
                                        <FormItem
                                            {...formItemLayout}
                                            label={intl.formatMessage({ id: 'event.content.E-mail' })}
                                            className="formItemLabel"
                                        >
                                            {getFieldDecorator('Email', {
                                                rules: [{
                                                    required: true, message: 'Please input your Email!',
                                                }],
                                            })(
                                                <Input />
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={12}>
                                        <FormItem
                                            {...formItemLayout}
                                            label={intl.formatMessage({ id: 'event.content.Order by' })}
                                            className="formItemLabel"
                                        >
                                            {getFieldDecorator('Order', {
                                                rules: [{
                                                    required: true, message: 'Please input your Order!',
                                                }],
                                            })(
                                                <InputNumber min={1} max={10} style={{ width: '100%' }} />
                                            )}
                                        </FormItem>
                                    </Col>
                                </Row>


                                <FormItem
                                    {...websiteLayout}
                                    label={intl.formatMessage({ id: 'event.content.Website' })}
                                    className="formItemLabel"
                                >
                                    {getFieldDecorator('Website', {
                                        rules: [{
                                            required: true, message: 'Please input your website!',
                                        }],
                                    })(
                                        <Input />
                                    )}
                                </FormItem>
                                <FormItem
                                    style={{ width: '100%' }}
                                >
                                    {getFieldDecorator('Introduction', {
                                        rules: [{
                                            required: true, message: 'Please input your description!',
                                        }],
                                    })(
                                        <TextArea rows={4}
                                            placeholder={intl.formatMessage({ id: "event.content.Description of your event's speaker" })} />
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                    </Form>
                </Modal>
            </div>
        )
    }
}
export default connect(({ form, loading }) => ({
    //submitting: loading.effects['form/submitStepForm'],
    //data: form.step,
}))(injectIntl(Step2));