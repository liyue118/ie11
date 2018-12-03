import React, { Component } from 'react'
import styles from './MainLayout.css'
//import Header from './Header'
import GlobalHeader from './GlobalHeader'
import GlobalFooter from './GlobalFooter'

class MainLayout extends Component {
    // constructor(props) {
    //     super(props)
    // }
    render() {
        const { 
            children, 
            //location 
        } = this.props
        return (
            <div className={styles.normal}>
                {/* <Header location={location} /> */}
                <GlobalHeader />
                <div className={styles.content}>
                    <div className={styles.main}>
                        {children}
                    </div>
                </div>
                <GlobalFooter /> 
            </div>
        )
    }
}

export default MainLayout
