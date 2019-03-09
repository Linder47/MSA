import React from 'react';
import './Concert.css';
import { ListGroupItem, Row, Col } from 'react-bootstrap';

const Concert = (props) => {
  return (
    <div className="concert">
      <ListGroupItem
        className="concert__item"
        href={'/MSA/event/' + props.name}>
        <Row>
          <Col sm={3}>{props.country}</Col>
          <Col sm={2}>{props.city}</Col>
          <Col sm={4}>{props.nameOfVenue}</Col>
          <Col sm={3}>{(props.datetime).slice(0,10)+ " " + (props.datetime).slice(11,16)}</Col>
        </Row>
      </ListGroupItem>
    </div>
  )
}

export default Concert;