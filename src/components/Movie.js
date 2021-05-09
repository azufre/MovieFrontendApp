import {React, Component} from 'react';
import { withRouter } from "react-router";
import axios from 'axios';

import RateReviewView from './RateReviewView';
import { Link } from 'react-router-dom';

import ReactStars from "react-rating-stars-component";
import { Card, Button, Form } from 'react-bootstrap';

class Movie extends Component{

    url_movie_detail = `${process.env.REACT_APP_API_BACKEND}/api/movie/view`;
    url_rate_review_list = `${process.env.REACT_APP_API_BACKEND}/api/ratereview/list`
    url_rate_review_create = `${process.env.REACT_APP_API_BACKEND}/api/ratereview/create/`

    state = {
        movie:{},
        rateReviews:[],
        rateReview:{
            review:'',
            stars: 1,
            movie: 0,
        },
        isAlreadyRatedThisMovieByCurrentUser:false,
        currentRateReviewFromDatabase:{},
        isMovieNotFound:false,
        isLoadingRateReviews:true,
        isLoadingMovie:true,        
    }

    ratingChanged = (newRating) => {
        this.setState(prevstate => ({
            rateReview:{
                ...prevstate.rateReview,
                stars:newRating
            }
        }))
    };

    handle_change = e => {
        const value = e.target.value;
        this.setState(prevstate => ({
                rateReview: {
                ...prevstate.rateReview,
                review: value
            }
         }));
      };

    handle_ratereview = (e) => {

        const token = localStorage.getItem('auth_token');

        if(!token){
            this.props.history.push('/')
        }

        axios.put(this.url_rate_review_create, this.state.rateReview, {headers: {'Authorization': `Token ${token}`}}).then(response =>{
            this.setState({
                currentRateReviewFromDatabase:response.data,
                isAlreadyRatedThisMovieByCurrentUser:true
            });
        });        

        e.preventDefault();

    }


    componentDidMount(){

        const pk = this.props.match.params.pk;

        axios.get(`${this.url_movie_detail}/${pk}`).then(response => {
            
            this.setState({movie:response.data});

            this.setState(prevstate => ({
                ...prevstate, rateReview: {
                    ...prevstate.rateReview,
                    movie: parseInt(pk)
                }
             }));            

            axios.get(`${this.url_rate_review_list}/?idmovie=${pk}`).then(response => {
                
                if(response.data.length !== 0){

                    const currentRateReviewByCurrentUser = response.data.filter((q) => q.owner === this.props.current_user);

                    if(currentRateReviewByCurrentUser.length !== 0){

                        this.setState(prevstate => ({
                            ...prevstate, isAlreadyRatedThisMovieByCurrentUser: true, 
                            currentRateReviewFromDatabase: currentRateReviewByCurrentUser[0]
                         }));

                    }

                    this.setState(prevstate => ({
                        ...prevstate, isLoadingRateReviews: false, 
                     }));

                }                

                this.setState({rateReviews:response.data.filter((q) => q.owner !== this.props.current_user)});
            });

            this.setState(prevstate => ({
                ...prevstate, isLoadingMovie: false, 
             }));
            
        }).catch(error => {
            if(error.response.status && error.response.status === 404){
                this.setState({isMovieNotFound: true, isLoadingMovie: false});                
            }
        });
        
    }

    render(){

        const RateReviews = this.state.rateReviews.map(q => <RateReviewView ratereview={q} key={q.pk}/>);

        const MovieNotFound = (
            <div style={{'backgroundColor':'white', 'padding':'15px', 'margin':'auto'}}>
                <span className="scoreboard__title" style={{'marginLeft':'75px', 'marginBottom': '20px', 'marginTop':'20px', 'fontWeight':'bold', 'display':'block', 'fontSize':'24px'}}>
                    :( Sorry movie not found.
                </span>
                
            </div>
        );
        
        const DefaultMessageUserNoLogged = (
            <>
                <span style={{'margin':'15px'}}>
                    To rate and review this movie you must be logged.  &nbsp;
                    <Link to={{pathname: '/login', state: { prevPath: this.props.location }}}>Login</Link>
                </span>                
            </>
        );


        return (
           <>
           {this.props.isLoadingMovie ? <>Loading...</> : <>
                {this.state.isMovieNotFound === true ? MovieNotFound : <div style={{'backgroundColor':'white', 'padding':'15px', 'margin':'auto'}}>
            
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
                    
                    {!this.props.current_user ? DefaultMessageUserNoLogged : 
                       <>
                       {this.state.isAlreadyRatedThisMovieByCurrentUser? <RateReviewView ratereview={this.state.currentRateReviewFromDatabase} /> :
                            <Card border="primary" style={{ width: '25rem', 'margin': '15px' }}>
                                <Card.Header>
                                    {this.props.current_user}   
                                </Card.Header>
                                <Card.Body>
                                <Card.Title>Rate Review</Card.Title>
                                <form onSubmit={this.handle_ratereview}>
                                    <Card.Text>
                                        <Form.Control required as="textarea" rows={3} style={{'width':'100%', 'height':'100px'}} maxLength="255"  onChange={this.handle_change} value={this.state.rateReview.review} />              
                                    </Card.Text>
                                    <div>
                                    <ReactStars
                                            count={5}
                                            edit={true}
                                            isHalf={false}
                                            size={30}
                                            value={this.state.rateReview.stars}
                                            onChange={this.ratingChanged}
                                            activeColor="#ffd700"
                                        />  
                                    </div>
                                    <Button style={{'marginTop':  '15px'}} type="submit">Save</Button>
                                </form>
                                </Card.Body>
                            </Card>
                            }
                       </> 
                    }
                    
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

            </div>}
                </>}
           </>
        );
    }

}

export default withRouter(Movie);