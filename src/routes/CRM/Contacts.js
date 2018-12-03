import React, { Component } from 'react';
import { Row, Col ,Select ,Radio,Button ,Input , Table, Icon, Modal, Menu, Dropdown , Form  } from 'antd';
import AddContacts from './addContacts'
import ShowContactsProfile from './showContactsProfile';
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
import styles from './contacts.less';


const menuWidth=220;
var winH=window.innerHeight-100,Chcount=0;
const Search = Input.Search;
const { Column, ColumnGroup } = Table;
const Option = Select.Option;
const FormItem=Form.Item;
var isShow=false,nowQuery=[],linkSearch;  
  function GetQueryString(search,name)
  {
   var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
  var r = search.substr(1).match(reg);
    if(r!=null)return  unescape(r[2]); return null;
   }
class Contacts extends Component {     
  constructor(props) {
    super(props);
    props.location.query!=undefined?isShow=true:isShow=false;
    linkSearch=GetQueryString(this.props.location.search,'profie')!=null
    this.state = {
      selectedRowKeys: [],
      loading: false,
      showCollapse:false,
      isshowCollapse: false,
      isFilter:false,
      isshowFilterChild:false,
      showProfile:linkSearch,
      pagination: {current: 1, pageSize: 20,total:20},
      tableLoading: false,
      ActionsData:[]
      
    };
  }
  componentDidMount(){
    const{dispatch}=this.props;
    const{pagination}=this.state;
    dispatch({
      type: 'contacts/ContactAllList',
      payload:{
        Filter:'',
        Page:pagination.current,
        ItemsPerPage:pagination.pageSize,
        IsExport:false},
      callback:data=>{
          data!=[]?
          this.setState({pagination:{current: data.Page, pageSize:data.ItemsPerPage,total:data.TotalRecords}})
          :''
      }
    });
  }
  componentWillReceiveProps(props){
    if((GetQueryString(props.location.search,'profie')!=null)!=linkSearch){
      linkSearch=(!linkSearch);
      this.setState({
        showProfile:linkSearch
      })
    }
  }
  handleTableChange = (paginations, filters, sorter) => {
   const{dispatch}=this.props;
    const{pagination}=this.state;
   this.setState({tableLoading:true,
    pagination:{
      ...pagination,
      current:paginations.current
    }});
    dispatch({
      type: 'contacts/ContactAllList',
      payload:{
        Filter:'',
        Page:paginations.current,
        ItemsPerPage:pagination.pageSize,
        IsExport:false},
      callback:data=>{
        this.setState({tableLoading:false})
      }
     
    });
  }

      showModal = () => {
        this.setState({
          ModVisible: true,
        });
      }
    
      handleOk = (e) => {
        this.setState({
          ModVisible: false,
        });
      }
    
      handleCancel = (e) => {
        this.setState({
          ModVisible: false,
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
      onRefTable=(data)=>{
        const{dispatch}=this.props;
        const{pagination}=this.state;
        this.setState({tableLoading:true});
          dispatch({
            type: 'contacts/ContactAllList',
            payload:{
              Filter:'',
              Page:pagination.current,
              ItemsPerPage:pagination.pageSize,
              IsExport:false},
            callback:data=>{
              this.setState({tableLoading:false})
            }
          });
      }
      onSelectChange = (selectedRowKeys) => {
        console.log('selectedRowKeys changed: ', selectedRowKeys);
        selectedRowKeys.length>0?this.setState({isShowBatch:true}):this.setState({isShowBatch:false})
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
      MenuOnClick=(key)=>{
        const {ActionsData}=this.state;
        key=key.key;
        if(key=="Edit"){
          this.AddContacts.OnEdit(ActionsData);
        }else if(key=="Profie"){
          window.open('#/crm/contacts?profie='+ActionsData.PersonId)
        }
      }
      onRef=(ref)=>{
        this.AddContacts=ref;
      }
      getActionsData=(data)=>{
        this.setState({ActionsData:data})
      }
      render() {
        const menu = (
          <Menu onClick={this.MenuOnClick}>
            <Menu.Item key="Profie">
              查看个人信息
            </Menu.Item>
            <Menu.Item key="Edit">编辑
            </Menu.Item>
            <Menu.Item>
              删除
            </Menu.Item>
          </Menu>
        );
        const {selectedRowKeys,showProfile} = this.state;
        const {intl,ContactAllList}=this.props;
        const rowSelection = {
          selectedRowKeys,
          onChange: this.onSelectChange,
        };
        const hasSelected = selectedRowKeys.length > 0;
        const columns = [
        {
            title:"姓",
            dataIndex: 'FirstName',
        },{
          title:"名",
          dataIndex: 'LastName',
        },{
          title: '电子邮箱',
          dataIndex: 'Email',
        },{
          title: '电话',
          dataIndex: 'PhoneNumber',
        },{
          title: '行业',
          dataIndex: 'Industry',
        },{
          title: '公司',
          dataIndex: 'ClientName',
        },{
          title: '角色',
          dataIndex: 'IsSpeaker',
        },{
          title: '动作',
          dataIndex: 'action',
          render: (text, record) => (
            <Dropdown overlay={menu} placement="bottomRight" trigger={['click']} onClick={this.getActionsData.bind(this,text)}>
              <Button className={styles.DactionContent}><Icon type="ellipsis" /></Button>
            </Dropdown>
          ),
        }];
        const { DataView } = DataSet;
        const { Html } = Guide;
        const dataR = [
          {
            item: "金融",
            count: 68,
            color:'#60b8e8'
          },
          {
            item: "IT",
            count: 15,
            color:"#85BC22"
          },
          {
            item: "房地产",
            count: 12,
            color:'#43ac35'
          },
          {
            item: "建筑",
            count: 10,
            color:"#c4d10f"
          },{
            item: "制造业",
            count: 8,
            color:"#15b0b2"
          },{
            item: "其他",
            count: 2,
            color:"#1a94d3"
          },
          
        ];
        const dv = new DataView();
        dv.source(dataR).transform({
          type: "percent",
          field: "count",
          dimension: "item",
          as: "percent"
        });
        const cols = {
          percent: {
            formatter: val => {
              val = val * 100 + "%";
              return val;
            }
          }
        };
        const BatchMenu=(
          <Menu>
              <Menu.Item key="1">批量删除</Menu.Item>
            </Menu>
        )
        return ( 
          <div  className={styles.main} style={{minHeight:"auto"}}>
            {showProfile?(
                <ShowContactsProfile/>
            ):(
          <div>
              <div className={styles.Cheaders}>
                    Event
                    <div className={styles.CHRight}>
                        Contacts
                    </div>
               </div>
            <Row gutter={24}>
              <Col span={8} offset={3}>
                <div className={styles.yhDiv}>
                        <div>
                        <h1>80</h1>
                      <span>本周新增人数</span>
                        </div>
                </div>
              </Col>
              <Col span={8}>
                      <Chart
                            data={dv}
                            height={200}
                            scale={cols}
                            padding={[0,20,0,0]}
                            forceFit={true}
                            >
                            <Coord type={"theta"} radius={0.75} innerRadius={0.75} style={{marginLeft:50}} />
                            <Axis name="percent" />
                            <Tooltip
                                showTitle={false}
                                itemTpl="<li><span style=&quot;background-color:{color};&quot; class=&quot;g2-tooltip-marker&quot;></span>{name}: {value}</li>"
                            />
                            <Legend
                            position="right-center"
                            className='rightLegend'
                            offsetX={-90}
                            offsetY={5}
                            // style={{md：{}}}
                          />
                            <Guide>
                                <Html
                                position={["50%", "50%"]}
                                html="<div style=&quot;color:#222;font-size:16px;text-align:center;width: 10em;line-height:16px&quot;>行业占比</div>"
                                alignX="middle"
                                alignY="middle"
                                />
                            </Guide>
                            <Geom type="intervalStack"
                                  position="percent"
                                  color={['item',["#60b8e8","#85BC22","#43ac35","#c4d10f","#15b0b2","#1a94d3"]]}
                                  tooltip={["item*percent",(item, percent) => {
                                              percent = percent * 100 + "%";
                                              return {
                                                name: item,
                                                value: percent
                                              };
                                          }]}
                                   style={{lineWidth: 1,stroke: "#fff"}}>
        </Geom>
            </Chart>
              </Col>
                 <Col span={24} style={{textAlign:'left',marginBottom:20}}>
                        <AddContacts isShow={false} red="showEdit" onRef={this.onRef} refTable={this.onRefTable}/>
                        <Button type="primary" icon="download"  style={{marginLeft:10}}></Button>
                        <Select placeholder='全部联系人' style={{width:200,margin:"0 10px"}}></Select>
                        {this.state.isShowBatch?
                         <Dropdown.Button  overlay={BatchMenu} trigger={['click']} type='primary'  onClick={this.showModal}>
                         添加到联系人列表
                       </Dropdown.Button>
                        :null}
                         <Modal 
                        title="添加到联系人列表"
                        visible={this.state.ModVisible}
                        onOk={this.handleOk}
                        onCancel={this.handleCancel}
                        width={840}
                        cancelText="取消"
                        okText="确认">

                        <FormItem className={styles.fromItem}  label="选择列表" >
                            <Select  />
                      </FormItem>
                      <Button type="primary" style={{margin:20}}>+新建列表</Button>
                        </Modal>
                    </Col>
                    <Col span={24}>
                      <Table rowSelection={rowSelection} columns={columns} dataSource={ContactAllList} 
                        pagination={this.state.pagination}
                        loading={this.state.tableLoading}
                        onChange={this.handleTableChange}/>
                    </Col>

            </Row> 
          </div>
           )}
           </div>
        );
      }
}
export default connect(({contacts = {}, loading }) => ({
  ContactAllList:contacts.ContactAllList
}))(injectIntl(Contacts)); 