import { Select, Spin, Button,message } from 'antd';
import {Ip,getCookie, getPageQuery} from '../../utils/utils';
import { connect } from 'dva';
const Option = Select.Option;
@connect(({ eventSpeakerAddition, loading }) => ({
  eventSpeakerAddition,
  submitting: loading.effects['eventSpeakerAddition/getEventSpeakerAddition'],
}))
class SearchInput extends React.Component {
  constructor(props) {
    super(props);
    this.saveSelSpon=this.saveSelSpon.bind(this);
  }

  state = {
    data: [],
    value: undefined,
    fetching: false,
  }

  fetchUser = (value) => {
    this.setState({ data: [], fetching: true });
    fetch(Ip + '/api/event/SpeakerSearch',{
        method:'POST',
        headers:{
            "Content-Type": "application/json",
            "SessionKey": getCookie("sk")!=null?getCookie("sk"):''
        },
        body:JSON.stringify({"QueryClause":value})
    })
      .then(response => response.json())
      .then((body) => {
        const data = body.map(speaker => ({
          text: `${speaker.FirstName} ${speaker.LastName}`,
          value: speaker.Id,
        }));
        this.setState({ data, fetching: false });
      });
  }

  handleChange = (value) => {
    this.setState({
      value,
      data: [],
      fetching: false,
    });
  }

  saveSelSpon =(e)=>{
    fetch(Ip+'/api/event/EventSpeakerAddition',{
      method:'POST',
      headers:{
          "Content-Type": "application/json",
          "SessionKey": getCookie("sk")!=null?getCookie("sk"):''
      },
      body:JSON.stringify({"EventId":getPageQuery(Location.seach).id,"PersonId":key})
  })
    .then(response => response.json())
    .then((body) => {
      if(body.ReturnCode == "1001"){
        message.success('successful!')
      }else{
        message.warn('warning!')
      }
      
    });
  }
  render() {
    const { fetching, data, value } = this.state;
    return (
      <div>
      <Select
        showSearch
        labelInValue
        value={this.state.value}
        showArrow={false}
        defaultActiveFirstOption={false}
        placeholder="Select Speakers"
        notFoundContent={fetching ? <Spin size="small" /> : null}
        filterOption={false}
        onSearch={this.fetchUser}
        onChange={this.handleChange}
        style={{ width: '100%' }}
      >
        {data.map(d => <Option key={d.value}>{d.text}</Option>)}
        
      </Select>
      {(this.state.value == [] || this.state.value == undefined || this.state.value.length<1)?(''):(
        <Button onClick={()=>this.saveSelSpon(this.state.value.key)}>确认添加</Button>
      )}
      </div>
    );
  }
}
export default connect()(SearchInput);