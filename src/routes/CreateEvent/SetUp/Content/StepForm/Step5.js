import React, { Component } from 'react';
import { Row, Col, Form, Input, Checkbox, Button, Card, Modal, Icon, Spin, Upload, message, Select, InputNumber } from 'antd';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { formatMessage, injectIntl, intlShape } from 'react-intl';
import { getPageQuery } from '../../../../../utils/utils';
import dePic from '../../../../../assets/4.png';
import unPic from '../../../../../assets/5.png';
import styles from './style.less';
import { Ip, getCookie } from '../../../../../utils/utils';
const Option = Select.Option;
const Search = Input.Search;
const FormItem = Form.Item;
const { TextArea } = Input;
const { Meta } = Card;
const confirm = Modal.confirm;
@Form.create()
@connect(({ eventSponsorManuallyAddition, loading }) => ({
    eventSponsorManuallyAddition,
    submitting: loading.effects['eventSponsorManuallyAddition/getEventSponsorManuallyAddition'],
}))
@connect(({ eventSponsorList, loading }) => ({
    eventSponsorList,
    submitting: loading.effects['eventSponsorList/getEventSponsorList'],
}))
@connect(({ dttEntitySearch, loading }) => ({
    dttEntitySearch,
    submitting: loading.effects['dttEntitySearch/getDttEntitySearch'],
}))
@connect(({ eventOrganizationAddition, loading }) => ({
    eventOrganizationAddition,
    submitting: loading.effects['eventOrganizationAddition/getEventOrganizationAddition'],
}))
@connect(({ eventOrganizationList, loading }) => ({
    eventOrganizationList,
    submitting: loading.effects['eventOrganizationList/getEventOrganizationList'],
}))
@connect(({ sponsorSearch, loading }) => ({
    sponsorSearch,
    submitting: loading.effects['sponsorSearch/getSponsorSearch'],
}))
@connect(({ eventSponsorAddition, loading }) => ({
    eventSponsorAddition,
    submitting: loading.effects['eventSponsorAddition/getEventSponsorAddition'],
}))
@connect(({ allCurrency, loading }) => ({
    allCurrency,
    submitting: loading.effects['allCurrency/getAllCurrency'],
}))
@connect(({ eventSponsorDelete, loading }) => ({
    eventSponsorDelete,
    submitting: loading.effects['eventSponsorDelete/getEventSponsorDelete'],
}))
@connect(({ eventOrganizationDelete, loading }) => ({
    eventOrganizationDelete,
    submitting: loading.effects['eventOrganizationDelete/getEventOrganizationDelete'],
}))
class Step5 extends Component {
    constructor() {
        super();
        this.delSponsor = this.delSponsor.bind(this);
    }
    state = {
        data: [],
        sponData: [],
        fetching: false,
        maxFileSize: 1,
        sponing: false,
        value: undefined,
        sponValue: undefined,
        text: '',
        checked: false,
        loading: false,
        imageUrl: '',
        Sponsors: false,
        NewActPopover: false,
        Newsponsors: false,
        eventId: getPageQuery(location.search).id,
        open:false,
        sponsorOpen:false
    }
    Sponsors = () => {
        this.setState({
            Sponsors: true,
        });
    }

    SponsorsOk = (e) => {
        const { intl } = this.props;
        this.setState({
            Sponsors: false
        });
        this.props.dispatch({
            type: 'eventSponsorAddition/getEventSponsorAddition',
            payload: {
                EventId: getPageQuery(location.search).id,
                ClientId: this.state.sponValue.key
            }
        })
            .then(() => {
                const { eventSponsorAddition: { eventSponsorAddition } } = this.props;
                const { intl } = this.props;
                if (eventSponsorAddition.ReturnCode == "1001") {
                    message.success(intl.formatMessage({ id: 'event.content.Add sponsor successful' }))
                } else {
                    message.warn(intl.formatMessage({ id: 'event.content.this sponsor has already exists' }))
                }
            })
            .then(() => {
                this.getSponsorList();
            });
    }
    SponsorsCancel = (e) => {
        this.setState({
            Sponsors: false
        });
    }
    NewActPopover = () => {
        this.setState({
            NewActPopover: true,
        });

    }
    componentDidMount() {
        this.getOrganizationList();
        this.getSponsorList();
        this.getAllCurrency();
        this.timer = setInterval(() => this.sponSearch, 1500);
    }
    componentWillUnmount() {
        clearInterval(this.timer);
     }
    getAllCurrency() {
        this.props.dispatch({
            type: 'allCurrency/getAllCurrency',
        })
    }
    NewActPopoverOk = (e) => {
        console.log(this.state.value.key);
        this.setState({
            NewActPopover: false,
        });
        this.props.dispatch({
            type: 'eventOrganizationAddition/getEventOrganizationAddition',
            payload: {
                EventId: getPageQuery(location.search).id,
                DttEntityId: this.state.value.key
            }
        })
            .then(() => {
                this.getOrganizationList();
            });
    }
    getOrganizationList() {
        this.props.dispatch({
            type: 'eventOrganizationList/getEventOrganizationList',
            payload: {
                EventId: getPageQuery(location.search).id,
            }
        })
    }
    NewActPopoverCancel = (e) => {
        console.log(e);
        this.setState({
            NewActPopover: false,
            value: undefined,
            data: []
        });
    }
    Newsponsors = () => {
        this.setState({
            Newsponsors: true,
        });
    }

    NewsponsorsOk = (e) => {
        console.log(e);
        this.setState({
            Newsponsors: false,
        });
    }

    NewsponsorsCancel = (e) => {
        console.log(e);
        this.setState({
            Newsponsors: false,
        });
    }
    cnySponsor = (value) => {
        console.log(`selected ${value}`);
    }
    numberChange = (value) => {
        console.log('changed', value);
    }
    hideChange = (e) => {
        this.setState({
            checked: e.target.checked
        })
        console.log(e.target.checked);
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
    avatarChange = (info) => {
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
    NewsponsorsSubmit = (e) => {
        e.preventDefault();
        this.props.form.setFieldsValue({
            Logo: this.state.imageUrl,
            EventId: this.state.eventId,
            IsSponsorVisiable: this.state.checked
        });
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                this.setState({
                    Sponsors: false,
                    Newsponsors: false
                });
                this.props.dispatch({
                    type: 'eventSponsorManuallyAddition/getEventSponsorManuallyAddition',
                    payload: values
                })
                    .then(() => {
                        this.getSponsorList();
                    });
            }
        });
    }
    getSponsorList() {
        this.props.dispatch({
            type: 'eventSponsorList/getEventSponsorList',
            payload: {
                EventId: getPageQuery(location.search).id
            }
        })
    }
    handleSearch = (value) => {
        console.log('fetching user', value);
        if(value == ''){
            this.setState({
                open:true
            })
        }
        this.setState({ data: [], fetching: true });
        fetch(Ip + '/api/common/DttEntitySearch', {
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
                    text: `${item.CompanyName}`,
                    value: item.Id,
                }));
                this.setState({ data, fetching: false });
            });
    }
    handleBlur = () =>{
        this.setState({
            open:false
        })
    }
    handleChange = (value) => {
        this.setState({
            value,
            data: [],
            fetching: false,
        });
    }
    
    sponSearch = (value) => {
        console.log('spon search', value);
        if(value == ''){
            this.setState({
                sponsorOpen:true
            })
        }
        this.setState({ sponData: [], sponing: true });
        fetch(Ip + '/api/event/SponsorSearch', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "SessionKey": getCookie("sk") != null ? getCookie("sk") : ''
            },
            body: JSON.stringify({ "QueryClause": value })
        })
            .then(response => response.json())
            .then((body) => {
                const sponData = body.map(item => ({
                    text: `${item.ClientName}`,
                    value: item.Id,
                }));
                this.setState({ sponData, sponing: false });
            });
    }
    sponsorBlur = () =>{
        this.setState({
            sponsorOpen:false
        })
    }
    sponChange = (value) => {
        this.setState({
            sponValue: value,
            sponData: [],
            sponing: false,
        });
    }
    delSponsor = (EventSpeakerId) => {
        const { intl } = this.props;
        const _this = this;
        confirm({
            title: intl.formatMessage({ id: 'event.content.Do you want to delete this sponsors' }),
            onOk() {
                _this.delSponsorOk(EventSpeakerId);
            },
            onCancel() {
                return;
            },
        });
    }
    delSponsorOk(id) {
        const { intl } = this.props;
        this.props.dispatch({
            type: 'eventSponsorDelete/getEventSponsorDelete',
            payload: {
                "EventId": getPageQuery(location.search).id,
                "EventSponsorId": id
            }
        })
            .then(() => {
                const { eventSponsorDelete: { eventSponsorDelete } } = this.props;
                if (eventSponsorDelete.ReturnCode == "1001") {
                    message.success(intl.formatMessage({ id: 'event.message.delete' }))
                } else {
                    message.warn(intl.formatMessage({ id: 'event.message.deletefailed' }))
                }
            })
            .then(() => {
                this.getSponsorList();
            })
    }
    delOrg = (EventEventOrganizationId) => {
        const { intl } = this.props;
        const _this = this;
        confirm({
            title: intl.formatMessage({ id: 'event.content.Do you want to delete this organization' }),
            onOk() {
                _this.delOrgOk(EventEventOrganizationId);
            },
            onCancel() {
                return;
            },
        });
    }
    delOrgOk(id) {
        const { intl } = this.props;
        this.props.dispatch({
            type: 'eventOrganizationDelete/getEventOrganizationDelete',
            payload: {
                "EventId": getPageQuery(location.search).id,
                "EventOrganizationId": id
            }
        })
            .then(() => {
                const { eventOrganizationDelete: { eventOrganizationDelete } } = this.props;
                if (eventOrganizationDelete.ReturnCode == "1001") {
                    message.success(intl.formatMessage({ id: 'event.message.delete' }))
                } else {
                    message.warn(intl.formatMessage({ id: 'event.message.deletefailed' }))
                }
            })
            .then(() => {
                this.getOrganizationList();
            })
    }
    render() {
        const { form } = this.props;
        const { getFieldDecorator } = form;
        const { intl } = this.props;
        const { imageUrl } = this.state;
        const formItemLayout = {
            labelCol: {
                xs: { span: 0 },
                sm: { span: 5 }
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 19 },
            },
        };
        const Layout = {
            labelCol: {
                xs: { span: 0 },
                sm: { span: 11 }
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 13 },
            },
        }
        const uploadButton = (
            <div>
                <Icon type={this.state.loading ? 'loading' : 'plus'} />
                <div className="ant-upload-text">{intl.formatMessage({ id: 'event.content.Upload avatar' })}</div>
            </div>
        );
        const onValidateForm = () => {
            const { location } = this.props;
            this.props.dispatch(
                routerRedux.push({
                    pathname: '/createEvent/setUp/content/step-form/documents',
                    search: location.search
                })
            );
        };
        const addOrganization = (
            <Button icon="plus-circle" type="primary" onClick={this.NewActPopover}>{intl.formatMessage({ id: 'event.content.Add organization' })}</Button>
        );
        const addCategory = (
            <Button icon="plus-circle" type="primary" onClick={this.Sponsors}>
                {intl.formatMessage({ id: 'event.content.Create a new sponsor' })}
            </Button>
        );
        const { fetching, data, value, sponValue, sponing, sponData } = this.state;
        const { eventOrganizationList: { eventOrganizationList } } = this.props;
        const { eventSponsorList: { eventSponsorList } } = this.props;
        const { allCurrency: { allCurrency } } = this.props;
        const children = allCurrency != [] ? allCurrency.map(currency =>
            <Option value={currency.Key}>{currency.Value}</Option>)
            : '';
        return (
            <div style={{ padding: '30px' }}>
                <Row gutter={16}>
                    <Col span={24}>
                        <Card
                            extra={addOrganization}
                            title={intl.formatMessage({ id: 'event.content.Organizations' })}
                            style={{ border: 0 }}
                        >
                            {(eventOrganizationList == null || typeof (eventOrganizationList) === 'undefined' || eventOrganizationList.length < 1) ? (
                                <div>暂无数据</div>
                            ) : (
                                    <div>
                                        {eventOrganizationList.map(item => (
                                            <Card
                                                className="OrangizaCard"
                                                hoverable
                                                style={{ width: 145, border: 0, marginRight: 24 }}
                                                cover={<img alt="deloitte" src={dePic} />}
                                                actions={[<a onClick={() => this.delOrg(item.EventEventOrganizationId)}><Icon type="delete" /></a>]}
                                            >
                                                <Meta
                                                    title={item.CompanyName}
                                                />
                                            </Card>
                                        ))}
                                    </div>
                                )}
                        </Card>
                    </Col>
                    <Col span={24}>
                        <Card
                            extra={addCategory}
                            title={intl.formatMessage({ id: 'event.content.Organization category' })}
                            style={{ border: 0 }}
                        >
                            {(eventSponsorList == null || typeof (eventSponsorList) === 'undefined' || eventSponsorList.length < 1) ? (
                                <div>暂无数据</div>
                            ) : (
                                    <div>
                                        {eventSponsorList.map(item => (
                                            <Card
                                                className="OrangizaCard"
                                                hoverable
                                                style={{ width: 145, border: 0, marginRight: 24 }}
                                                cover={<img alt="undefinded" src={item.Logo != null ? item.Logo : unPic} />}
                                                actions={[<a onClick={() => this.delSponsor(item.EventSponsorId)}><Icon type="delete" /></a>]}
                                            >
                                                <Meta
                                                    title={item.ClientName}
                                                />
                                            </Card>
                                        ))}
                                    </div>
                                )}
                        </Card>
                    </Col>
                </Row>
                <Row>
                    <Col xl={24} lg={24} md={24} sm={24} xs={24}>
                        <div style={{ position: 'relative', height: '30px' }}>
                            <Button onClick={onValidateForm} className={styles.saveButton}>
                                {intl.formatMessage({ id: 'event.content.Save' })}
                            </Button>
                        </div>
                    </Col>
                </Row>
                <Modal
                    destroyOnClose
                    title={intl.formatMessage({ id: 'event.content.Add organization' })}
                    visible={this.state.NewActPopover}
                    onOk={this.NewActPopoverOk}
                    onCancel={this.NewActPopoverCancel}
                    cancelText={intl.formatMessage({ id: 'event.content.Cancel' })}
                    okText={intl.formatMessage({ id: 'event.content.Save' })}
                >
                    <p>{intl.formatMessage({ id: 'event.content.Select organizations from deloitte entities' })}</p>
                    <Select
                        showSearch
                        labelInValue
                        placeholder={intl.formatMessage({ id: 'event.content.Please enter the query entity' })}
                        style={{ width: '100%' }}
                        defaultActiveFirstOption={false}
                        filterOption={false}
                        onSearch={this.handleSearch}
                        onChange={this.handleChange}
                        showArrow={false}
                        onBlur={this.handleBlur}
                        open={this.state.open}
                        notFoundContent={fetching ? <Spin size="small" /> : null}
                    >
                        {data.map(d => <Option key={d.value}>{d.text}</Option>)}
                    </Select>
                    <a style={{display:'block',marginTop:10}} onClick={()=>this.handleSearch('')}>查看全部组织</a>
                </Modal>


                <Modal
                    destroyOnClose
                    title={intl.formatMessage({ id: 'event.content.Create a new sponsor' })}
                    visible={this.state.Sponsors}
                    onOk={this.SponsorsOk}
                    onCancel={this.SponsorsCancel}
                    cancelText={intl.formatMessage({ id: 'event.content.Cancel' })}
                    okText={intl.formatMessage({ id: 'event.content.Save' })}
                >
                    <p>{intl.formatMessage({ id: 'event.content.Select sponsors from deloitte entities' })}</p>
                    <Select
                        showSearch
                        labelInValue
                        placeholder={intl.formatMessage({ id: 'event.content.Please enter the sponsor name' })}
                        style={{ width: '100%' }}
                        defaultActiveFirstOption={false}
                        showArrow={false}
                        filterOption={false}
                        onSearch={this.sponSearch}
                        onFocus={()=>this.sponSearch('')}
                        onBlur={this.sponsorBlur}
                        open={this.state.sponsorOpen}
                        onChange={this.sponChange}
                        notFoundContent={sponing ? <Spin size="small" /> : null}
                    >
                        {sponData.map(d => <Option key={d.value}>{d.text}</Option>)}
                    </Select>
                    <a style={{display:'block',marginTop:10}} onClick={()=>this.sponSearch('')}>查看全部赞助商</a>
                    <a
                        onClick={this.Newsponsors}
                        style={{ display: 'block', marginTop: 12 }}
                    >
                        {intl.formatMessage({ id: 'event.content.Add sponsors' })}
                    </a>
                </Modal>

                <Modal
                    destroyOnClose
                    title={intl.formatMessage({ id: 'event.content.Add sponsors' })}
                    visible={this.state.Newsponsors}
                    onOk={this.NewsponsorsSubmit}
                    onCancel={this.NewsponsorsCancel}
                    cancelText={intl.formatMessage({ id: 'event.content.Cancel' })}
                    okText={intl.formatMessage({ id: 'event.content.Save' })}
                    width={750}
                >
                    <Form onSubmit={this.NewsponsorsSubmit}>

                        <Row gutter={24}>

                            <Col span={4}>
                                <FormItem>
                                    <Upload
                                        name={intl.formatMessage({ id: 'event.content.Upload avatar' })}
                                        listType="picture-card"
                                        showUploadList={false}
                                        beforeUpload={this.beforeUpload}
                                        onChange={this.avatarChange}
                                    >
                                        {imageUrl ? <img src={this.state.imageUrl} style={{ maxWidth: '100%', maxHeight: '100%' }} alt="avatar" /> : uploadButton}
                                    </Upload>
                                </FormItem>
                            </Col>


                            <Col span={20}>
                                <FormItem
                                    style={{ display: 'none' }}
                                >
                                    {getFieldDecorator('Logo', {

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
                                <FormItem
                                    label={intl.formatMessage({ id: 'event.content.Name' })}
                                    className="formItemLabel"
                                    {...formItemLayout}
                                >
                                    {getFieldDecorator('ClientName', {
                                        rules: [{
                                            //type: 'title', message: 'The input is not valid Title!',
                                        }, {
                                            required: true, message: 'Please input your Name!',
                                        }],
                                    })(
                                        <Input />
                                    )}
                                </FormItem>
                                <FormItem
                                    label={intl.formatMessage({ id: 'event.content.Website' })}
                                    className="formItemLabel"
                                    {...formItemLayout}
                                >
                                    {getFieldDecorator('Website', {
                                        rules: [{
                                            //type: 'title', message: 'The input is not valid Title!',
                                        }, {
                                            required: true, message: 'Please input your website!',
                                        }],
                                    })(
                                        <Input />
                                    )}
                                </FormItem>
                                <FormItem
                                    label={intl.formatMessage({ id: 'event.content.Sponsors description' })}
                                    className="formItemLabel"
                                    {...formItemLayout}
                                >
                                    {getFieldDecorator('Description', {
                                        rules: [{
                                            //type: 'teamName', message: 'The input is not valid teamName!',
                                        }, {
                                            required: true, message: 'Please input your description!',
                                        }],
                                    })(
                                        <TextArea rows={4} />
                                    )}
                                </FormItem>
                                <FormItem
                                    label={intl.formatMessage({ id: 'event.content.Type of sponsorship amount' })}
                                    className="formItemLabel"
                                    {...formItemLayout}
                                >
                                    {getFieldDecorator('SponsorshipType', {

                                    })(
                                        <Select style={{ width: '100%' }} onChange={this.cnySponsor}>
                                            {children}
                                        </Select>
                                    )}
                                </FormItem>
                                <FormItem
                                    label={intl.formatMessage({ id: 'event.content.Sponsorship amount' })}

                                    {...formItemLayout}
                                >
                                    {getFieldDecorator('Sponsorship', {

                                    })(
                                        <InputNumber
                                            formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                            parser={value => value.replace(/\$\s?|(,*)/g, '')}
                                            onChange={this.numberChange}
                                            style={{ width: '100%' }}
                                            min={0}
                                            step={100}
                                        />
                                    )}
                                </FormItem>
                                <FormItem
                                    label={intl.formatMessage({ id: 'event.content.Note' })}
                                    className="formItemLabel"
                                    {...formItemLayout}
                                >
                                    {getFieldDecorator('Remark', {
                                        rules: [{
                                            //type: 'teamName', message: 'The input is not valid teamName!',
                                        }, {
                                            required: true, message: 'Please input your Remark!',
                                        }],
                                    })(
                                        <TextArea rows={4} />
                                    )}
                                </FormItem>
                                <FormItem
                                >
                                    {getFieldDecorator('IsSponsorVisiable', {

                                    })(
                                        <Checkbox
                                            checked={this.state.checked}
                                            onChange={this.hideChange}>
                                            {intl.formatMessage({ id: 'event.content.Hide the sponsor on the event page' })}
                                        </Checkbox>
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                    </Form>
                </Modal>
            </div>
            // <div style={{minHeight:760,overflow:'hidden'}}>
            //     <div>
            // <Row gutter={24}>
            //     <Col xl={24} lg={24} md={24} sm={24} xs={24}>
            //         <Card                    
            //             extra={addOrganization}
            //             title={intl.formatMessage({id:'event.content.Organizations'})}
            //             style={{border:0}}
            //         >
            //         {(eventOrganizationList == null || typeof(eventOrganizationList) === 'undefined' || eventOrganizationList.length<1)?(
            //             <div>暂无数据</div>
            //         ):(
            //             <div>
            //                 {eventOrganizationList.map(item=>(
            //                      <Card
            //                         className="OrangizaCard"
            //                         hoverable
            //                         style={{ width: 145,border:0,marginRight:24 }}
            //                         cover={<img alt="deloitte" src={dePic} />}
            //                         actions={[<a onClick={()=>this.delOrg(item.EventEventOrganizationId)}><Icon type="delete"/></a>]}
            //                     >
            //                         <Meta
            //                         title={item.CompanyName}
            //                         />
            //                     </Card>
            //                 ))}
            //             </div>
            //         )}
            //         </Card>
            //     </Col>
            // </Row>

            // <Row gutter={24}>
            //     <Col xl={24} lg={24} md={24} sm={24} xs={24}>
            //         <Card                    
            //             extra={addCategory}
            //             title={intl.formatMessage({id:'event.content.Organization category'})}
            //             style={{border:0}}
            //         >
            //         {(eventSponsorList == null || typeof(eventSponsorList) === 'undefined' || eventSponsorList.length<1)?(
            //              <div>暂无数据</div>
            //         ):(
            //             <div>
            //                 {eventSponsorList.map(item=>(
            //                 <Card
            //                     className="OrangizaCard"
            //                     hoverable
            //                     style={{ width: 145,border:0,marginRight:24 }}
            //                     cover={<img alt="undefinded" src={item.Logo!=null?item.Logo:unPic} />}
            //                     actions={[<a onClick={()=>this.delSponsor(item.EventSponsorId)}><Icon type="delete"/></a>]}
            //                 >
            //                     <Meta
            //                     title={item.ClientName}
            //                     />
            //                 </Card>
            //                 ))}
            //             </div>
            //         )}
            //         </Card>
            //     </Col>

            // </Row>
            // <Row gutter={24}>
            //     <Col xl={24} lg={24} md={24} sm={24} xs={24}>
            //             <div style={{position:'relative',height:'30px'}}>
            //                 <Button onClick={onValidateForm} className={styles.saveButton}>
            //                 {intl.formatMessage({id:'event.content.Save'})}
            //                 </Button> 
            //             </div>
            //     </Col> 
            // </Row>


            //         </div>                            
            //  </div>
        )
    }
}
export default connect(({ form, loading }) => ({
}))(injectIntl(Step5));