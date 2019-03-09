import React, {Component} from 'react';
import './TopTrack.css';
import { Thumbnail } from 'react-bootstrap';

class TopTrack extends Component {
    render() {
        return (
            <div className='topTrack'>
                <Thumbnail
                    src={this.props.image}
                    alt={this.props.id} />
                    <div className="textName"><p>{this.props.name}</p></div>
            </div>
        )
    }
}

    export default TopTrack;