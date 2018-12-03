import React , { PureComponent } from "react";
import {Row,Col,Icon,Tabs,List,Avatar} from 'antd';
import {injectIntl,formatMessage} from 'react-intl';
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
import DataSet from "@antv/data-set"
import { connect } from 'dva';  
import styles from './List.less'
import icon1 from '../../assets/adminicon1.png'
import icon2 from '../../assets/adminicon2.png'
import upicon from '../../assets/icon-up.png'

const TabPane = Tabs.TabPane;
const menuWidth=220;
var winH=window.innerHeight-100,Chcount=0;
const pagesize=parseInt((window.innerHeight-250)/110)>1?parseInt((window.innerHeight-250)/150):1;

class Donut extends React.PureComponent {
  constructor(props) {
    super(props);
    
  }
  state = {
    ChangeWinH:false,
    nowkey:'1009002',
    NumStatistic:[],
    IndustryStatistic:[],
    CityStatistic:[]
  }
  onWindowResize() {
    winH=window.innerHeight-100;
    this.setState({
      ChangeWinH:(Chcount++)
    })
  }
  componentDidMount() {
    this.EventListByStatus(1,"1009002")
    window.addEventListener('resize', this.onWindowResize.bind(this))
  }
  openlink(names){
    const {dispatch}=this.props;
    names=='contacts'?(dispatch(routerRedux.push({
        pathname: '/crm/contacts',
        query:  { isshow: 'true'},
    }))):(dispatch(routerRedux.push({
        pathname: '/crm/company',
        query:  { isshow: 'true'},
    })))
  }
  //
  EventListByStatus =(page,key)=>{

    // modified by jc 前端分页功能移植给后端
    const {dispatch}=this.props;
    this.setState({nowkey:key})
    dispatch({
      type:'homelist/Efeventlist',
      payload: {
        'Filter': key,  //filter对应原来的status 参数还是1009001-4
        'QueryClause': null,
        'OrderBy': '',
        'Page': page,
        'ItemsPerPage': pagesize,
        'IsExport': false
      }
    })
    //EventNumStatistic
    dispatch({
      type:'homelist/EventNumStatistic',
      callback:data=>{
        this.setState({NumStatistic:data})
      }
    })
    //EventIndustryStatistic
    dispatch({
      type:'homelist/EventIndustryStatistic',
      callback:data=>{
        this.setState({IndustryStatistic:data})
      }
    })
    dispatch({
      type:'homelist/EventCityStatistic',
      callback:data=>{
        this.setState({CityStatistic:data})
      }
    })
  }
  render() {
    const {
     eventlistDate,
     page,
     pageSize,
     intl
    } = this.props;
    const {NumStatistic}=this.state;
    const { DataView } = DataSet;
    const { Html } = Guide;
    const data =NumStatistic.NumCharts==undefined?[]:NumStatistic.NumCharts;
    let dv = new DataView(),cols={};
    if(data.length>0){
      dv.source(data).transform({
        type: "percent",
        field: "count",
        dimension: "item",
        as: "percent"
      });
      cols = {
        percent: {
          formatter: val => {
            console.log(val);
            val = val * 100 
            return val;
          }
        }
      };
    }

    const data1 = [
      {
        year: "Consumer",
        sales: 18
      },
      {
        year: "Government",
        sales: 52
      },
      {
        year: "Public Services",
        sales: 61
      },
      {
        year: "Erengy,Resources",
        sales: 145
      },
      {
        year: "Industrials",
        sales: 48
      },
      {
        year: "Life Sciences",
        sales: 38
      },
      {
        year: "Health Care",
        sales: 38
      },
      {
        year: "Financial Services",
        sales: 38
      },
      {
        year: "Other Sevices",
        sales: 38
      }
    ];
    const cols1 = {
      sales: {
        tickInterval: 20
      }
    };
    const data2 = [
      {
        item: "Beijing",
        count: 54,
        color:"#0097a9"
      },
      {
        item: "Changsha",
        count: 12,
        color:"#75787b"
      },
      {
        item: "Chengdu",
        count:8,
        color:'#209d86'
      },
      {
        item: "Chongqing",
        count: 16,
        color:"#046a38"
      },
      {
        item: "Shanghai",
        count: 4,
        color:"#046a38"
      },
      {
        item: "Guangzhou",
        count: 6,
        color:"#046a38"
      },
    ];
    const dv1 = new DataView();
    dv1.source(data2).transform({
      type: "percent",
      field: "count",
      dimension: "item",
      as: "percent"
    });
    const cols2 = {
      percent: {
        formatter: val => {
          val = val * 100 + "%";
          return val;
        }
      }
    };
    const DLinelabelX = {
      offset: 12, // 数值，设置坐标轴文本 label 距离坐标轴线的距离
      // 设置文本的显示样式，还可以是个回调函数，回调函数的参数为该坐标轴对应字段的数值
      textStyle: {
        textAlign: 'end', // 文本对齐方向，可取值为： start center end
        fill: 'rgba(0,0,0,0.65)', // 文本的颜色
        fontSize: '11', // 文本大小
        rotate:-35,
        textBaseline: 'center' // 文本基准线，可取 top middle bottom，默认为middle
      },
      autoRotate:false
      }
      const DlinelabelY = {
      offset: 5, // 数值，设置坐标轴文本 label 距离坐标轴线的距离
      // 设置文本的显示样式，还可以是个回调函数，回调函数的参数为该坐标轴对应字段的数值
      textStyle: {
        fill: 'rgba(0,0,0,0.65)', // 文本的颜色
        
        
      }
    }
    //自定义shape
    Shape.registerShape('interval', 'ivborderRadius', {
        draw(cfg, container) {
          const points = cfg.points;
          let path = [];
          path.push(['M', points[0].x, points[0].y]);
          path.push(['L', points[1].x, points[1].y]);
          path.push(['L', points[2].x, points[2].y]);
          path.push(['L', points[3].x, points[3].y]);
          path.push('Z');
          path = this.parsePath(path); // 将 0 - 1 转化为画布坐标
          return container.addShape('rect', {
            attrs: {
              x: path[1][1], // 矩形起始点为左上角
              y: path[1][2],
              width: path[2][1] - path[1][1],
              height: path[0][2] - path[1][2],
              fill: cfg.color,
              radius: (path[2][1] - path[1][1]) / 2,
            }
          });
        },
      });
    const vlist = () => (
      <List
          itemLayout="horizontal"
          dataSource={eventlistDate}
          size="large"
          pagination={{
            onChange: (page) => {
                this.EventListByStatus(page,this.state.nowkey)
             },
             pageSize: pagesize,
             total: page.TotalRecords,            
          }}
          renderItem={(item) => (
            <List.Item style={{height:150}}> 
              <List.Item.Meta
                avatar={<Avatar src={item.EventImage} style={{height:"120px"}} />}
                title={<Row gutter={24}>
                  <Col span={15} style={{fontWeight:'bold'}}>
                    <div>
                      <a href={'/#/createEvent/setUp/general?id='+item.EventId+'&eventstatus=' + item.Status}>{item.Title.length>28?item.Title.substr(0,28)+"...":item.Title}</a>
                    </div>
                  </Col>
                  <Col span={9} style={{textAlign:'right',color:'rgba(0,0,0,0.3)',fontSize:12,overflow:"hidden",maxHeight:"2.5rem"}}>
                    {item.Venue}
                  </Col>
                </Row>}
                description={item.SubTitle}
              />
            </List.Item>
          )}
      />
    );
    const up_img='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA0AAAAPCAYAAAA/I0V3AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQyIDc5LjE2MDkyNCwgMjAxNy8wNy8xMy0wMTowNjozOSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTggKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkJFODAzRjBBQTlDMDExRTg4OUNGOUVDNTFGMUMzQ0UyIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkJFODAzRjBCQTlDMDExRTg4OUNGOUVDNTFGMUMzQ0UyIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6QkU4MDNGMDhBOUMwMTFFODg5Q0Y5RUM1MUYxQzNDRTIiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6QkU4MDNGMDlBOUMwMTFFODg5Q0Y5RUM1MUYxQzNDRTIiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz6cG7BRAAABA0lEQVR42mL4//8/Azp+9/254uzz2Sc+/Hgli02eiQENfPn1Xnzx5dLdTz5fN190uXjv198fRNHVoGj68ecr/+Irpbvf/XimDOK//f5UdcmV8p0gcayafv/7ybX0auW2l1/v6yIreP7ljuHya9WbQfIomv7+/8O28lr9usefrloxYAEPP162XX29aRVIHVjTv///mNfdbF985/1pdwY84Na7E94bbnXNBwYFI7NJtMCMi692xTEQAV4Bnf79z0cRRlAQwsCLr3cMZpxLP4+uOMNopqEEt8oFrKFHLBj2mpgYWX5jU8TCxP4dpyYRTrkbqoJm25HF1IQstghzytxGFgMIMAC+CpNd6b7WxwAAAABJRU5ErkJggg==';
    return (
      <div>
        <div data-change={this.state.ChangeWinH} style={{padding:'24px 24px 0'}}>
            <Row gutter={24} style={{overflow:'hidden',width:'auto',marginRight:0}}>
            <Col xl={7} md={10} sm={12} xs={24} style={{textAlign:'center'}}>
                <div className={styles.flexF} style={{height:winH}}>
                  <div className={`${styles.firstCharts} ${styles.flexC}`}>
                  <div className={styles.dtitle}>
                    <div className={styles.dtitleDiv}>{intl.formatMessage({id:'event.home.event'})}</div>
                    </div>
                    <div style={{position:'relative',height:(winH-100)/2.5*0.95}} ref="thisDiv">
                      {data.length>0?
                        <Chart
                        data={dv}
                        height={winH/7*3-80}
                        scale={cols}
                        padding={[0,0,0,0]}
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
                          offsetX={-110}
                          offsetY={5}
                          // style={{md：{}}}
                        />
                          <Guide>
                              <Html
                              position={["50%", "50%"]}
                              html={'<div style="color:#222;font-size:16px;text-align:center;width: 10em;line-height:16px"><div>'+NumStatistic.EventNumData.Total+'<span style="color:#86bc25;font-size:10px;line-height:10px;display:inline-block"><span style="display:inline-block">'+NumStatistic.EventNumData.ThisWeekEvents+'</span><br/><span style="background:url('+up_img+') no-repeat;width:10px;height:10px;display:inline-block;background-size:100%"></span></span> </div><span style="color:#262626;font-size:12px">Event</span></div>'}
                              alignX="middle"
                              alignY="middle"
                              />
                          </Guide>
                          <Geom
                              type="intervalStack"
                              position="percent"
                              color={['item',["#62b5e5","#1a94d3","#14b1b1","#86bc25"]]}
                              tooltip={[
                              "item*percent",
                              (item, percent) => {
                                  percent =parseInt(percent* 100) + "%";
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
                      </Chart>:''
                      }

                  <a style={{color:'rgba(0, 0, 0, 0.3)',fontSize:12}} href="/#/event/create"><Icon type="plus" className={styles.eventsAdd} />{intl.formatMessage({id:'event.createEvent'})}</a>
                    </div>
                  </div>
                  <div className={styles.flexC}>
                  <div className={styles.dtitle}>
                    <div className={styles.dtitleDiv}>{intl.formatMessage({id:'event.home.company'})}</div>
                  </div>
                  <div className={styles.cirD}>
                  
                  <div className='div-cir'>
                      <img src={icon1}/>
                      <div className="common-d">
                        <div>2143</div>
                          <div className="up">
                            <span>23</span><br/>
                            <img src={upicon}/>
                        </div>
                      </div>
                    </div>  
                  </div>
                  <a className={styles.addIcon} href="/#/crm/company"><Icon type="plus"  />{intl.formatMessage({id:'event.home.addCompany'})}</a>
                  </div>
                  <div className={styles.flexC}>
                  <div className={styles.dtitle}>
                    <div className={styles.dtitleDiv}>{intl.formatMessage({id:'event.home.contact'})}</div>
                  </div>
                  <div className={styles.cirD}>
                      <div className='div-cir'>
                        <img src={icon2}/>
                            <div className="common-d">
                            <div>18</div>
                            <div className="up">
                                  <span>123</span><br/>
                                  <img src={upicon}/>
                            </div>
                        </div>
                      </div>

                  </div>
                  <a className={styles.addIcon} href="/#/crm/contacts"><Icon type="plus"  /> {intl.formatMessage({id:'event.home.addContact'})}</a>
                  </div>
                </div>
          </Col>
          
          <Col xl={10} md={14} sm={12} xs={24} style={{paddingLeft:0}}>
          <div style={{border:'1px solid rgba(0,0,0,0.3)',borderRadius:5,height:winH}}>
          <div className={styles.dtitle}>
              <div className={styles.dtitleDiv}>{intl.formatMessage({id:'event.home.eventlist'})}</div>
          </div>
              <Tabs defaultActiveKey="1009002" onChange={this.EventListByStatus.bind(this,1)} style={{paddingBottom:5}}>
                <TabPane tab={intl.formatMessage({id:'event.home.Upcoming'})} key="1009002">
                  {vlist(eventlistDate,page,pageSize)}
                </TabPane>
                <TabPane tab={intl.formatMessage({id:'event.home.InProgress'})} key="1009003">
                  {vlist(eventlistDate,page,pageSize)}
                </TabPane>
                <TabPane tab={intl.formatMessage({id:'event.home.past'})} key="1009004">
                  {vlist(eventlistDate,page,pageSize)}
                </TabPane>
              </Tabs>
          </div>     
          </Col>
          <Col xl={7} md={24} sm={24} xs={24}>
          <Row gutter={24} style={{height:winH}} className={styles.flexF}>
          <Col xl={24} md={12} sm={12} xs={24}  className={styles.flexC}>
              <div>
            <div className={styles.dtitle}>
              <div className={styles.dtitleDiv} style={{width:'9.5rem'}}>{intl.formatMessage({id:'event.home.industryAnalysis'})}</div>
          </div>
          <Chart height={winH/2-30} data={data1} scale={cols1} padding={[20,10,75,30]}
          forceFit>
          <Axis name="year" label={DLinelabelX} />
                <Axis name="sales" label={DlinelabelY} />
              <Tooltip
                crosshairs={{
                  type: "y"
                  
                }}
              />
              <Geom type="interval" position="year*sales" 
              color={['sales', (cut)=>{
                if(cut==145){
                  return "#86bc25"
                } 
                if(cut==18){
                  return "#62b5e5"
                }
                return '#15b0b2'
                }]}
              >
              <Label content="sales"
              offset={12}
                formatter={(text, item, index)=>{
                  if(text==145 || text==18)
                  return text;
                }}
              />
              </Geom>
            </Chart>
          </div>
              </Col>      
        <Col  xl={24} md={12} sm={12} xs={24} className={styles.flexC}>
        <div>
          <div className={styles.dtitle}>
              <div className={styles.dtitleDiv} style={{width:'8rem'}}>{intl.formatMessage({id:'event.home.cityAnalysis'})}</div>
          </div>
        <div>
        <Chart
              height={winH/2}
              data={dv1}
              scale={cols2}
              padding={[30,80,30,30]}
              style={{marginLeft:-20,marginTop:-20}}
              forceFit={true}      
            >
              <Coord type="theta" radius={0.75} />
              <Axis name="percent" />
              <Legend
                position="right-center"
              className='rightLegend'
              offsetX={-40}
              />
              <Tooltip
                showTitle={false}
                itemTpl="<li><span style=&quot;background-color:{color};&quot; class=&quot;g2-tooltip-marker&quot;></span>{name}: {value}</li>"
              />
              <Geom
                type="intervalStack"
                position="percent"
                color={['item',["#62b5e5","#26caf9","#39cec7","#dad480","#8be46a","#17be8c"]]}
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
                <Label
                  content="percent"
                  offset={-40}
                  textStyle={{
                    rotate: 0,
                    textAlign: "center",
                    shadowBlur: 2,
                    shadowColor: "rgba(0, 0, 0, .45)"
                  }}
                />
              </Geom>
            </Chart>
            </div>  
          </div>
          </Col>
        </Row>
        </Col>
        </Row>
        </div>
        <div style={{textAlign:'center',margin:'20px'}}>
        © Deloitte China 2018 
        </div>
      </div>   
        
    );
  }
}

export default connect(({homelist = {}, loading }) => ({
  eventlistDate:homelist.eventlistDate,
  pageSize: homelist.pageSize,
  page: homelist.page,
  
}))(injectIntl(Donut)); 
