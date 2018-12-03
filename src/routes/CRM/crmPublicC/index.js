import React, { Component } from 'react';
import { Radio ,Button ,Input ,Menu, Dropdown,Modal,Form,Collapse, Divider } from 'antd';
import PropTypes from 'prop-types'
import SelectToList from 'components/SelectToList'
import styles from './index.less';
const Search = Input.Search;
const FormItem=Form.Item;
export default class CRMPublicC extends Component {   
  static propTypes={
    showCollapse:PropTypes.func.isRequired
  }
  constructor(props){
    super(props);
   
  }
    state = {
        checkState: false,
        modal2Visible: false,
      }
      setModal2Visible(modal2Visible) {
        this.setState({ modal2Visible });
      }
      FilterClick(){
          !this.state.checkState?this.state.checkState=true:this.state.checkState=false;
          this.props.callbackFilter(this.state.checkState);
      }
      render() {
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
        const crmSelectData=[{'id':'1','title':'Fileds to Select',content:[{'id':'1','value':"Name"},{'id':'2','value':"Email"},{'id':'3','value':"Phone Number"}]},
        {'id':'2','title':'Custom Fields ',content:[{'id':'1','value':"增值税发票6位开票代码"}]}];
        const crmListData=[{'id':'1','title':'Fileds to Select',content:[{'id':'1','value':"Fax"},{'id':'2','value':"City"},{'id':'3','value':"Adress"}]}] 
         return ( 
            <span>
                <Search
                style={{width:200,marginLeft:10}}
                placeholder="Input Search Text"
                onSearch={value => console.log(value)}
                enterButton
                /> 
                <Button type="primary" icon="filter" style={{marginLeft:10}} className={styles.CiconButton} onClick={this.props.showCollapse} ></Button>
                <Button type="primary" icon="download" style={{marginLeft:10}} className={styles.CiconButton} onClick={() => this.setModal2Visible(true)}></Button>
                <Modal
                    title="Export List"
                    visible={this.state.modal2Visible}
                    onOk={() => this.setModal2Visible(false)}
                    onCancel={() => this.setModal2Visible(false)}
                    cancelText="Cancel"
                    okText="Export"
                    className={styles.downModal}
                    >
                    <div style={{marginBottom:10}}>Select which fields to include in the exported list.<br/>
                    Select fields to be exported *:</div>
                    <SelectToList noTitle={true}  splaceholder="add to list" listData={crmListData} selectData={crmSelectData} /> 
                    <Radio style={{marginTop:10}}>If you have Multiple Choice fields, would you like to merge the result ?</Radio>
                    </Modal>
                <Dropdown overlay={SettingMenu} trigger={['click']} placement="bottomLeft">
                <Button type="primary" icon="setting"  style={{marginLeft:10}} className={styles.CiconButton}></Button>
                </Dropdown>
            </span>
        );
      }
}