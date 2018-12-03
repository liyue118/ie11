import React, { Component } from 'react';
import { Row,Col,Form,Button,Card,Alert,Modal,Input, Icon,Select,Badge,
    Divider,} from 'antd';
import { connect } from 'dva';
import StandardTable from '../../../components/StandardTable';
import styles from './index.less'

const FormItem = Form.Item;
const Search = Input.Search;
const Option = Select.Option;
const status = ['已发送', '未发送','异常'];    
@Form.create()
class Invitation extends Component{
    state={
        Invitation:0,
        visible: false,
        ContactModal:false,
        data: [],
        value: undefined,
        selectedRows: [],
    }
    openInvation = () => {
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
    columns = [
        {
          title: '姓',
          dataIndex: 'name',
        },
        {
          title: '名',
          dataIndex: 'desc',
        },
        {
          title: '电子邮箱',
          dataIndex: 'email',
          sorter: true,
          align: 'right',
          //render: val => `${val} 万`,
          // mark to display a total number
          needTotal: true,
        },
        {
          title: '公司',
          dataIndex: 'updatedAt',
          sorter: true,
          //render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
        },
        {
            title: '营销邮件名称',
            dataIndex: 'updated',
            sorter: true,
            //render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
        },
        {
            title: '邀请状态',
            dataIndex: 'status',
            filters: [
              {
                text: status[0],
                value: 0,
              },
              {
                text: status[1],
                value: 1,
              },
              {
                text: status[2],
                value: 2,
              }
            ],
            render(val) {
              return <Badge status={statusMap[val]} text={status[val]} />;
            },
          },
        {
          title: '操作',
          render: (text, record) => (
            <Fragment>
              <a onClick="">配置</a>
              <Divider type="vertical" />
              <a onClick="">删除</a>
            </Fragment>
          ),
        },
      ];
      tableListDataSource = [{
        key: 1,
        name: `TradeCode`,
        email:'13121511868@163.com',
        owner: '曲丽丽',
        desc: '这是一段描述',
        callNo: Math.floor(Math.random() * 1000),
        status: Math.floor(Math.random() * 10) % 4,
        progress: Math.ceil(Math.random() * 100),
      }]
    invationChange(value) {
        console.log(`selected ${value}`);
    }
    handleStandardTableChange = (pagination, filtersArg, sorter) => {
        const { dispatch } = this.props;
        const { formValues } = this.state;
    
        const filters = Object.keys(filtersArg).reduce((obj, key) => {
          const newObj = { ...obj };
          newObj[key] = getValue(filtersArg[key]);
          return newObj;
        }, {});
    
        const params = {
          currentPage: pagination.current,
          pageSize: pagination.pageSize,
          ...formValues,
          ...filters,
        };
        if (sorter.field) {
          params.sorter = `${sorter.field}_${sorter.order}`;
        }
      };
    render(){
        const { selectedRows } = this.state;
        const { form,location } = this.props;
        const { getFieldDecorator} = form;
        const formItemLayout = {
          wrapperCol: {
              xs: { span: 24 },
              sm: { span: 24 },
            }
          };
        return(
            <div>
                <div className={styles.Cheaders}>
                    Event
                    <div className={styles.CHRight}>
                        邀请人列表
                    </div>
               </div>
                <Row gutter={24}>
                    <Col span={24} style={{margin:12}}>
                        <Button icon="plus-circle" type="primary" onClick={this.openInvation}>新增邀请人</Button>
                        <Button icon="download"  type="primary" style={{marginLeft:3}}></Button>
                        <Select defaultValue="全部邀请" style={{ width: 240,marginLeft:3 }} onChange={this.invationChange}>
                            <Option value="all">全部邀请</Option>
                            <Option value="1">未发送</Option>
                            <Option value="2">已发送</Option>
                        </Select>
                    </Col>
                </Row>
                <Row gutter={24}>
                    <Col span={24}>
                    <StandardTable
                        selectedRows={selectedRows}
                        data={this.tableListDataSource}
                        columns={this.columns}
                        //onChange={this.handleStandardTableChange}
                    />
                    </Col>
                </Row>
                <Modal
                  title="添加联系人"
                  visible={this.state.visible}
                  onOk={this.handleOk}
                  onCancel={this.handleCancel}
                  width={700}
                >
                  <p>个人信息</p>
                  <Form onSubmit={this.handleSubmit}>
                    <FormItem
                      {...formItemLayout}
                    >
                      <Row gutter={24}>
                          <Col span={12}>
                            {getFieldDecorator('name', {
                              rules: [{
                              type: 'name', message: '',
                            }, {
                              required: true, message: 'Please input your name!',
                            }],
                          })(
                            <Input addonBefore="姓"/>
                          )}
                          </Col>
                          <Col span={12}>
                            {getFieldDecorator('name', {
                              rules: [{
                              type: 'name', message: '',
                            }, {
                                required: true, message: 'Please input your name!',
                            }],
                              })(
                                <Input  addonBefore="名"/>
                            )}
                          </Col>
                          </Row>    
                    </FormItem>
                    
                    <FormItem
                      {...formItemLayout}
                    >
                      <Row gutter={24}>
                          <Col span={12}>
                            {getFieldDecorator('email', {
                              rules: [{
                              type: 'email', message: '',
                            }, {
                              required: true, message: 'Please input your email!',
                            }],
                          })(
                            <Input addonBefore="电子邮箱"/>
                          )}
                          </Col>
                          <Col span={12}>
                            {getFieldDecorator('tel', {
                              rules: [{
                              type: 'tel', message: '',
                            }, {
                                required: true, message: 'Please input your tel!',
                            }],
                              })(
                                <Input addonBefore="电话"/>
                            )}
                          </Col>
                      </Row>    
                    </FormItem>

                    <FormItem
                      {...formItemLayout}
                    >
                      <Row gutter={24}>
                          <Col span={12}>
                            {getFieldDecorator('company', {
                              rules: [{
                              type: 'company', message: '',
                            }, {
                              required: true, message: 'Please input your company!',
                            }],
                          })(
                            <Input addonBefore="公司"/>
                          )}
                          </Col>
                          <Col span={12}>
                            {getFieldDecorator('position', {
                              rules: [{
                              type: 'position', message: '',
                            }, {
                                required: true, message: 'Please input your position!',
                            }],
                              })(
                                <Input addonBefore="职位"/>
                            )}
                          </Col>
                      </Row>    
                    </FormItem>

                    <FormItem
                      {...formItemLayout}
                    >
                      <Row gutter={24}>
                          <Col span={12}>
                            {getFieldDecorator('job', {
                              rules: [{
                              type: 'job', message: '',
                            }, {
                              required: true, message: 'Please input your job!',
                            }],
                          })(
                            <Select defaultValue="1" style={{ width: '100%' }} onChange={this.changeJob}>
                              <Option value="1">所属行业</Option>
                            </Select>
                          )}
                          </Col>
                          <Col span={12}>
                            {getFieldDecorator('name', {
                              rules: [{
                              type: 'name', message: '',
                            }, {
                                required: true, message: 'Please input your name!',
                            }],
                              })(
                                <Input addonBefore="公司电话"/>
                            )}
                          </Col>
                      </Row>    
                    </FormItem>

                    <FormItem
                      {...formItemLayout}
                    >
                      <Row gutter={24}>
                          <Col span={12}>
                            {getFieldDecorator('address', {
                              rules: [{
                              type: 'address', message: '',
                            }, {
                              required: true, message: 'Please input your address!',
                            }],
                          })(
                            <Input addonBefore="个人地址"/>
                          )}
                          </Col>
                          <Col span={12}>
                            {getFieldDecorator('comAdress', {
                              rules: [{
                              type: 'comAdress', message: '',
                            }, {
                                required: true, message: 'Please input your comAdress!',
                            }],
                              })(
                                <Input addonBefore="公司地址"/>
                            )}
                          </Col>
                      </Row>    
                    </FormItem>
                    <p style={{marginTop:12}}>其他信息</p>

                    <FormItem
                      {...formItemLayout}
                    >
                      <Row gutter={24}>
                          <Col span={12}>
                            {getFieldDecorator('address', {
                              rules: [{
                              type: 'address', message: '',
                            }, {
                              required: true, message: 'Please input your address!',
                            }],
                          })(
                            <Select defaultValue="1" style={{ width: '100%' }} onChange={this.changeContact}>
                              <Option value="1">指派联系人</Option>
                            </Select>
                          )}
                          </Col>
                          <Col span={12}>
                            {getFieldDecorator('contactList', {
                              rules: [{
                              type: 'contactList', message: '',
                            }, {
                                required: true, message: 'Please input your contactList!',
                            }],
                              })(
                                <Input addonBefore="添加到联系人列表"/>
                            )}
                          </Col>
                      </Row>    
                    </FormItem>

                    <FormItem
                      {...formItemLayout}
                    >
                      <Row gutter={24}>
                          <Col span={12}>
                            {getFieldDecorator('address', {
                              rules: [{
                              type: 'address', message: '',
                            }, {
                              required: true, message: 'Please input your address!',
                            }],
                          })(
                            <Input addonBefore="增值税发票6位开票码"/>
                          )}
                          </Col>
                          <Col span={12}>
                            {getFieldDecorator('contactList', {
                              rules: [{
                              type: 'contactList', message: '',
                            }, {
                                required: true, message: 'Please input your contactList!',
                            }],
                              })(
                                <Input addonBefore="公司注册登记全名"/>
                            )}
                          </Col>
                      </Row>    
                    </FormItem>

                    <FormItem
                      {...formItemLayout}
                    >
                      <Row gutter={24}>
                          <Col span={12}>
                            {getFieldDecorator('address', {
                              rules: [{
                              type: 'address', message: '',
                            }, {
                              required: true, message: 'Please input your address!',
                            }],
                          })(
                            <Input addonBefore="纳税人识别码"/>
                          )}
                          </Col>
                          <Col span={12}>
                            {getFieldDecorator('contactList', {
                              rules: [{
                              type: 'contactList', message: '',
                            }, {
                                required: true, message: 'Please input your contactList!',
                            }],
                              })(
                                <Input addonBefore="发票邮寄地址"/>
                            )}
                          </Col>
                      </Row>    
                    </FormItem>

                    <FormItem
                      {...formItemLayout}
                    >
                      <Row gutter={24}>
                          <Col span={12}>
                            {getFieldDecorator('address', {
                              rules: [{
                              type: 'address', message: '',
                            }, {
                              required: true, message: 'Please input your address!',
                            }],
                          })(
                            <Input addonBefore="开户行名称"/>
                          )}
                          </Col>
                          <Col span={12}>
                            {getFieldDecorator('contactList', {
                              rules: [{
                              type: 'contactList', message: '',
                            }, {
                                required: true, message: 'Please input your contactList!',
                            }],
                              })(
                                <Input addonBefore="银行账户"/>
                            )}
                          </Col>
                      </Row>    
                    </FormItem>
                  </Form>
                </Modal>
            </div>    
        )
    }
}

export default connect()(Invitation);
  