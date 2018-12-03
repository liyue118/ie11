import React, { Component } from 'react';
import { Row, Col ,Select ,Radio,Button ,Input , Table, Icon, Divider, Menu, Dropdown , Avatar } from 'antd';
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
const { Column, ColumnGroup } = Table;
const {Option} = Select;
const menu = (
  <Menu>
    <Menu.Item>
      <a target="_blank" rel="noopener noreferrer" href="#">编辑</a>
    </Menu.Item>
    <Menu.Item>
      <a target="_blank" rel="noopener noreferrer" href="#">查看</a>
    </Menu.Item>
    <Menu.Item>
      <a target="_blank" rel="noopener noreferrer" href="#">作废付款</a>
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
const columns = [
  {
    title: '付款ID',
    dataIndex: 'ID',
  },{
    title: '参与者',
    dataIndex: 'par',
  },{
    title: '付款日期',
    dataIndex: 'date',
  },{
    title: '电话号码',
    dataIndex: 'phoneNumber',
  },{
    title: '付款方式',
    dataIndex: 'payIn',
  },{
    title: '收款人',
    dataIndex: 'payee',
  },{
    title: '付款人',
    dataIndex: 'payer',
  },{
    title: '优惠类型',
    dataIndex: 'discount',
  },{
    title: '金额',
    dataIndex: 'money',
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
      ID: "DW1"+i,
      // avatar:(<Avatar>李琳</Avatar>),
      par:"小李",
      date: '2018-02-21',
      phoneNumber: '163562932',
      payIn:'在线支付',
      payee:"德勤长沙办公室",
      payer:'小李',
      discount:'-',
      money:2000

    });
  }
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
      showCollapse:false,
      isshowCollapse: false,
      isFilter:false,
      isshowFilterChild:false,
    };
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
            item: "在线支付",
            count: 68,
            number:1200
          },
          {
            item: "线下支付",
            count: 15,
            number:856
          }
          
        ];
        const LegendItem=[
         { value:'在线支付：1200笔'},
         { value:'在线支付：1200笔'}
        ]
        console.log(LegendItem);
        const dv = new DataView();
        dv.source(dataR).transform({
          type: "percent",
          field: "number",
          dimension: "item",
          as: "percent"
        });
        const cols = {
          percent: {
            formatter: val => {
              val =parseInt( val * 100) + "%";
              return val;
            }
          }
        };
        return ( 
          <div  className={styles.main} style={{minHeight:"auto"}}>
          <div>
              <div className={styles.Cheaders}>
                    Event
                    <div className={styles.CHRight}>
                        Payment
                    </div>
               </div>
            <Row gutter={24}>
              <Col span={8} offset={3}>
                <div className={styles.yhDiv}>
                        <div>
                        <h2>￥239万</h2>
                      <span>合计付款金额</span>
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
                          />
                            <Guide>
                                <Html
                                position={["50%", "50%"]}
                                html="<div style=&quot;color:#222;font-size:16px;text-align:center;width: 10em;line-height:20px&quot;><h2>2056</h2>合计付款数</div>"
                                alignX="middle"
                                alignY="middle"
                                />
                            </Guide>
                            <Geom
                                type="intervalStack"
                                          position="percent"
                                          color={['item',["#60b8e8","#85BC22"]]}
                                          tooltip={[
                                          "item*percent",
                                          (item, percent) => {
                                              percent = parseInt(percent * 100 )+ "%";
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
                        <Button type="primary" icon="download"  style={{marginLeft:10}}></Button>
                        <Select placeholder='全部付款' style={{width:200,margin:"0 10px"}}>
                                <Option value="1">全部付款</Option>      
                               <Option value="2">全部有效付款</Option>
                               <Option value="3">作废付款</Option> 
                        </Select>
                    </Col>
                    <Col span={24}>
                      <Table rowSelection={rowSelection} columns={columns} dataSource={data} />
                    </Col>
            </Row> 
          </div>
           </div>
        );
      }
}
export default connect(({event = {}, loading }) => ({
}))(injectIntl(Payment)); 