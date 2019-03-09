import React, { Component } from 'react';
import './AlbumsInfo.css';
import '../../components/UserSearch/UserSearch.css';
import Spin from '../../components/Spinner/Spin';
import { Panel, Table, ButtonToolbar, Button, Image } from 'react-bootstrap';
import Song from '../../components/Song/Song';
import { withRouter } from 'react-router-dom';

class AlbumsInfo extends Component {
  state = {
    albumData: [],
    error: null,
    isLoaded: false,
    albumSearch: [],
    mySubsArr: null
  }

  componentDidMount() {
    const URL_BASIC = 'https://ws.audioscrobbler.com/2.0/?method=album.getinfo';
    const API_KEY = '&api_key=0b6cf004801c7d4b103426b29c6e006b&format=json';
    const albumSearch = JSON.parse(sessionStorage.getItem('albumSearch'));
    console.log(albumSearch.mbid);

    fetch(URL_BASIC + API_KEY + '&mbid=' + albumSearch.mbid + '&format=json')
      .then((res) => res.json())
      .then((results) => {

        console.log(results);
        this.setState({
          isLoaded: true,
          albumData: results.album,
        });
      },
        (error) => {
          this.setState({
            isLoaded: true,
            error
          });
        },
      );

    if (localStorage.getItem('mySubscribtions')) {
      let subscrubs = JSON.parse(localStorage.getItem('mySubscribtions'));
      this.setState({
        mySubsArr: subscrubs
      });
      console.log(subscrubs);
      console.log('mysubsarr', this.state.mySubsArr);
    }
  }

  onGoToSubSearch = (nameLink) => {
    const link = '/artist/' + nameLink;
    this.props.history.push(link);
  }

  onComeBackSearching = () => {
    this.props.history.goBack();
  }

  onMySubs = () => {
    this.refs.mySubsList.style.display = this.refs.mySubsList.style.display === 'block' ? 'none' : 'block';
  }

  render() {
    const { error, isLoaded, albumData } = this.state;
    const albumSearch = JSON.parse(sessionStorage.getItem('albumSearch'));
    const mySubsContent = this.state.mySubsArr;

    if (error) {
      return (
        <div>
          <div className="mySubs"><div className="mySubsText" onClick={() => { this.onMySubs() }}>My Subscriptions</div>
            <div className="mySubsList" ref="mySubsList">{this.state.mySubsArr != null ? mySubsContent.map(artist => <div className="mySubsArtist" onClick={() => { this.onGoToSubSearch(artist.name) }}>{artist.name.slice(0, 24)}</div>) : null}</div> </div>
          <div className="errorText">Error: {error.message}</div>;
      </div>)
    } else if (!isLoaded) {
      return (
        <div><div className="mySubs"><div className="mySubsText" onClick={() => { this.onMySubs() }}>My Subscriptions</div>
          <div className="mySubsList" ref="mySubsList">{this.state.mySubsArr != null ? mySubsContent.map(artist => <div className="mySubsArtist" onClick={() => { this.onGoToSubSearch(artist.name) }}>{artist.name.slice(0, 24)}</div>) : null}</div> </div>
          <div className='container  container--albums'>
            <Spin />
          </div>
        </div>
      )
    } else if (!albumData) {
      return <div><div className="mySubs"><div className="mySubsText" onClick={() => { this.onMySubs() }}>My Subscriptions</div>
        <div className="mySubsList" ref="mySubsList">{this.state.mySubsArr != null ? mySubsContent.map(artist => <div className="mySubsArtist" onClick={() => { this.onGoToSubSearch(artist.name) }}>{artist.name.slice(0, 24)}</div>) : null}</div> </div>
        <div className="container container--artist">
          <div className="errorText">Sorry, there is no information about this album.</div>
          <ButtonToolbar>
            <Button className="form__button  form__button--albumsInfo" onClick={() => { this.onComeBackSearching() }}>Назад</Button>
          </ButtonToolbar>
        </div>
      </div>
    } else {
      return (
        <div><div className="mySubs"><div className="mySubsText" onClick={() => { this.onMySubs() }}>My Subscriptions</div>
          <div className="mySubsList" ref="mySubsList">{this.state.mySubsArr != null ? mySubsContent.map(artist => <div className="mySubsArtist" onClick={() => { this.onGoToSubSearch(artist.name) }}>{artist.name.slice(0, 24)}</div>) : null}</div> </div>
          <div className="container  container--artist">
            <div className='album-image-table'>
              <Image alt={albumData.name} src={albumData.image[3]["#text"]}></Image>
              <div className='title-table'>
                <Panel>
                  <Panel.Title componentClass="h3" className="title  title--artist">{albumSearch.name}</Panel.Title>
                </Panel>
                <Table>
                  <tbody className="table-data">
                    <tr>
                      <td>name:</td>
                      <td> {albumData.name} </td>
                    </tr>
                    <tr>
                      <td>artist:</td>
                      <td>{albumData.artist}</td>
                    </tr>
                    <tr>
                      <td>listeners:</td>
                      <td>{albumData.listeners}</td>
                    </tr>
                    <tr>
                      <td>playcount:</td>
                      <td>{albumData.playcount}</td>
                    </tr>
                  </tbody>
                </Table>
              </div>
            </div>
            <Table>
              <thead>
                <tr className="table-titles">
                  <th>#</th>
                  <th>title</th>
                  <th>duration</th>
                </tr>
              </thead>
              <tbody className="table-songs">
                {albumData.tracks.track.map((track, i) => {
                  return <Song
                    id={i + 1}
                    key={i}
                    title={track.name}
                    duration={track.duration}
                  />;
                })}
              </tbody>
            </Table>
          </div>
        </div>
      )
    }
  }
}

export default withRouter(AlbumsInfo);