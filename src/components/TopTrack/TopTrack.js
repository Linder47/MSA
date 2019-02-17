import React, {Component} from 'react';
import './TopTrack.css';
import { Thumbnail } from 'react-bootstrap';

class TopTrack extends Component {
    // onChoseAlbum = (album) => {
    //     sessionStorage.setItem('albumSearch', JSON.stringify(album));
    // }

    render() {
        return (
            <div className='topTrack'>
                <Thumbnail
                    src={this.props.image}
                    alt={this.props.id}
                    // href={'/MSA/album/' + this.props.name}
                    // onClick={() => { this.onChoseAlbum(this.props.album) } }
                    />
            </div>
        )
    }
}

    export default TopTrack;