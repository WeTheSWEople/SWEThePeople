/* eslint-disable no-unused-vars */
import React, {Component} from 'react'
import Slider from 'react-slick'
/* eslint-enable no-unused-vars */

import '../../assets/css/App.css'
import pic1 from '../../assets/images/splash-screen/pic1.jpg'
import pic2 from '../../assets/images/splash-screen/pic2.jpg'
import pic3 from '../../assets/images/splash-screen/pic3.jpg'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

export default class Splash extends Component {
  constructor (props) {
    super(props)

    this.settings = {
      dots: true,
      infinite: true,
      speed: 300,
      arrows: true,
      slidesToShow: 1,
      slidesToScroll: 1,
      autoplay: true,
      centerMode: false,
      autoplaySpeed: 4000,
      pauseOnHover: true
    }
  }

  render () {
    // 3 pictures for carousel
    let pics = [pic1, pic2, pic3]

    return (

      <div className='App'>
        <header className='App-header'></header>
        {/* Map three pictures to carousel */}
        <div className='carousel-parent'>
          <center>
            <Slider {...this.settings} className='carousel'>
              {pics.map((item) => (
                <div><img src={item} alt=''/></div>
              ))}
            </Slider>
          </center>
        </div>
      </div>
    )
  }
}
