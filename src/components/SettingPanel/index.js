import React, { PureComponent } from 'react'
import { Icon } from 'antd'
import styles from './index.less'
export default class SettingPanel extends PureComponent {
    render() {
        const {
            children,
            footer,
            title,
            icon,
            editImg
        } = this.props;
        return (
            <div className={styles.dx_panel}>
                <div className={styles.dx_panel_title_box}>
                    <span className={styles.dx_panel_num}>
                        {icon}
                    </span>
                    <span className={styles.dx_panel_title}>
                        {title}
                    </span>
                    <span className={styles.arrow} style={{fontSize:"20px"}}>
                        {!!editImg?editImg:""}
                    </span> 
                </div>
                <div className={`${styles.dx_panel_content} ${styles.dx_panel_nofooter_content}`}>
                    {children}
                </div>
            </div>
        )
    }
}

