import './App.scss';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import React, { createContext, useState, useEffect } from 'react';
import Login from "./Components/Login/login";
import Home from "./Components/Home/Home";
import Register from "./Components/Register/Register";
import ManageUsers from './Components/ManageUsers/ManageUsers';
import ManagePlaylists from './Components/ManagePlaylists/ManagePlaylists';
import ManageVideos from './Components/ManageVideos/ManageVideos';
import Playlists from './Components/Playlists/Playlists';
import Playlist from './Components/Playlist/Playlist';
import Confirm from './Components/Confirm/Confirm';



const AppContext = createContext();
export { AppContext };



function App() {

  const [logeado, setLogeado] = useState(localStorage.getItem('logeado'));

  useEffect(()=>{
    setLogeado(localStorage.getItem('logeado'))
  },[logeado, setLogeado])



  return (
    <BrowserRouter>
      <div className="App">
        <div className="Components">
          <Routes>
            <Route path="/" element={logeado ? <Navigate to="/Home" /> : <Navigate to="/Login" />} />
            <Route path="/Login" element={ logeado ?
              (<Navigate to="/" />)
              : (<AppContext.Provider value={{ logeado, setLogeado }}>
                <Login />
              </AppContext.Provider>)
            } />
            <Route path="/Home" element={
              logeado ? (
                <AppContext.Provider value={{ logeado, setLogeado }}>
                  <Home />
                </AppContext.Provider>) 
              : (<Navigate to="/" />)
            } />
            <Route
              path='/Register'
              element={<Register />}
            />
            <Route path="/manage-users" element={
              logeado ? (
                <AppContext.Provider value={{ logeado, setLogeado }}>
                  <ManageUsers />
                </AppContext.Provider>
              ) : (<Navigate to="/" />)
            } />
            <Route path="/manage-videos" element={
              logeado ? (
                <AppContext.Provider value={{ logeado, setLogeado }}>
                  <ManageVideos />
                </AppContext.Provider>
              ) : (<Navigate to="/" />)
            } />
            <Route path="/manage-playlists" element={
              logeado ? (
                <AppContext.Provider value={{ logeado, setLogeado }}>
                  <ManagePlaylists />
                </AppContext.Provider>
              ) : (<Navigate to="/" />)
            } />
            <Route path="/playlists" element={
              logeado ? (
                <AppContext.Provider value={{ logeado, setLogeado }}>
                  <Playlists />
                </AppContext.Provider>
              ) : (<Navigate to="/" />)
            } />
            <Route path="/playlist" element={
              logeado ? (
                <AppContext.Provider value={{ logeado, setLogeado }}>
                  <Playlist />
                </AppContext.Provider>
              ) : (<Navigate to="/" />)
            } />
            <Route 
              path="/ConfirmAccount/:id" 
              element={<Confirm />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
