import React, { Component } from 'react'
import { Navigate } from 'react-router-dom';
import axios from 'axios';

export default class Profile extends Component {
  constructor(props) {
    super(props)
    const udata = localStorage.getItem('user')
    const odata = JSON.parse(udata);
    this.onChangeFirstName = this.onChangeFirstName.bind(this);
        this.onChangeLastName = this.onChangeLastName.bind(this);
        this.onChangePhone = this.onChangePhone.bind(this);
        this.onChangeUserEmail = this.onChangeUserEmail.bind(this);
        this.onChangeUserCountry = this.onChangeUserCountry.bind(this);
        this.onChangeUserCategory = this.onChangeUserCategory.bind(this);

        this.onSubmit = this.onSubmit.bind(this);
    let loggedIN = true
    if (udata == null){
      loggedIN = false
    }
    this.state = {
      user : '',
      first_name: '',
      last_name: '',
      phone: '',
      email: '',
      loggedIN
    }
  
}
componentDidMount() {
  // Make an API call to get user data
  if (this.state.loggedIN) {
    const userAccessToken = JSON.parse(localStorage.getItem('user'));
  const accessToken = userAccessToken.access_token;
    axios.post('http://127.0.0.1:8000/api/auth/user-profile', {},{
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    })
      .then((response) => {
        console.log(response.data);
        // Update the state with the current user's information
        this.setState({ user: response.data.user, newsApi: response.data.newsApi, countryList: response.data.totalCountry, categoryList : response.data.categoryList });
      })
      .catch((error) => {
        // Handle errors, such as expired tokens or network issues
        console.error('Error fetching current user:', error);
      });
  }
}
onChangeFirstName(e) {
  // this.setState({ first_name: e.target.value })
  this.setState({
    user: {
      ...this.state.user,
      first_name: e.target.value,
    },
  });
}
onChangeLastName(e) {
  // this.setState({ last_name: e.target.value })
  this.setState({
    user: {
      ...this.state.user,
      last_name: e.target.value,
    },
  });
}
onChangePhone(e) {
  // this.setState({ phone: e.target.value })
  this.setState({
    user: {
      ...this.state.user,
      phone: e.target.value,
    },
  });
}
onChangeUserEmail(e) {
  // this.setState({ email: e.target.value })
  this.setState({
    user: {
      ...this.state.user,
      email: e.target.value,
    },
  });
}
onChangeUserCountry(e) {
  this.setState({
    user: {
      ...this.state.user,
      country: e.target.value,
    },
  });
}

onChangeUserCategory(e) {
  this.setState({
    user: {
      ...this.state.user,
      category: e.target.value,
    },
  });
}

onSubmit(e) {
    e.preventDefault()

if(this.state.user.first_name.length<2 || this.state.user.first_name.length>20 ){
  alert("First-name should be between 2-20 charaters")
}
if(this.state.user.last_name.length<2 || this.state.user.last_name.length>20 ){
  alert("Last-name should be between 2-20 charaters")
}
if(this.state.user.phone.length<5 || this.state.user.phone.length>12 ){
  alert("Phone number should be between 5-12 digits")
}


    const userObject = {
        first_name: this.state.user.first_name,
        last_name: this.state.user.last_name,
        phone: this.state.user.phone,
        email: this.state.user.email,
        country: this.state.user.country,
        category: this.state.user.category
    };
    let userAccessToken = JSON.parse(localStorage.getItem('user'));
    const accessToken = userAccessToken.access_token;
    // console.log(this.state.user);
    axios.post(`http://127.0.0.1:8000/api/auth/user-profile-update/${this.state.user.id}`, userObject, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      })
        .then((res) => {
          //  console.log(res,"aaaaaaaaaaa");
            if(res.data.message === "User successfully updated"){
                alert("Profile update Successful");
                userAccessToken.user = res.data.user;
                localStorage.setItem('user', JSON.stringify(userAccessToken));
                // window.location = "/sign-in";
            }
        }).catch((error) => {
            if(error.response.data ===  "{\"email\":[\"The email has already been taken.\"]}"){
              alert("The email has already been taken.")
            }
        });
    // this.setState({ first_name: '', last_name: '', phone: '', email: '', password: '', password_confirmation: '' })
}
 
  render() {
    if(this.state.loggedIN === false){
      return  <Navigate to="/sign-in" />
    }
    return (
        <div>
        <nav className="App navbar navbar-expand-lg navbar-light bg-light">
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
                 <a className="nav-link" href="/profile">Profile </a>
              </ul>
              <ul className="navbar-nav">
                 <a className="nav-link" href="/logout">logout </a>
              </ul>
          </div>
        </div>
      </nav>

        <div className="auth-inner">
            <form onSubmit={this.onSubmit}>
                <div className="mb-3">
          <label>First name</label>
          <input
            type="text"
            className="form-control"
            placeholder="First name"
            onChange={this.onChangeFirstName}
            name="firstname"
            value={this.state.user.first_name}
          />
         
        </div>
        <div className="mb-3">
          <label>Last name</label>
          <input 
           type="text"
           className="form-control" 
           placeholder="Last name" 
           onChange={this.onChangeLastName}
           name="lastname"
           value={this.state.user.last_name} />
        </div>
        <div className="mb-3">
          <label>Phone Number</label>
          <input
            type="number"
            className="form-control"
            placeholder="Enter phone number"
            onChange={this.onChangePhone}
            name="phone"
            value={this.state.user.phone}
            
          />
        </div>
        <div className="mb-3">
          <label>Email address</label>
          <input
            type="email"
            className="form-control"
            placeholder="Enter email"
            onChange={this.onChangeUserEmail}
            name="email"
            value={this.state.user.email}
          />
        </div>
        <div className="mb-3">
          <label>Country</label>
          <select
            className="form-control"
            onChange={this.onChangeUserCountry}
            name="country"
            value={this.state.user.country}
          >
            <option value="">Select a country</option>
            {this.state.countryList && this.state.countryList.map((country, index) => (
              <option key={index} value={country}>
                {country}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label>category</label>
          <select
            className="form-control"
            onChange={this.onChangeUserCategory}
            name="category"
            value={this.state.user.category}
          >
            <option value="">Select a Category</option>
            {this.state.categoryList && this.state.categoryList.map((category, index) => (
              <option key={index} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
        <div className="d-grid">
        <button type="submit" className="btn btn-primary">
            Update Profile
          </button>
        </div>
            </form>
        </div>
      </div>
    )
  }
}
