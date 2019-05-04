import React, { Component } from 'react';
import './Album.css';
import { Thumbnail } from 'react-bootstrap';

class Album extends Component {
  componentWillReceiveProps(props) {
    const { refresh, id } = this.props;
    if (props.refresh !== refresh) {
      this.fetchShoes(id)
        .then(this.refreshShoeList)
    }
  }

  onChoseAlbum = (album) => {
    sessionStorage.setItem('albumSearch', JSON.stringify(album));
  }

  render() {
    console.log('halo album');
    return (
      <div className='album'>
        <Thumbnail
          src={this.props.image}
          alt={this.props.id}
          href={'/MSA/album/' + this.props.name}
          onClick={() => { this.onChoseAlbum(this.props.album) }} />
      </div>
    )
  }
}



export default Album;