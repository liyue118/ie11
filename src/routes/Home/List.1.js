import React , { PureComponent } from "react";
import {Row,Col,Icon,Tabs,List,Avatar} from 'antd';
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
import robit from '../../assets/photorobit.png'

const TabPane = Tabs.TabPane;
const menuWidth=220;
var winH=window.innerHeight,winW=window.innerWidth;

class Donut extends React.PureComponent {
  constructor(props) {
    super(props);
    console.log(props);
  }
  state = {
    forceFit:false
  }
  onWindowResize() {
    winH=window.innerHeight;
    console.log(winH);
    this.setState({
      forceFit:true
    })
  }
  componentDidMount() {
    this.setState({
      forceFit:true
    })
    window.addEventListener('resize', this.onWindowResize.bind(this))
  }
  openlink(names){
    names=='contacts'?(this.props.dispatch(routerRedux.push({
        pathname: '/crm/contacts',
        query:  { isshow: 'true'},
    }))):(this.props.dispatch(routerRedux.push({
        pathname: '/crm/company',
        query:  { isshow: 'true'},
    })))
  }

  render() {

    const datalist = [
      {
        title: '税务大会',
        time:'中国上海市外滩/2018-08-12',
        content:'国际税收领域正发生着前所未有的变化。随着包括中国大陆及香港在内的数十个...'
      },
      {
        title: '税务大会',
        time:'中国上海市外滩/2018-08-12',
        content:'国际税收领域正发生着前所未有的变化。随着包括中国大陆及香港在内的数十个...'
      },
      {
        title: '税务大会',
        time:'中国上海市外滩/2018-08-12',
        content:'国际税收领域正发生着前所未有的变化。随着包括中国大陆及香港在内的数十个...'
      },
      {
        title: '税务大会',
        time:'中国上海市外滩/2018-08-12',
        content:'国际税收领域正发生着前所未有的变化。随着包括中国大陆及香港在内的数十个...'
      },
      {
        title: '税务大会',
        time:'中国上海市外滩/2018-08-12',
        content:'国际税收领域正发生着前所未有的变化。随着包括中国大陆及香港在内的数十个...'
      },
      {
        title: '税务大会',
        time:'中国上海市外滩/2018-08-12',
        content:'国际税收领域正发生着前所未有的变化。随着包括中国大陆及香港在内的数十个...'
      },
      {
        title: '税务大会',
        time:'中国上海市外滩/2018-08-12',
        content:'国际税收领域正发生着前所未有的变化。随着包括中国大陆及香港在内的数十个...'
      },
      {
        title: '税务大会',
        time:'中国上海市外滩/2018-08-12',
        content:'国际税收领域正发生着前所未有的变化。随着包括中国大陆及香港在内的数十个...'
      },
    ];
    const { DataView } = DataSet;
    const { Html } = Guide;
    const data = [
      {
        item: "Upcoming",
        count: 42,
        color:"#0097a9"
      },
      {
        item: "Current",
        count: 12,
        color:"#75787b"
      },
      {
        item: "Past",
        count: 38,
        color:'#209d86'
      },
      {
        item: "Draft",
        count: 8,
        color:"#046a38"
      },
      
    ];
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
    const dv = new DataView();
    dv.source(data).transform({
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
      offset: 10, // 数值，设置坐标轴文本 label 距离坐标轴线的距离
      // 设置文本的显示样式，还可以是个回调函数，回调函数的参数为该坐标轴对应字段的数值
      textStyle: {
        textAlign: 'start', // 文本对齐方向，可取值为： start center end
        fill: 'rgba(0,0,0,0.65)', // 文本的颜色
        fontSize: '12', // 文本大小
        rotate: 50,
        textBaseline: 'middle' // 文本基准线，可取 top middle bottom，默认为middle
      }
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
    const pagesize=parseInt((window.innerHeight-250)/110);
    return (
        <Row gutter={24} style={{overflow:'hidden',width:'auto'}}>
        <Col xl={7} md={10} sm={12} xs={24} style={{textAlign:'center'}}>
            <div style={{height:(winH-100)/2.55,border:'1px solid rgba(0,0,0,0.3)',borderRadius:8,position:'relative'}}>
                <div className={styles.dtitle}>
                <div className={styles.dtitleDiv}>Event</div>
                </div>
                <div style={{position:'relative',height:(winH-100)/2.5*0.95}} ref="thisDiv">
                    <Chart
                    data={dv}
                    height={(winH-100)/2.55*0.95-70}
                    scale={cols}
                    padding={[10,10,10,10]}
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
                    offsetX={-100}
                  />
                    <Guide>
                        <Html
                        position={["50%", "50%"]}
                        html="<div style=&quot;color:#222;font-size:16px;text-align:center;width: 10em;line-height:16px&quot;><div>188<span style=&quot;color:#86bc25;font-size:10px;line-height:10px;display:inline-block&quot;><span style=&quot;display:inline-block&quot;>12</span><br/><span style=&quot;background:url(src/assets/icon-up.png) no-repeat;width:10px;height:10px;display:inline-block;background-size:100%&quot;></span></span> </div><span style=&quot;color:#262626;font-size:12px&quot;>Event</span></div>"
                        alignX="middle"
                        alignY="middle"
                        />
                    </Guide>
                    <Geom
                        type="intervalStack"
                        position="percent"
                        color={['item',["#62b5e5","#dcdcdc","#14b1b1","#86bc25"]]}
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
                          {/* <Label
  content='item'
  offset={15}
  labelLine={{
    lineWidth: 1, // 线的粗细
    stroke: 'rgba(0,0,0,0.2)', // 线的颜色
  }}
  htmlTemplate={(text, item, index)=>{
    var point = item.point; // 每个弧度对应的点
    var percent = point['percent'];
    percent = (percent * 100).toFixed(2) + '%';
    // 自定义 html 模板
    return '<div class="title" style="margin-bottom:-4px;padding:0;width:50px;border-bottom:1px solid rgba(0,0,0,0.2);font-size:12px;color:' + point.color + '">' + text + '</div><span style="color:' + point.color + ';font-size:10px">' + percent + '</span>';
  }}/> */}
</Geom>
    </Chart>

              <a style={{color:'rgba(0, 0, 0, 0.3)',fontSize:12}} href="/#/event/draf/create"><Icon type="plus" className={styles.eventsAdd} /> Create Event</a>
                </div>
            </div>
            <div style={{height:(winH-100)/3.35,border:'1px solid rgba(0,0,0,0.3)',borderRadius:8,marginTop:5,position:'relative'}}>
              <div className={styles.dtitle}>
                <div className={styles.dtitleDiv}>Companies</div>
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
              <a className={styles.addIcon} href="/#/crm/company"><Icon type="plus"  />Add Company</a>
            </div>
            <div style={{height:(winH-100)/3.35,border:'1px solid rgba(0,0,0,0.3)',borderRadius:8,marginTop:5,position:'relative'}}>
            <div className={styles.dtitle}>
                <div className={styles.dtitleDiv}>Contacts</div>
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
              <a className={styles.addIcon} href="/#/crm/contacts"><Icon type="plus"  /> Add Contact</a>
            
            </div>
      </Col>
      
      <Col xl={10} md={14} sm={12} xs={24}>
      <div style={{border:'1px solid rgba(0,0,0,0.3)',borderRadius:8,height:(winH-100)/0.995}}>
      <div className={styles.dtitle}>
          <div className={styles.dtitleDiv}>Event</div>
      </div>
              
              <Tabs defaultActiveKey="1">
            <TabPane tab="Current" key="1">
            <List
                itemLayout="horizontal"
                dataSource={datalist}
                size="large"
                pagination={{
                  onChange: (page) => {
                    // console.log(page);
                  },
                  pageSize:pagesize,
                }}
                renderItem={(item) => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={<Avatar src={robit} />}
                      title={<Row gutter={24}>
                        <Col span={8} style={{fontWeight:'bold'}}>
                          {item.title}
                        </Col>
                        <Col span={14} style={{textAlign:'right',color:'rgba(0,0,0,0.3)',fontSize:12}}>
                          {item.time}
                        </Col>
                      </Row>}
                      description={item.content}
                    />
                  </List.Item>
                )}
              />

            </TabPane>
            <TabPane tab="Upcoming" key="2"></TabPane>
            <TabPane tab="Past" key="3"></TabPane>
          </Tabs>


      </div>     
      </Col>
      <Col xl={7} md={24} sm={24} xs={24}>
      <Row gutter={24}>
          <Col xl={24} md={12} sm={12} xs={24}>
          <div style={{border:'1px solid rgba(0,0,0,0.3)',borderRadius:8,height:(winH-100)/2.013}}>
      <div className={styles.dtitle}>
          <div className={styles.dtitleDiv} style={{width:150}}>Industry Preferences</div>
      </div>
      <Chart height={(winH-100)/2.05*0.95} data={data1} scale={cols1} padding={[20,10,125,30]}
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
    <Col  xl={24} md={12} sm={12} xs={24}>
    <div style={{border:'1px solid rgba(0,0,0,0.3)',borderRadius:8,height:(window.innerHeight-100)/2.013,marginTop:5}}>
      <div className={styles.dtitle}>
          <div className={styles.dtitleDiv}>Event City</div>
      </div>
     <div>
     <Chart
          height={(winH-100)/2.05*0.95}
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
    );
  }
}

export default Donut; 
