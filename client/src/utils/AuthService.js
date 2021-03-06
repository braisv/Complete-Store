import axios from 'axios';

export default class AuthService {
  constructor() {
    this.service = axios.create({
      baseURL: `http://localhost:5000/auth`,
      withCredentials: true
    });
  }

  signup = (username, password, name, surname, email, phone) => {
    return this.service.post('/signup', {username, password, name, surname, email, phone })
    .then(response => response.data)
  }

  login = (username, password) => {
    return this.service.post('/login', {username, password})
    .then(response => response.data)
  }

  loggedin = () => {
    return this.service.get('/currentuser',)
    .then(response => response.data)
  }

  logout = () => {
    return this.service.get('/logout',)
    .then(response => {
      return response.data
    })
    .catch(err=>console.log(err))
  }
}