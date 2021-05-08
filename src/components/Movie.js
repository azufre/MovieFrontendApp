import {React, Component} from 'react';
import { withRouter } from "react-router";
import axios from 'axios';
import { Card, Button } from 'react-bootstrap';
import ReactStars from "react-rating-stars-component";

import RateReviewView from './RateReviewView';

class Movie extends Component{

    url_movie_detail = 'http://localhost:8000/api/movie/view';
    url_rate_review_list = 'http://localhost:8000/api/ratereview/list';
    state = {
        movie:{},
        rateRevies:[],
        rateRevie:{
            rewiew:'',
            stars: 0,
            movie: 0,
        },
        isMovieNotFound:false,
    }

    ratingChanged = (newRating) => {
        
        this.setState(prevstate => ({
           ...prevstate, rateRevie: {
            ...prevstate.rateRevie,
                stars: newRating
           }
        }));

    };

    handle_change = e => {
        const value = e.target.value;
        this.setState(prevstate => ({
            ...prevstate, rateRevie: {
                ...prevstate.rateRevie,
                rewiew: value
            }
         }));
      };

      handle_ratereview = (e) => {

        console.log(this.state.rateRevie);
        e.preventDefault();

      }

    componentDidMount(){

        const pk = this.props.match.params.pk;

        axios.get(`${this.url_movie_detail}/${pk}`).then(response => {
            
            this.setState({movie:response.data});

            this.setState(prevstate => ({
                ...prevstate, rateRevie: {
                    ...prevstate.rateRevie,
                    movie: parseInt(pk)
                }
             }));

            axios.get(`${this.url_rate_review_list}/?idmovie=${pk}`).then(response => {
                this.setState({rateRevies:response.data});
            });
            
        }).catch(error => {
            if(error.response.status && error.response.status === 404){
                console.log('aqo');
                this.setState({isMovieNotFound: true});
            }
        });
        
    }

    render(){

        const RateReviews = this.state.rateRevies.map(q => <RateReviewView ratereview={q} key={q.pk}/>);

        const MovieNotFound = (
            <div style={{'backgroundColor':'white', 'padding':'15px', 'margin':'auto'}}>
                <span className="scoreboard__title" style={{'marginLeft':'75px', 'marginBottom': '20px', 'marginTop':'20px', 'fontWeight':'bold', 'display':'block', 'fontSize':'24px'}}>
                    :( Sorry movie not found.
                </span>
                
            </div>
        );

        return (
           this.state.isMovieNotFound === true ? MovieNotFound : <div style={{'backgroundColor':'white', 'padding':'15px', 'margin':'auto'}}>
            
                <span className="scoreboard__title" style={{'marginLeft':'75px', 'marginBottom': '20px', 'marginTop':'20px', 'fontWeight':'bold', 'display':'block', 'fontSize':'24px'}}>Movie Information</span>
                
                <img src="/img/movie.jpg" style={{'display':'block', 'marginLeft':'auto', 'marginRight':'auto', 'width':'40%'}} alt="movie"/>

                <span className="scoreboard__title" style={{'marginLeft':'75px', 'marginTop':'20px', 'display':'block'}}>{this.state.movie.title}</span>

                <div>
                    <span style={{'padding':'20px', 'paddingLeft': '70px', 'paddingRight':'70px', 'display':'block'}}>
                        {this.state.movie.plot}
                    </span>
                </div>

                <ul className="content-meta info" style={{'marginTop':'20px'}}>

                    <li className="meta-row clearfix" data-qa="movie-info-item">
                        <div className="meta-label subtle" >Rating:</div>
                        <div className="meta-value" data-qa="movie-info-item-value">{this.state.movie.rated}
                        </div>
                    </li>    
                    <li className="meta-row clearfix" data-qa="movie-info-item">
                        <div className="meta-label subtle" >Genre:</div>
                        <div className="meta-value" data-qa="movie-info-item-value">{this.state.movie.genre}
                        </div>
                    </li>    
                    <li className="meta-row clearfix" data-qa="movie-info-item">
                        <div className="meta-label subtle" >Year:</div>
                        <div className="meta-value" data-qa="movie-info-item-value">{this.state.movie.year}
                        </div>
                    </li>    
                    <li className="meta-row clearfix" data-qa="movie-info-item">
                        <div className="meta-label subtle" >Release Date:</div>
                        <div className="meta-value" data-qa="movie-info-item-value">{this.state.movie.released_on}
                        </div>
                    </li>   
                    <li className="meta-row clearfix" data-qa="movie-info-item">
                        <div className="meta-label subtle" >Director:</div>
                        <div className="meta-value" data-qa="movie-info-item-value">{this.state.movie.director}
                        </div>
                    </li>     
                    <li className="meta-row clearfix" data-qa="movie-info-item">
                        <div className="meta-label subtle" >Audience score:</div>
                        <div className="meta-value" data-qa="movie-info-item-value">{this.state.movie.audience_score}%
                        </div>
                    </li>                                                                                     
                </ul>

                <span className="scoreboard__title" style={{'marginLeft':'75px', 'marginTop':'20px', 'display':'block'}}>Audience Review</span>

                <div style={{
                        'display': 'flex',
                        'flexWrap': 'wrap',
                        'justifyContent': 'center',
                    }}>
                    <Card border="primary" style={{ width: '25rem', 'margin': '15px' }}>
                        <Card.Header>
                            {this.props.current_user}   
                        </Card.Header>
                        <Card.Body>
                        <Card.Title>Rate Review</Card.Title>
                        <form onSubmit={this.handle_ratereview}>
                            <Card.Text>
                                <textarea onChange={this.handle_change} style={{'width':'100%', 'height':'100px'}} maxLength="255"></textarea>                       
                            </Card.Text>
                            <ReactStars
                                    count={5}
                                    edit={true}
                                    isHalf={false}
                                    size={30}
                                    value={0}
                                    onChange={this.ratingChanged}
                                    activeColor="#ffd700"
                                />  
                            <Button style={{'marginTop':  '15px'}} type="submit">Save</Button>
                        </form>
                        </Card.Body>
                    </Card>
                </div>

                <div style={{
                        'display': 'flex',
                        'flexWrap': 'wrap',
                        'justifyContent': 'center',
                        'margin': '15px',
                        'marginBottom':'70px'
                    }}>
                    {RateReviews.length === 0 ? <span style={{'fontSize':'20px'}}>No rate review yet be the first one.</span> : RateReviews}
                </div>

            </div>
        );
    }

}

export default withRouter(Movie);