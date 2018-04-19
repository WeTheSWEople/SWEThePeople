/* eslint-disable no-unused-vars */
import React, {Component} from 'react'
/* eslint-enable no-unused-vars */

export default class Alma extends Component {
  render () {
    const styles = {
      divStyle: {
        paddingTop: '50px'
      },
      imgStyle: {
        width: '100%'
      }
    }

    return (
      <div className='row' style={styles.divStyle}>
        <div className='col-md-6 col-md-offset-3'>
          <img
            src={
              'https://theunitedstates.io/images/congress/original/A000370.jpg'}
            alt={'Alma Adams'}
            className='img-responsive'
            style={styles.imgStyle} />
        </div>
      </div>
    )
  }
}
