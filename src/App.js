import './App.scss';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import React, { createContext, useState } from 'react';
import Login from "./Components/Login/login";
import Home from "./Components/Home/Home";
import Register from "./Components/Register/Register";
import ManageUsers from './Components/ManageUsers/ManageUsers';
import ManageVideos from './Components/ManageVideos/ManageVideos';
import Playlist from './Components/Playlist/Playlist';



const AppContext = createContext();
export { AppContext };



function App() {

  const [logeado, setLogeado] = useState(localStorage.getItem('token'));



  return (
    <BrowserRouter>
      <div className="App">
        <div className="Components">
          <Routes>
            <Route path="/" element={logeado ? <Navigate to="/Home" /> : <Navigate to="/Login" />} />
            <Route path="/Login" element={
              <AppContext.Provider value={{ logeado, setLogeado }}>
                <Login />
              </AppContext.Provider>
            } />
            <Route path="/Home" element={
              logeado ? (
                <AppContext.Provider value={{ logeado, setLogeado }}>
                  <Home />
                </AppContext.Provider>
              ) : (<Navigate to="/" />)
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
            <Route path="/playlist" element={
              logeado ? (
                <AppContext.Provider value={{ logeado, setLogeado }}>
                  <Playlist />
                </AppContext.Provider>
              ) : (<Navigate to="/" />)
            } />

          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
