import React, { PureComponent ,Fragment} from 'react';
import ReactDOM  from 'react-dom';
import { Row,Col,Steps} from 'antd';
import { connect } from 'dva';
import { Route, Redirect, Switch ,routerRedux} from 'dva/router';
import { getRoutes } from '../../../../../utils/utils';
import styles from './style.less';
import { formatMessage,injectIntl,intlShape } from 'react-intl';

const { Step } = Steps;

class StepForm extends PureComponent {
  constructor(){
    super();
    this.changeSummary = this.changeSummary.bind(this);
    this.changeSpeakers = this.changeSpeakers.bind(this);
    this.Agenda = this.Agenda.bind(this);
    this.Venue = this.Venue.bind(this);
    this.Sponsors = this.Sponsors.bind(this);
    this.Documents = this.Documents.bind(this);
  }
  componentDidMount(){
    const { location } = this.props;
    const { pathname } = location;
    const pathList = pathname.split('/');
    this.getStepName(pathList[pathList.length - 1]);
  }
  shouldComponentUpdate(nextProps) {
    if(nextProps.location != this.props.location){
      const { location } = nextProps;
      const { pathname } = location;
      const pathList = pathname.split('/');
      this.getStepName(pathList[pathList.length - 1]);
      return true;
    }
  }
  getCurrentStep() {
    const { location } = this.props;
    const { pathname } = location;
    const pathList = pathname.split('/');
    switch (pathList[pathList.length - 1]) {
      case 'summary':
        return 0;
      case 'speakers':
        return 1;
      case 'venue':
        return 2;
      case 'agenda': 
        return 3;
      case 'sponsors':
        return 4;
      case 'documents':
        return 5;
      default:
        return 0; 
    }
  }

  getStepName(name){
    const stepName = ReactDOM.findDOMNode(this.refs[name]);
    if(stepName!=null){
      stepName.children[1].style.background='#5baad7';
      stepName.children[1].children[0].style.color='#fff';
      const parent = stepName.parentNode;
      for(var i=0;i<parent.children.length;i++){
        if(parent.children[i]!=stepName){
          parent.children[i].children[1].style.background='#fff';
          parent.children[i].children[1].children[0].style.color='rgba(0, 0, 0, 0.25)';
        }
      }
    }
  }
  changeSummary = (name) =>{
    const {location}=this.props;
    this.props.dispatch(
      routerRedux.push({
        pathname: '/createEvent/setUp/content/step-form/summary',
        search:location.search
      }) 
    )
    this.getStepName(name);
   }
  changeSpeakers = (name) =>{
    const {location}=this.props;
    this.props.dispatch(
      routerRedux.push({
        pathname: '/createEvent/setUp/content/step-form/Speakers',
        search:location.search
      }) 
    )
    this.getStepName(name);
  }
  Agenda = (name) =>{
    const {location}=this.props;
    this.props.dispatch(
      routerRedux.push({
        pathname: '/createEvent/setUp/content/step-form/Agenda',
        search:location.search
      }) 
    )
    this.getStepName(name);
  }
  Venue = (name) =>{
    const {location}=this.props;
    this.props.dispatch(
      routerRedux.push({
        pathname: '/createEvent/setUp/content/step-form/Venue',
        search:location.search
      }) 
    )
    this.getStepName(name);
  }
  Sponsors = (name) =>{
    const {location}=this.props;
    this.props.dispatch(
      routerRedux.push({
        pathname: '/createEvent/setUp/content/step-form/Sponsors',
        search:location.search
      }) 
    )
    this.getStepName(name);
  }
  Documents = (name) =>{
    const {location}=this.props;
    this.props.dispatch(
      routerRedux.push({
        pathname: '/createEvent/setUp/content/step-form/Documents',
        search:location.search
      }) 
    )
    this.getStepName(name);
  }
  render() {
    const { match, routerData, location } = this.props;
    const {intl}=this.props;
    return (
      <Row gutter={24}>
      <Col xl={24} lg={24} md={24} sm={24} xs={24}>
              <Fragment>
              <div className={styles.Cheaders}>
                    Event
                    <div className={styles.CHRight}>
                    {intl.formatMessage({id:'event.content.Setup'})}
                    </div>
               </div>
                  <Steps labelPlacement="vertical" current={this.getCurrentStep()}>
                      <Step 
                      title={intl.formatMessage({id:'event.content.Summary'})} 
                      onClick={()=>this.changeSummary('summary')} 
                      style={{cursor: 'pointer'}}
                      className="changeSummaryBorder"
                      ref="summary"
                      />
                      <Step 
                      title={intl.formatMessage({id:'event.content.Speakers'})} 
                      onClick={()=>this.changeSpeakers('speakers')} 
                      style={{cursor: 'pointer'}}
                      ref="speakers"
                      />
                      <Step 
                      title={intl.formatMessage({id:'event.content.Add venues'})} 
                      onClick={()=>this.Venue('venue')} 
                      style={{cursor: 'pointer'}}
                      ref="venue"
                      />
                      <Step 
                      title={intl.formatMessage({id:'event.content.Agenda'})} 
                      onClick={()=>this.Agenda('agenda')} 
                      style={{cursor: 'pointer'}}
                      ref="agenda"
                      />
                      <Step 
                      title={intl.formatMessage({id:'event.content.Sponsors & Partners'})} 
                      onClick={()=>this.Sponsors('sponsors')} 
                      style={{cursor: 'pointer'}} 
                      className="sponsorTitle"
                      ref="sponsors"
                      />
                      <Step 
                      title={intl.formatMessage({id:'event.content.Documents'})} 
                      onClick={()=>this.Documents('documents')} 
                      style={{cursor: 'pointer'}}
                      ref="documents"
                      />
                  </Steps>
                  <Switch>
                  {getRoutes(match.path, routerData).map(item => (
                      <Route
                      key={item.key}
                      path={item.path}
                      component={item.component}
                      exact={item.exact}
                      />
                  ))}
                    <Redirect exact from="/createEvent/setUp/content/step-form" to={"/createEvent/setUp/content/step-form/summary"+location.search} />
                    </Switch>
                </Fragment>
        </Col>
        </Row>
    );
  }
}
export default connect()(injectIntl(StepForm));