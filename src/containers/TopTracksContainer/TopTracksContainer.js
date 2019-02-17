import React, { Component } from 'react';
import './Albums.css';
import Album from '../../components/Album/Album';
import { ButtonToolbar, Button, Panel } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';

class TopTracksContainer extends Component {
  state = {
    topArtists: [],
    error: null,
    isLoaded: false
  }

  componentDidMount() {
    const URL_BASIC = 'https://ws.audioscrobbler.com/2.0/?method=chart.gettopartists';
    const API_KEY = '&api_key=0b6cf004801c7d4b103426b29c6e006b&format=json';
    const URL = URL_BASIC + API_KEY;

    fetch(URL)
      .then(res => res.json())
      .then((result) => {
        this.setState({
          isLoaded: true,
          topArtists: result.artists
        });
      },

        (error) => {
          this.setState({
            isLoaded: true,
            error
          });
        }
      );
  }


  render() {
    const { error, isLoaded, topArtists } = this.state;
    console.log(topArtists);

    
  }
}

export default TopTracksContainer;