import React, { Component } from 'react';
import './Albums.css';
import Album from '../../components/Album/Album';
import Concert from '../../components/Concert/Concert';
import { ButtonToolbar, Button, Panel } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';
import Spin from '../../components/Spinner/Spin';

class Albums extends Component {
  state = {
    albums: [],
    concerts: null,
    error: null,
    isLoaded: false,
    isLoadedConcerts: false,
    chosenArtist: '',
    artistData: [],
    inSubscrubitions: false,
    mySubsArr: null,
    //refreshAlbumsAndConcertsList:
  }

  componentWillMount() {
    if (sessionStorage.getItem('artistData')) {
      const artistData = JSON.parse(sessionStorage.getItem('artistData'));
      const chosenArtist = artistData; //artistData.name

      console.log('artistData from session: ', artistData);

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
    // 
    const BST_URL_BASIC = 'https://rest.bandsintown.com/artists/';
    const BST_API_KEY = '/events?app_id=07ba64cb982c2e21c00598c7b25d7266';
    const BST_URL = BST_URL_BASIC + chosenArtist + BST_API_KEY;

    fetch(BST_URL)
      .then(res => res.json())
      .then((result) => {
        this.setState({
          isLoadedConcerts: true,
          concerts: result
        });
      },

        (error) => {
          this.setState({
            isLoadedConcerts: true,
            error
          });
        }
      )
      .catch((error) => {
        this.setState({
          isLoadedConcerts: true,
          error
        });
      });


    if (localStorage.getItem('mySubscribtions')) {
      const subscrubs = JSON.parse(localStorage.getItem('mySubscribtions'));

      this.setState({
        mySubsArr: subscrubs
      });

      if (subscrubs.find(obj => obj.name === this.state.chosenArtist)) {
        this.setState({
          inSubscrubitions: true
        });
        console.log("in subs");
      }
    }
  }

  onComeBackSearching = () => {
    this.props.history.goBack();
  }

  onGoToSubSearch = (nameLink) => {
    const link = '/artist/' + nameLink;
    this.props.history.push(link);
    console.log('GOSEARCH ', nameLink);
    this.setState({
      artistData: nameLink,
      chosenArtist: nameLink
    });
  }

  onSubscribe = () => {
    if (!this.state.inSubscrubitions) {
      let a = [];
      const b = localStorage.getItem('mySubscribtions') !== null || undefined ? JSON.parse(localStorage.getItem('mySubscribtions')) : null;
      let id;
      if (b === null) {
        id = 0;
      } else {
        a = b;
        id = Number(a[a.length - 1].id) + 1;
      }

      const artistData = JSON.parse(sessionStorage.getItem('artistData'));

      const data = {
        'id': id, 'name': this.state.chosenArtist, 'mbid': artistData.mbid
      };
      a.push(data);
      localStorage.setItem('mySubscribtions', JSON.stringify(a));
    }
  }

  onShowAlbums = () => {
    this.refs.concerts.style.display = "none";
    this.refs.albums.style.display = "flex";
  }

  onShowConcerts = () => {
    this.refs.concerts.style.display = "flex";
    // this.refs.concerts.style.visibility="visible";
    this.refs.albums.style.display = "none";
  }

  onMySubs = () => {
    this.refs.mySubsList.style.display = this.refs.mySubsList.style.display === 'block' ? 'none' : 'block';
  }

  render() {
    const { error, isLoaded, albums, inSubscrubitions, concerts, chosenArtist } = this.state;
    console.log('choseartist in render ', chosenArtist);
    const heartColor = inSubscrubitions ? "heart  heart--inSubs" : "heart";
    const mySubsContent = this.state.mySubsArr;

    console.log("concerts in render", this.state.concerts);

    if (error) {
      return <div className="errorText">Error: {error.message}</div>;
    } else if (!isLoaded) {
      return (
        <div><div className="mySubs"><div className="mySubsText" onClick={() => { this.onMySubs() }}>My Subscriptions</div>
          <div className="mySubsList" ref="mySubsList">{this.state.mySubsArr != null ? mySubsContent.map(artist => <div className="mySubsArtist" key={artist.mbid} onClick={() => { this.onGoToSubSearch(artist.name) }}>{artist.name.slice(0, 24)}</div>) : null}</div> </div>
          <div className='container  container--albums'>
            <Spin />
          </div>
        </div>
      )
    } else {
      return (
        <div>
          <div className="mySubs  mySubs--albums"><div className="mySubsText" onClick={() => { this.onMySubs() }}>My Subscriptions</div>
            <div className="mySubsList" ref="mySubsList">{this.state.mySubsArr != null ? mySubsContent.map(artist => <div className="mySubsArtist" key={artist.mbid} onClick={() => { this.onGoToSubSearch(artist.name) }}>{artist.name.slice(0, 24)}</div>) : null}</div> </div>
          <ButtonToolbar>
            <Button className="button__albums--back" onClick={() => { this.onComeBackSearching() }}>Back</Button>
          </ButtonToolbar>
          <div className='container  container--albums'>
            <Panel>
              {/* <Panel.Title componentClass="h3" className="title">Albums</Panel.Title> */}
              <ButtonToolbar className="toolbar__albums--AlConHeart">
                <Button className="button__albums" onClick={() => { this.onShowAlbums() }}>Albums</Button>
                <div className="subElementCont"><div className={heartColor} onClick={() => { this.onSubscribe() }}></div></div>
                <Button className="button__albums" onClick={() => { this.onShowConcerts() }}>Concerts</Button>
              </ButtonToolbar>
              {/* <div className="subElementCont"><div class={heartColor} onClick={() => { this.onSubscribe() }}></div></div> */}
            </Panel>
            <div className='albums__albums'>
              <div className='albums__concerts' ref="concerts">{concerts !== null ? concerts.map(concert =>
                concert ? <Concert
                  name={chosenArtist}
                  key={concert.id}
                  id={concert.id}
                  country={concert.venue.country}
                  city={concert.venue.city}
                  nameOfVenue={concert.venue.name}
                  datetime={concert.datetime}
                /> : <div className="errorText">There's no concerts.</div>
              ) : null}

              </div>
              <div className='albums__cont' ref="albums">
                {albums ? albums.album.map(album =>
                  album ?
                    album.image[2]["#text"] ? <Album 
                      name={album.name}
                      key={album.name + album.id}
                      id={album.name + album.id}
                      image={album.image[2]["#text"]}
                      album={album}
                    />
                      : null
                    : <div className="errorText">There's no albums.</div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      )
    }
  }
}
export default withRouter(Albums);