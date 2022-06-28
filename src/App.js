import logo from './logo.svg';
import './App.css';
import SignUp from "./components/signup"
import SignIn from "./components/signin"
import React from 'react';
import { Routes, Route, Link, Navigate } from "react-router-dom";
import Home from './components/home';
import MovieList from './components/movielist';
import MovieListDetailed from './components/MovieListDetailed';

const AuthWrapper = () => {
  return (localStorage.getItem('user_data') != null
    ? <Home/>
    : <Navigate to="/login" replace />)
};

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<AuthWrapper/>}></Route>
        <Route path="/register" element={<SignUp/>}></Route>
        <Route path="login" element={<SignIn/>}></Route>
        <Route path="movie-list" element={<MovieList/>}></Route>
        <Route path="movie-list/:id" element={<MovieListDetailed/>}></Route>
      </Routes>
    </div>
  );
}

export default App;
