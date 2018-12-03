import React, { Component } from 'react';
import { Row, Col ,Select ,Radio,Button ,Input , Table, Icon, Divider, Menu, Dropdown , Avatar } from 'antd';
import Addcompany from './addCompany'
import ShowCompanyProfile from './showCompanyProfile';
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
const menu = (
  <Menu>
    <Menu.Item>
      <a target="_blank" rel="noopener noreferrer" href="#/crm/company?profie=121">查看公司信息</a>
    </Menu.Item>
    <Menu.Item>
      <a target="_blank" rel="noopener noreferrer" href="#">删除</a>
    </Menu.Item>
  </Menu>
);
const Dmenu = (
  <Menu>
  <Menu.Item>
    <a target="_blank" rel="noopener noreferrer" href="#">Change Owner</a>
  </Menu.Item>
  <Menu.Item>
    <a target="_blank" rel="noopener noreferrer" href="#">Merge Companies</a>
  </Menu.Item>
  <Menu.Item>
    <a target="_blank" rel="noopener noreferrer" href="#">Delete</a>
  </Menu.Item>
  </Menu>
)
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
const columns = [{
    title: '名称',
    dataIndex: 'firstname',
  },{
    title: '行业',
    dataIndex: 'lastname',
  },{
    title: '电话号码',
    dataIndex: 'phoneNumber',
  },{
    title: '电子邮箱',
    dataIndex: 'email',
  },{
    title: '是否是赞助商',
    dataIndex: 'industry',
  },{
    title: '动作',
    dataIndex: 'action',
    render: (text, record) => (
      <Dropdown overlay={menu} placement="bottomRight" trigger={['click']}>
      <Button className={styles.DactionContent}><Icon type="ellipsis" /></Button>
      </Dropdown>
    ),
  }];
  
  const data = [];
  for (let i = 0; i < 46; i++) {
    data.push({
      key: i,
      // avatar:(<Avatar>李琳</Avatar>),
      firstname:"金融公司",
      lastname: '金融',
      email: `licail@agile.com`,
      phoneNumber:'+86 185012397992',
      industry:"否",
    });
  }
  var isShow=false,nowQuery=[],linkSearch;  
  function GetQueryString(search,name)
  {
   var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
  var r = search.substr(1).match(reg);
    if(r!=null)return  unescape(r[2]); return null;
   }
class Companies extends Component {     
  constructor(props) {
    super(props);
    props.location.query!=undefined?isShow=true:isShow=false;
    linkSearch=GetQueryString(this.props.location.search,'profie')!=null
    this.state = {
      selectedRowKeys: [], // Check here to configure the default column
      loading: false,
      showCollapse:false,
      isshowCollapse: false,
      isFilter:false,
      isshowFilterChild:false,
      showProfile:linkSearch
    };
  }
  componentWillReceiveProps(props){
    if((GetQueryString(props.location.search,'profie')!=null)!=linkSearch){
      linkSearch=(!linkSearch);
      this.setState({
        showProfile:linkSearch
      })
    }
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
        const {intl}=this.props;
        const rowSelection = {
          selectedRowKeys,
          onChange: this.onSelectChange,
        };
        const hasSelected = selectedRowKeys.length > 0;
        
        const SettingMenu=(
          <Menu>
             <Menu.Item>
                <a target="_blank" rel="noopener noreferrer" href="#" style={{color:"rgba(0, 0, 0, 0.65)"}}>Manage displayed columns</a>
              </Menu.Item>
              <Menu.Item>
                <a target="_blank" rel="noopener noreferrer" href="#" style={{color:"rgba(0, 0, 0, 0.65)"}}>configure company fields settings</a>
              </Menu.Item>
          </Menu>
        )
        
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
        return ( 
          <div  className={styles.main} style={{minHeight:"auto"}}>
            {this.state.showProfile?(
                <ShowCompanyProfile/>
            ):(
          <div>
              <div className={styles.Cheaders}>
                    Event
                    <div className={styles.CHRight}>
                        Companies
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
                            <Geom
                                type="intervalStack"
                                          position="percent"
                                          color={['item',["#60b8e8","#85BC22","#43ac35","#c4d10f","#15b0b2","#1a94d3"]]}
                                          tooltip={[
                                          "item*percent",
                                          (item, percent) => {
                                              percent = percent * 100 + "%";
                                              return {
                                              name: item,
                                              value: percent
                                              };
                                          }
                                          ]}
                                          style={{
                                          lineWidth: 1,
                                          stroke: "#fff"
                                          }}
                            >
        </Geom>
            </Chart>
              </Col>

                 <Col span={24} style={{textAlign:'left',marginBottom:20}}>
                        <Addcompany/>
                        <Button type="primary" icon="download"  style={{marginLeft:10}}></Button>
                        <Select placeholder='全部联系人' style={{width:200,margin:"0 10px"}}></Select>
                    </Col>
                    <Col span={24}>
                      <Table rowSelection={rowSelection} columns={columns} dataSource={data} />
                    </Col>
            </Row>    

              
            {/* <Row style={{ marginBottom: 16 }} gutter={24}>
                <Col span={12}><h3>ALL Contacts</h3>
               <span className={hasSelected?styles.tableAddtolistSelectedV:styles.tableAddtolistSelectedH}>
                  <span style={{marginLeft:8,color:"blue"}}>{selectedRowKeys.length} Selected</span>
                    <Dropdown overlay={Dmenu} placement="bottomLeft" className={styles.selectedDropdowm}>
                      <Button style={{ marginLeft: 8 }}>
                      Add To List <Icon type="down" />
                      </Button>
                  </Dropdown>
               </span>
                 </Col>
                 <Col span={12}  style={{textAlign:"right"}} >
                 <CRMPublicC showCollapse={this.showCollapse}/>
                  <AddContacts isShow={isShow}/></Col>
            </Row>
            <Table rowSelection={rowSelection} columns={columns} dataSource={data} /> */}
          </div>
           )}
           </div>
        );
      }
}
export default connect(({contacts = {}, loading }) => ({
  
}))(injectIntl(Companies)); 