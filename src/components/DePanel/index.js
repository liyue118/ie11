import React, { PureComponent } from 'react'
import { Icon } from 'antd'
import styles from './index.less'
export default class DePanel extends PureComponent {
    render(){
        const {
            children,
            footer,
            title,
            num,
        } = this.props;
        return(
            <div className={styles.dx_panel}>
                <div className={styles.dx_panel_title_box}>
                    <span className={styles.dx_panel_num}>
                        <i>
                            {num}
                        </i>
                    </span>
                    <span className={styles.dx_panel_title}>
                        {title}
                    </span>
                    {/* <span className={styles.arrow}>
                        <Icon type="right" theme="outlined" style={{fontSize:"16px",color:"#fff"}}/>
                    </span> */}
                </div>
                <div className={`${styles.dx_panel_content} ${styles.dx_panel_nofooter_content}`}>
                    {children}
                </div>
            </div>
        )
    }
}

