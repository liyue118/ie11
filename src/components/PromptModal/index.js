import React, { PropTypes } from 'react';
import { Modal, Button ,Icon} from 'antd';
import styles from './index.less';

export default class PromptModal extends React.Component {
    
    constructor(props) {
        super(props);
    }
    afterClose = () => {
        document.body.removeAttribute('style');
    }
    render() {
        const { wrapClassName, visible, type, onOk, onCancel, okText, cancelText, title, description, zIndex } = this.props;
        const style = !!zIndex ? { zIndex, } : {};
        const modalProps = {
            closable: false,
            maskClosable: false,
            wrapClassName: styles.promptModal,
            visible,
            width: 300,
            footer: <div className={styles.promptModal_footer}>
                {!!cancelText && <Button size='default' type='ghost' onClick={onCancel}>{!!cancelText ? cancelText : '取消'}</Button>}
                <Button size='default' type='primary' onClick={onOk}>{!!okText ? okText : '确定'}</Button>
            </div>
        }
        return (
            <Modal {...modalProps} afterClose={this.afterClose} style={style}>
                <span className="">{!!type && type === "error" ? <Icon style={{ fontSize: "22px", color: "#f5222d" }} type="close-circle" theme="outlined" /> : ""}</span>
                <span className="">{!!type && type === "success" ? <Icon style={{ fontSize: "22px", color: "#52c41a" }} type="check-circle" theme="outlined" /> : ""}</span>
                <span className="">{!!type && type === "confirm" ? <Icon style={{ fontSize: "22px", color:"#1890ff"}} type="info-circle" theme="outlined" />: ""}</span>
                <p className={styles.promptModal_title}>{`${!!title ? title : '提示'}`}</p>
                {!!description && <p className='promptModal_description'>{description}</p>}
            </Modal>
        )
    }
}

// PromptModal.propTypes = {
//     visible: PropTypes.bool.isRequired,
//     title: PropTypes.string.isRequired,
//     description: PropTypes.string,
//     okText: PropTypes.string,
//     onOk: PropTypes.func.isRequired,
//     onCancel: PropTypes.func.isRequired,
//     cancelText: PropTypes.string,
//     wrapClassName: PropTypes.string,//模态框className
// };
