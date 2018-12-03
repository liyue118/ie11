import React, { PureComponent ,Fragment} from 'react';
import { Row,Col,Tabs, Card } from 'antd';
import { Route, Redirect, Switch } from 'dva/router';
import mo1 from '../../../../assets/mo1.PNG';
import mo2 from '../../../../assets/mo2.PNG';
const { Meta } = Card;
const TabPane = Tabs.TabPane;

function callback(key) {
  console.log(key);
}
export default class Layout extends PureComponent {
    
    render(){

        return(
            <Card  style={{padding:'24px 24px 0'}}>
                <Tabs defaultActiveKey="1" onChange={callback}>
                    <TabPane tab="Deloitte's Saved Templates" key="1">
                    <Row>
                        <Col span={6}>
                        <Card
                            style={{ width: 300 }}
                            cover={<img alt="example" src={mo1} />}
                            actions={<a>Created On: 2018-06-13 </a>}
                        >
                            <Meta
                            title="Deloitte Latest template0613"
                            />
                        </Card>
                        </Col>
                        <Col span={6}>
                        <Card
                            style={{ width: 300,marginLeft:15 }}
                            cover={<img alt="example" src={mo2} />}
                            actions={<a>Created On: 2017-11-27 </a>}
                        >
                            <Meta
                            title="存档模板"
                            />
                        </Card>
                        </Col>
                    </Row>
                        
                        
                    </TabPane>
                    {/* <TabPane tab="EventBank Templates" key="2"></TabPane> */}
                </Tabs>
            </Card>    
        )
    }
}