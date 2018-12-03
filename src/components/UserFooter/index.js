import React, { PureComponent } from 'react'
import { Icon ,Row ,Col} from 'antd'
import { formatMessage, injectIntl, intlShape } from 'react-intl';
import styles from './index.less'
export default class UserFooter extends PureComponent {
    render() {
        const { intl } = this.props;
        //@Deloitte Event 2018 最终解释权
        return (
            <div className={styles.footer}>
                {/* <Row>
                    <Col span={6} offset={11}>
                        <a><span className={styles.footer_link}>德勤全球</span></a>
                        <span className={styles.footer_divider}>|</span>
                        <a><span className={styles.footer_link}>德勤中国</span></a>
                        <span className={styles.footer_divider}>|</span>
                        <a><span className={styles.footer_link}>德勤税务</span></a>
                    </Col>
                    <Col span={5}>
                        <span className={styles.copyright}>
                            {intl.formatMessage({ id: 'event.content.CopyRight' })}
                        </span>
                    </Col>
                </Row> */}
                <div>
                    <a><span className={styles.footer_link}>德勤全球</span></a>
                    <span className={styles.footer_divider}>|</span>
                    <a><span className={styles.footer_link}>德勤中国</span></a>
                    <span className={styles.footer_divider}>|</span>
                    <a><span className={styles.footer_link}>德勤税务</span></a>
                </div>
                <div>
                    <span className={styles.copyright}>
                        {intl.formatMessage({ id: 'event.content.CopyRight' })}
                    </span>
                </div>
            </div>
        )
    }
}

