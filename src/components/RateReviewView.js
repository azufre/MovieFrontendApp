import { React, Component } from 'react';
import { Card } from 'react-bootstrap';
import ReactStars from "react-rating-stars-component";


export default class RateReviewView extends Component {

    render(){
        return(
            <Card border="primary" style={{ width: '25rem', 'margin': '15px' }}>
                <Card.Header>
                    {this.props.ratereview.owner}              
                </Card.Header>
                <Card.Body>
                <Card.Title>Rate Review</Card.Title>
                <Card.Text>
                    {this.props.ratereview.review}                       
                </Card.Text>
                <ReactStars
                        count={5}
                        edit={false}
                        isHalf={false}
                        size={24}
                        value={this.props.ratereview.stars}
                        activeColor="#ffd700"
                    />  
                </Card.Body>
            </Card>
        );
    }

}