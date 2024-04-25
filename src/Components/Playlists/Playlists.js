import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom"; // Agrega esta línea para importar Link
import "./Playlists.scss";

const TablePlaylist = ({ type, headers, data, onplaylistClick }) => {
  return (
    <table>
      <thead>
        <tr>
          {headers.map((header, index) => (
            <th key={index}>{header}</th>
          ))}
          <th colSpan="2">Acciones</th>
        </tr>
      </thead>
      <tbody>
        {data.map((row, index) => (
          <tr key={index}>
            {Object.values(row).map((value, index) => {
              const pregunta = !(index === 0);
              return pregunta ? <td key={index}>{value}</td> : <></>;
            })}
            <td>
              <button onClick={() => onplaylistClick(row)}>{type}</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

const Playlist = () => {
  const token = localStorage.getItem("token");
  const User = JSON.parse(localStorage.getItem("DataUser") || "{}");
  const Account = JSON.parse(localStorage.getItem("AccountEdit") || "{}");
  const [playlistAccount, setPlaylistAccount] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const chargeAccounts = async () => {
      // Lógica para obtener la lista de usuarios al cargar el componente
      const urllogin = `http://localhost:3001/graphql`;
      try {
        const response = await fetch(urllogin, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            query: `query { getAccount(id: "${Account.id}") {playlists}, getPlaylistsUser(iduser: "${User.id}") {id name} } `,
          }),
        });

        if (!response.ok) {
          throw new Error("Error fetching users");
        }
        const { data } = await response.json();

        const playlistPromises = data.getAccount.playlists.map(
          async (playlistid) => {
            return await chargeplayistaccount(playlistid);
          }
        );
        const playlists = await Promise.all(playlistPromises);

        setPlaylistAccount(playlists);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    const chargeplayistaccount = async (playlistId) => {
      const urllogin = `http://localhost:3001/graphql`;
      const response = await fetch(urllogin, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          query: `query { getPlaylist(id: "${playlistId}") {id name} } `,
        }),
      });
      if (!response.ok) {
        throw new Error("Error fetching users");
      }
      const { data } = await response.json();
      return data.getPlaylist;
    };

    chargeAccounts();
  }, []);

  return (
    <div className="playlist-container">
      <div className="titulo">
        <h1>Playlists </h1>
        <div className="playlists">
          <TablePlaylist
            type="select"
            data={playlistAccount}
            headers={["Nombre"]}
            onplaylistClick={(playlist) => {
              localStorage.setItem("playlist", JSON.stringify(playlist));
              navigate("/playlist");
            }}
          />
        </div>
      </div>
      <div className="button-container">
        <Link to="/">
          <button className="button">
            <div className="button-box">
              <span className="button-elem">
                <svg viewBox="0 0 46 40" xmlns="http://www.w3.org/2000/svg">
                  <path d="M46 20.038c0-.7-.3-1.5-.8-2.1l-16-17c-1.1-1-3.2-1.4-4.4-.3-1.2 1.1-1.2 3.3 0 4.4l11.3 11.9H3c-1.7 0-3 1.3-3 3s1.3 3 3 3h33.1l-11.3 11.9c-1 1-1.2 3.3 0 4.4 1.2 1.1 3.3.8 4.4-.3l16-17c.5-.5.8-1.1.8-1.9z"></path>
                </svg>
              </span>
              <span className="button-elem">
                <svg viewBox="0 0 46 40">
                  <path d="M46 20.038c0-.7-.3-1.5-.8-2.1l-16-17c-1.1-1-3.2-1.4-4.4-.3-1.2 1.1-1.2 3.3 0 4.4l11.3 11.9H3c-1.7 0-3 1.3-3 3s1.3 3 3 3h33.1l-11.3 11.9c-1 1-1.2 3.3 0 4.4 1.2 1.1 3.3.8 4.4-.3l16-17c.5-.5.8-1.1.8-1.9z"></path>
                </svg>
              </span>
            </div>
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Playlist;
