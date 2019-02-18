import React, { Component } from 'react';
import './Main.css';
import TopTrack from '../../components/TopTrack/TopTrack';
import ArtistSearchResult from '../../components/ArtistSearchResult/ArtistSearchResult';
import UserSearch from '../../components/UserSearch/UserSearch';
import TopTracksContainer from '../TopTracksContainer/TopTracksContainer';

class Main extends Component {
  state = {
    addText: '',
    searched: false,
    oldArtist: '',
    artistData: [],
    // topArtists: [],
    // error: null,
    // isLoaded: false
  }

  componentWillMount() {
    if (sessionStorage.getItem('artistData')) {
      const artistData = JSON.parse(sessionStorage.getItem('artistData'));
      const oldArtist = artistData.name;

      this.setState({
        artistData,
        oldArtist,
      });
    }
  }

  handleAddTextChange = (text) => {
    this.setState({
      addText: text
    });
  }

  handleAddSearch = (e) => {
    e.preventDefault();

    if (this.state.addText !== this.state.oldArtist) {
      this.props.history.push('/search/' + this.state.addText);

      this.setState({
        searched: true,
        oldArtist: this.state.addText
      });
    }
  }

  componentDidMount() {
    if (this.props.history.location.pathname !== '/') {
      const path = this.props.history.location.pathname;
      const ind = path.indexOf('/', 1);
      const artist = path.substr(ind + 1);

      this.setState({
        oldArtist: artist,
        searched: true,
        addText: artist
      });
    }

    // const URL_BASIC = 'https://ws.audioscrobbler.com/2.0/?method=chart.gettopartists';
    // const API_KEY = '&api_key=0b6cf004801c7d4b103426b29c6e006b&format=json';
    // const URL = URL_BASIC + API_KEY;

    // fetch(URL)
    //   .then(res => res.json())
    //   .then((result) => {
    //     this.setState({
    //       isLoaded: true,
    //       topArtists: result.artists
    //     });
    //   },

    //     (error) => {
    //       this.setState({
    //         isLoaded: true,
    //         error
    //       });
    //     }
    //   );
  }

  render() {
    // const { error, isLoaded, topArtists } = this.state;
    // console.log(topArtists);
    // let topArtistsAcc2 = topArtists.artist ? topArtists.artist : null;
    // let topArtistsAcc = topArtistsAcc2 != null ? topArtistsAcc2.slice(9) : [];
    // console.log(topArtistsAcc);

      return (
        <div>
          <div className='main'>
            <UserSearch
              onAddTextChange={this.handleAddTextChange}
              value={this.state.addText}
              onAddSearch={this.handleAddSearch} />
            {this.state.searched ? <ArtistSearchResult
              searchingArtist={this.state.oldArtist} />
              : null}
          </div>
          {this.state.searched ? null : <TopTracksContainer />}
        </div>
      )
  }
}


export default Main;