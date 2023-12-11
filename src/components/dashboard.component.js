import React, { Component } from 'react'
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import NewsArticle  from './NewsArticle';

export default class Dashboard extends Component {
  constructor(props) {
    super(props)
    const udata = localStorage.getItem('user')
    const odata = JSON.parse(udata)
    let loggedIN = true
    if (udata == null){
      loggedIN = false
    }
    this.state = {
      user : odata.user,
      newsApi: null,
      loggedIN
    }
}

componentDidMount() {
  // Check if the user is logged in before making the API call
  console.log(this.state);
  if (this.state.loggedIN) {
    // Call your API to get the current user's information
    this.getCurrentUser();
  }
}

getCurrentUser() {
  const { user } = this.state;
  const userAccessToken = JSON.parse(localStorage.getItem('user'));
  const accessToken = userAccessToken.access_token;
  if (accessToken) {
    // Make an API call to retrieve the current user's information
    axios.post('http://127.0.0.1:8000/api/auth/user-profile', {},{
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    })
      .then((response) => {
        console.log(response.data);
        // Update the state with the current user's information
        this.setState({ user: response.data.user, newsApi: response.data.newsApi });
      })
      .catch((error) => {
        // Handle errors, such as expired tokens or network issues
        console.error('Error fetching current user:', error);
      });
  }
}
  render() {
    if(this.state.loggedIN === false){
      return  <Navigate to="/sign-in" />
    }
    const { newsApi } = this.state;
    console.log(newsApi);
    return (
      
        <div>
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          {/* <a className="navbar-brand" href="/dashboard">WebApp</a> */}
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <a className="nav-link active" aria-current="page" href="/dashboard">Home</a>
              </li>
              </ul>
              <ul className="navbar-nav">
                 <a class="nav-link" href="/profile">Profile </a>
              </ul>
              <ul className="navbar-nav">
                 <a class="nav-link" href="/logout">logout </a>
              </ul>
          </div>
        </div>
      </nav>

      <h1 className="text-black mt-5">welcome to your profile <span className="text-primary">{this.state.user.first_name} </span></h1>
      <div className="container mt-4">
        <h1>Latest News From News Api</h1>

        {newsApi && newsApi.articles.map((article, index) => (
          <NewsArticle key={index} article={article} />
        ))}
      </div>
      </div>
    )
  }
}
