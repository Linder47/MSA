import React from 'react';
import './Concert.css';
import { ListGroupItem } from 'react-bootstrap';

const Concert = (props) => {
  return (
    <div className="concert">
      <ListGroupItem
        className="concert__item"
        href={'/MSA/event/' + props.name}>
        <span className="concert__country">{props.country}</span>  {props.city} {props.nameOfVenue} {props.datetime}

      </ListGroupItem>
    </div>
  )
}

export default Concert;