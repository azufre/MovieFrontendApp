import { React } from 'react';
import {Card, Button} from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

export default function MovieCard(props){

    return (
        <div style={{margin:"15px"}}>
            <Card style={{ width: '18rem'}}>
            <Card.Img variant="top" src="img/movie.jpg" />
            <Card.Body>
                <Card.Title>{props.movie.title}</Card.Title>
                <Card.Text>
                {props.movie.plot.slice(0, 200)}...
                </Card.Text>
                <LinkContainer to={{pathname:`/movie/${props.movie.pk}`}}>
                    <Button variant="primary">See more.</Button>
                </LinkContainer>                
            </Card.Body>
            </Card>
        </div>
    );

}