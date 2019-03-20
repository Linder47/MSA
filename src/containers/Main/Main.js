import React, { Component } from 'react';
import './Main.css';
import TopTrack from '../../components/TopTrack/TopTrack';
import ArtistSearchResult from '../../components/ArtistSearchResult/ArtistSearchResult';
import UserSearch from '../../components/UserSearch/UserSearch';
import { withRouter } from 'react-router-dom';

class Main extends Component {
  state = {
    addText: '',
    searched: false,
    oldArtist: '',
    artistData: [],
    topArtists: [],
    error: null,
    isLoaded: false,
    mySubsArr: null
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

    console.log('one');

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

    if (localStorage.getItem('mySubscribtions')) {
      let subscrubs = JSON.parse(localStorage.getItem('mySubscribtions'));
      this.setState({
        mySubsArr: subscrubs
      });
    }
  }

  onMySubs = () => {
    this.refs.mySubsList.style.display = this.refs.mySubsList.style.display === 'block' ? 'none' : 'block';
  }

  onGoToSubSearch = (nameLink) => {
    const link = '/artist/' + nameLink;
    this.props.history.push(link);
  }

  render() {
    const { error, isLoaded, topArtists } = this.state;
    console.log(topArtists);
    const mySubsContent = this.state.mySubsArr;
    console.log(mySubsContent);

    if (error) {
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
          {this.state.searched ? null : <div className="errorText">Error: {error.message}</div>}
        </div>
      )
    } else if (!isLoaded || topArtists.length === 0) {
      return (
        <div className='main'>
          <UserSearch
            onAddTextChange={this.handleAddTextChange}
            value={this.state.addText}
            onAddSearch={this.handleAddSearch} />
          {this.state.searched ? <ArtistSearchResult
            searchingArtist={this.state.oldArtist} />
            : null}
        </div>
      );
    } else {
      const newTopArtistsArr = topArtists.artist.length > 1 ? topArtists.artist.slice(0, 4) : topArtists.artist;
      return (
        <div>
          <div className="mySubs"><div className="mySubsText" onClick={() => { this.onMySubs() }}>My Subscriptions</div>
            <div className="mySubsList" ref="mySubsList">{this.state.mySubsArr != null ? mySubsContent.map(artist => <div className="mySubsArtist" onClick={() => { this.onGoToSubSearch(artist.name) }}>{artist.name.slice(0, 24)}</div>) : null}</div> </div>
          <div className='main'>
            <UserSearch
              onAddTextChange={this.handleAddTextChange}
              value={this.state.addText}
              onAddSearch={this.handleAddSearch} />
            {this.state.searched ? <ArtistSearchResult
              searchingArtist={this.state.oldArtist} />
              : null}
          </div>
          {this.state.searched === false ?
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
            </div> : null}
        </div>
      )
    }
  }
}


export default withRouter(Main);