import React, { Component } from 'react';
import Slider from 'react-slick';
import logo from './logo.svg';
import pic1 from './assets/pic1.jpg'
import pic2 from './assets/pic2.jpg'
import pic3 from './assets/pic3.jpg'
import './App.css';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";


export default class Splash extends Component {
  constructor(props) {
    super(props);
    
    this.settings = {
      dots: true,
      infinite: true,
      speed: 500,
      arrows: true,
      slidesToShow: 1,
      slidesToScroll: 1,
      autoplay: true,
      centerMode: true,
      autoplaySpeed: 4000
    };
  }
  render() {
    
    return (
      <div className="App">
      <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Splash Screen One</h1>
        </header>
      <div className="carousel-parent">
          <Slider {...this.settings} className="carousel">
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
      </div>
    );
  }
}


