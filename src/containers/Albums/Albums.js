import React, { Component } from 'react';
import './Albums.css';
import Album from '../../components/Album/Album';
import { ButtonToolbar, Button, Panel } from 'react-bootstrap';
import { withRouter } from 'react-router-dom'

class Albums extends Component {
    state = {
        albums: [],
        error: null,
        isLoaded: false,
        chosenArtist: '',
        artistData: []
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
    }

    onComeBackSearching = () => {
        this.props.history.goBack();
    }

    render() {
        const { error, isLoaded, albums } = this.state;

        if (error) {
            return <div>Error: {error.message}</div>;
        } else if (!isLoaded) {
            return <div>Loading...</div>;
        } else {
            return (
                <div className='albums-container'>
                    <Panel>
                        <Panel.Title componentClass="h3" className="panel__title--albums">Альбомы {this.state.chosenArtist}: </Panel.Title>
                    </Panel>
                    <ButtonToolbar>
                        <Button className="row__button--albums" onClick={() => { this.onComeBackSearching().bind(this) }}>Назад</Button>
                    </ButtonToolbar>
                    <div className='albums__albums'>
                        {albums.album.map(album =>
                            album.image[2]["#text"] ? <Album
                                key={album.name + album.id}
                                id={album.name + album.id}
                                image={album.image[2]["#text"]}
                            />
                                : null
                        )}
                    </div>
                </div>
            )
        }
    }
}
export default withRouter(Albums);