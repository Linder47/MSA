import React, { Component } from 'react';
import './TopTracksContainer.css';
import TopTrack from '../../components/TopTrack/TopTrack';
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
    // let topArtistsAcc2 = topArtists.artist ? topArtists.artist : null;
    // let topArtistsAcc = topArtistsAcc2 != null ? topArtistsAcc2.slice(9) : [];
    // console.log(topArtistsAcc);

    if (error) {
      return (
        <div className="errorText">Error: {error.message}</div>
      )
    } else if (!isLoaded || topArtists.length === 0) {
      return null;
    } else {
      console.log(topArtists.artist);
      // console.log(topArtistsAcc);
      const newTopArtistsArr = topArtists.artist.length > 1 ? topArtists.artist.splice(0, 4) : topArtists.artist;
      console.log(newTopArtistsArr);
      return (
        <div className='topTracks__tracks  container'>
        <div className="topTracksContainer__text"><p>Popular right now</p></div>
          <div className='topTracks__cont'>
            {newTopArtistsArr.map(artist =>
              artist.image[3]["#text"] ? <TopTrack
                name={artist.name}
                key={artist.name + artist.playcount}
                id={artist.name + artist.playcount}
                image={artist.image[3]["#text"]}
              /> : null
            )}
          </div>
        </div>
      )
    }
  }
}

export default TopTracksContainer;