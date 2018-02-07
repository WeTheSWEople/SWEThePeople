import React, { Component } from 'react';
import Slider from 'react-slick';
import logo from './logo.svg';
import pic1 from './assets/pic1.jpg'
import pic2 from './assets/pic2.jpg'
import pic3 from './assets/pic3.jpg'
import header from './assets/header.png'
import './App.css';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";


export default class Splash extends Component {
  constructor(props) {
    super(props);

    this.settings = {
      dots: true,
      infinite: true,
      speed: 300,
      arrows: true,
      slidesToShow: 1,
      slidesToScroll: 1,
      autoplay: true,
      centerMode: true,
      autoplaySpeed: 4000,
      centerPadding: '420px',
      pauseOnHover: true
    };
  }
  render() {

    return (
      <div className="App">
      <header className="App-header">
          <img src={header} className="App-logo" alt="logo" />
        </header>
      <Slider {...this.settings}>
        <div >
            <img src={pic1}  alt="" />

        </div>
       <div >
            <img src={pic2}  alt="" />

        </div>
        <div >
            <img src={pic3}  alt="" />

        </div>

      </Slider>
      </div>
    );
  }
}
