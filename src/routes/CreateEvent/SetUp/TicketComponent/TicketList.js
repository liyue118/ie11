import React, { Component } from 'react';
import { Row,Col,Form, Input, message, Select,Checkbox,Radio ,Button,Card,Icon,Modal } from 'antd';
import {injectIntl,formatMessage} from 'react-intl';
import { connect } from 'dva';
import styles from './styles.less';
import ticket1 from '../../../../assets/ticket1.png';

@Form.create()
class TicketList extends Component{
    constructor(props){
        super(props);
        this.state={
            M1Disable:false,
            isNumberChecked:false,
            EditModalState:false,
            EditTicketDetail:[],
            confirmLoading:false
        }
    }

    showModal = () => {
        this.setState({
          M1Disable: true,
        });
      }
    
      handleOk = (e) => {
        console.log(e);
        this.setState({
          M1Disable: false,
        });
      }
    
      handleCancel = (e) => {
        console.log(e);
        this.setState({
          M1Disable: false,
        });
      }
      RadioChange = (e) => {
        this.setState({
            isNumberChecked:e.target.checked
        })
      }
      showTicketModel= (e) => {
        this.props.TicketShowModel();
      }
      DeleteTicket =(data) =>{
        this.props.DeleteTicket(data);
      }
      TicketEdit = (data) =>{
        this.props.TicketEdit(data);
      }
    render(){
        const {confirmLoading,blankHidden,EditModalState}=this.state;
        const { getFieldDecorator } = this.props.form;
        const {TicketListDate,intl}=this.props;
        const listItem=TicketListDate!=[]?(TicketListDate.map(event=>
            <li key={event.Id}>
            <div className={`${styles.TicketComTitle} ${styles.blue}`}>
                 <span>{event.Name}</span>
                 <div className={styles.TRight}>
                     <Icon type="edit" theme="outlined" onClick={this.TicketEdit.bind(this,event)} />
                     <Icon type="close" theme="outlined" onClick={this.DeleteTicket.bind(this,event)}  />
                 </div>
            </div> 
            <div  className={`${styles.TicketAount} ${styles.blue}`}>
                 <span style={{textAlign:'center'}}><h1 style={{color:'#fff'}}>{event.Price}<span style={{fontSize:20,marginLeft:10}}>{event.Currency}</span></h1></span>
                 <span style={{textAlign:'left'}}>
                    {event.PriceType=="1007001"?intl.formatMessage({id:'event.ticket.priceTypeStandard'}):intl.formatMessage({id:'event.ticket.priceTypeStandard'})}
                 </span>
                 <span className={styles.TRight} style={{textAlign:'right'}}>{event.Capacity}&nbsp;{intl.formatMessage({id:'event.ticket.ticketAva'})}</span>
            </div> 
            </li>
        )):'';
        return(
            <div className={styles.main}>
                    <h3>{intl.formatMessage({id:'Ticket'})}</h3>
                    <ul>
                     {listItem}
                    </ul>
                    {TicketListDate.length==0?(
                        <div className={`${styles.TicketAddDiv} ${styles.blue}`} style={{background:'#fff'}}  onClick={this.showTicketModel}>
                          <img src={ticket1}/>
                          <a className={styles.addIcon} href="javascript:void(0)"><Icon type="plus"  />{intl.formatMessage({id:'event.ticket.createTicket'})}</a>
                        </div> 
                   ):null}
            </div>
            
        )
    }
}

export default connect(({event = {}, loading }) => ({
  }))(injectIntl(TicketList));