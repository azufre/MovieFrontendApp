import { React, Component } from "react";
import MovieCard from './MovieCard';
import {FormControl} from 'react-bootstrap';
import axios from 'axios';

export default class ContainerMovie extends Component {
    
    constructor(){
        
        super();

        this.url_movie = `${process.env.REACT_APP_API_BACKEND}/api/movie/list/`;

        this.state = {
            movies: []
        }                    
        
        this.style = {
            'display': 'flex',
            'flexWrap': 'wrap',
            'justifyContent': 'center'
        }

        this.search = this.search.bind(this);

    }
    
    componentDidMount(){

        axios.get(this.url_movie).then(response => {
            this.setState({movies:response.data});    
        });

    }

    search(event) {
        if (event.charCode === 13) {
            axios.get(this.url_movie + `?title=${event.target.value}`).then(response => {
                this.setState({movies:response.data});    
            });
        }
    }

    render() {
                        
        const movieCars = this.state.movies.map(movie => <MovieCard movie={movie} key={movie.pk} />);
        
        const NoMoviesFound = <>
                                <p style={{'fontSize':18, 'padding':'15px'}}>Movies not found</p>
                              </>

        return (
            <div>
                <h1>
                    Movies
                </h1>
                <FormControl placeholder="Search movies" onKeyPress={this.search}></FormControl>
                <div style={this.style}>
                    {movieCars.length === 0 ? NoMoviesFound : movieCars}            
                </div>
            </div>
        );
    }


}
