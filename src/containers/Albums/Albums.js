import React, { Component } from 'react';
import './Albums.css';
import Album from '../../components/Album/Album';
import { ButtonToolbar, Button, Panel } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';
import Spin from '../../components/Spinner/Spin';

class Albums extends Component {
  state = {
    albums: [],
    error: null,
    isLoaded: false,
    chosenArtist: '',
    artistData: [],
    inSubscrubitions: false
  }

  componentWillMount() {
    if (sessionStorage.getItem('artistData')) {
      const artistData = JSON.parse(sessionStorage.getItem('artistData'));
      const chosenArtist = artistData.name;

      this.setState({
        artistData,
        chosenArtist,
      });
    }
  }

  componentDidMount() {
    const chosenArtist = this.state.chosenArtist;
    const URL_BASIC = 'https://ws.audioscrobbler.com/2.0/?method=artist.gettopalbums&artist=';
    const API_KEY = '&api_key=0b6cf004801c7d4b103426b29c6e006b&format=json';
    const URL = URL_BASIC + chosenArtist + API_KEY;

    fetch(URL)
      .then(res => res.json())
      .then((result) => {
        this.setState({
          isLoaded: true,
          albums: result.topalbums
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
        const subscrubs = localStorage.getItem('mySubscribtions');
        console.log(subscrubs);
        console.log(subscrubs.name);
        console.log(subscrubs.some(({name}) => name === this.state.chosenArtist));
        if (subscrubs.some(({name}) => name === this.state.chosenArtist)) {
          this.setState({
            inSubscrubitions: true
          });       
          console.log('true');
        }
      }
  }

  onComeBackSearching = () => {
    this.props.history.goBack();
  }

  onSubscribe = () => {
    console.log('here');
    let a = [];
    const b = localStorage.getItem('mySubscribtions') !== null || undefined ? JSON.parse(localStorage.getItem('mySubscribtions')) : null;
    console.log('b ', b);
    let id;
    if (b === null) {
      id = 0;
    } else {
      a = b;
      id = Number(a[a.length - 1].id) + 1;
    }

    const data = {
      'id': id, 'name': this.state.chosenArtist
    };
    a.push(data);
    localStorage.setItem('mySubscribtions', JSON.stringify(a));
  }

  render() {
    const { error, isLoaded, albums } = this.state;

    if (error) {
      return <div className="errorText">Error: {error.message}</div>;
    } else if (!isLoaded) {
      return (
        <div className='container  container--albums'>
          <Spin />
        </div>
      )
    } else {
      return (
        <div className='container  container--albums'>
          <Panel>
            <Panel.Title componentClass="h3" className="title">Albums</Panel.Title>
            <div className="subElementCont"><div class="heart" onClick={() => { this.onSubscribe() }}></div></div>
          </Panel>
          <ButtonToolbar>
            <Button className="button__albums" onClick={() => { this.onComeBackSearching() }}>Назад</Button>
          </ButtonToolbar>
          <div className='albums__albums'>
            <div className='albums__cont'>
              {albums.album.map(album =>
                album ?
                  album.image[2]["#text"] ? <Album
                    name={album.name}
                    key={album.name + album.id}
                    id={album.name + album.id}
                    image={album.image[2]["#text"]}
                    album={album}
                  />
                    : null
                  : <div className="errorText">Альбомов нет.</div>
              )}
            </div>
          </div>
        </div>
      )
    }
  }
}
export default withRouter(Albums);