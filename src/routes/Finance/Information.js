import React, { Component } from 'react';
import { Row, Col ,Select ,Radio,Button ,Input , Table, Icon, Divider, Menu, Dropdown , Modal ,Form} from 'antd';
import {
  G2,
  Chart,
  Geom,
  Axis,
  Tooltip,
  Coord,
  Label,
  Legend,
  View,
  Guide,
  Shape 
} from "bizcharts";
import DataSet from "@antv/data-set";
import { connect } from 'dva';
import {injectIntl,formatMessage} from 'react-intl';
import styles from './payment.less';


const menuWidth=220;
var winH=window.innerHeight-100,Chcount=0;
const Search = Input.Search;
const FormItem=Form.Item;
const {Option} = Select;
const menu = (
  <Menu>
    <Menu.Item>
      <a target="_blank" rel="noopener noreferrer" href="#">查看</a>
    </Menu.Item>
    <Menu.Item>
      <a target="_blank" rel="noopener noreferrer" href="#">修改</a>
    </Menu.Item>
    <Menu.Item>
      <a target="_blank" rel="noopener noreferrer" href="#">删除</a>
    </Menu.Item>
  </Menu>
);

const Fmenu = (
  <Menu>
    <Menu.Item>
      <Radio>Owner</Radio>
    </Menu.Item>
    <Menu.Item>
      <Radio>Owner</Radio>
    </Menu.Item>
    <Menu.Item>
      <Radio>Owner</Radio>
    </Menu.Item>
    </Menu>
  )
const columns = [
  {
    title: '德勤实体',
    dataIndex: 'CompanyName',
  },{
    title: '描述',
    dataIndex: 'Description',
  },{
    title: '开户银行',
    dataIndex: 'BankName',
  },{
    title: '银行账号',
    dataIndex: 'AccountNumber',
  },{
    title: '账户名称',
    dataIndex: 'AccountName',
  },{
    title: '动作',
    dataIndex: 'action',
    render: (text, record) => (
      <Dropdown overlay={menu} placement="bottomRight" trigger={['click']}>
      <Button className={styles.DactionContent}><Icon type="ellipsis" /></Button>
      </Dropdown>
    ),
  }];
  
  // const data = [];
  // for (let i = 0; i < 46; i++) {
  //   data.push({
  //     ID: "DW1"+i,
  //     // avatar:(<Avatar>李琳</Avatar>),
  //     par:"小李",
  //     date: '2018-02-21',
  //     phoneNumber: '163562932',
  //     payIn:'在线支付',
  //     payee:"德勤长沙办公室",
  //     payer:'小李',
  //     discount:'-',
  //     money:2000

  //   });
  // }
  var isShow=false,nowQuery=[]; 
  function GetQueryString(search,name)
  {
   var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
  var r = search.substr(1).match(reg);
    if(r!=null)return  unescape(r[2]); return null;
   }
class Payment extends Component {     
  constructor(props) {
    super(props);
    props.location.query!=undefined?isShow=true:isShow=false;
    this.state = {
      selectedRowKeys: [], // Check here to configure the default column
      loading: false,
      modelVisable:false
    };
  }
  componentDidMount(){
    const  {dispatch } = this.props;
    dispatch({
          type:'event/DeloitteEntityBankAccount',
        }) 
  }
  showModal = () => {
    this.setState({
      modelVisable: true,
    });
  }

  handleOk = (e) => {
    this.setState({
      modelVisable: false,
    });
  }

  handleCancel = (e) => {
    this.setState({
      modelVisable: false,
    });
  }
      start = () => {
        this.setState({ loading: false });
        // ajax request after empty completing
        setTimeout(() => {
          this.setState({
            selectedRowKeys: [],
            loading: false,
          });
        }, 1000);
      }
      showCollapse = () => {
        this.setState({
          isshowCollapse:!this.state.isshowCollapse
        })
      }
      onSelectChange = (selectedRowKeys) => {
        console.log('selectedRowKeys changed: ', selectedRowKeys);
        this.setState({ selectedRowKeys });
      }
      //FILTER
      handleSelectChange=()=>{
        this.setState({
          isshowFilterChild:true
        })
      }
      filterClick=()=>{
        console.log(this.state.isFilter);
        this.setState({
          isFilter:true
        })
      }
      render() {
        const {selectedRowKeys } = this.state;
        const {intl,BankList}=this.props;
        const rowSelection = {
          selectedRowKeys,
          onChange: this.onSelectChange,
        };
        const hasSelected = selectedRowKeys.length > 0;
        return ( 
          <div  className={styles.main} style={{minHeight:"auto"}}>
          <div>
              <div className={styles.Cheaders}>
                    Event
                    <div className={styles.CHRight}>
                        Information
                    </div>
               </div>
            <Row gutter={24}>

                 <Col span={24} style={{textAlign:'left',marginBottom:20,marginTop:20}}>
                       <Button type="primary" style={{marginLeft:10}} onClick={this.showModal}>+新增收款单位</Button>
                        <Button type="primary" icon="download"  style={{marginLeft:10}}></Button>
                        <Modal 
                      title="新增付款单位"
                      visible={this.state.modelVisable}
                      onOk={this.handleOk}
                      onCancel={this.handleCancel}
                      width={840}
                      cancelText="取消"
                      okText="确认">
                      <Form>
                        <Row gutter={24}>
                          <Col span={24}>
                            <FormItem className={styles.fromItem}  label="名称" >
                              <Input  />
                            </FormItem>
                          </Col>
                          <Col span={12}>
                            <FormItem className={styles.fromItem}  label="开户行" >
                              <Input  />
                            </FormItem>
                          </Col>
                          <Col span={12}>
                            <FormItem className={styles.fromItem}  label="描述" >
                              <Input  />
                            </FormItem>
                          </Col>
                          <Col span={12}>
                            <FormItem className={styles.fromItem}  label="银行名称" >
                              <Input  />
                            </FormItem>
                          </Col>
                          <Col span={12}>
                            <FormItem className={styles.fromItem}  label="银行账号" >
                              <Input  />
                            </FormItem>
                          </Col>
                          </Row>
                          </Form>
                        </Modal>
                    </Col>
                    <Col span={24}>
                      <Table rowSelection={rowSelection} columns={columns} dataSource={BankList} />
                    </Col>
            </Row> 
          </div>
           </div>
        );
      }
}
export default connect(({event = {}, loading }) => ({
  BankList:event.BankList
}))(injectIntl(Payment)); 