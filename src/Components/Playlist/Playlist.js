import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // Agrega esta línea para importar Link
import "./Playlist.scss";
import ReactPlayer from "react-player";

const TableVideo = ({ type, headers, data, onplaylistClick }) => {
  return (
    <table>
      <thead>
        <tr>
          <th colSpan="2">{headers[0]}</th>
        </tr>
      </thead>
      <tbody>
        {data.map((row, index) => (
          <tr key={index}>
            <ReactPlayer
              className="video-r"
              url={row.url}
              controls
              showRelated={false}
              loop
              rel={0}
            />
            <p colSpan="2">
              {" "}
              {headers[1]}: {row.name}
            </p>

            <p colSpan="2">
              {headers[2]}: {row.description}
            </p>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

const Playlist = () => {
  const token = localStorage.getItem("token");
  const playlist = JSON.parse(localStorage.getItem("playlist"));
  const [videos, setVideos] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [videosFilter, setVideosFilter] = useState(videos);

  function convertirVideosATexto(videos) {
    return videos.map(
      (video) =>
        `${video.name.toLowerCase()} ${video.description.toLowerCase()}`
    );
  }

  function handleSearchTermChange(event) {
    setSearchTerm(event.target.value);
    const videosTexto = convertirVideosATexto(videos);
    const videosFiltrados = videos.filter((video, index) => {
      return videosTexto[index].includes(event.target.value.toLowerCase());
    });
    setVideosFilter(videosFiltrados);
  }

  useEffect(() => {
    const chargeplaylists = async () => {
      const urllogin = `http://localhost:3001/graphql`;
      try {
        const response = await fetch(urllogin, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            query: `query { getVideosPlaylist(idplaylist: "${playlist.id}") {id name url description} }`,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.log(errorData.error);
          throw new Error("Network response was not ok");
        }
        const { data } = await response.json();
        setVideos(data.getVideosPlaylist);
        setVideosFilter(data.getVideosPlaylist);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    chargeplaylists();

    console.log();
  }, []);
  return (
    <div className="playlist-container">
      <div className="titulo">
        <h1>{playlist.name} </h1>
        <div className="videos">
          <TableVideo
            type="select"
            data={videosFilter}
            headers={["Video", "Nombre", "Descripcion"]}
          />
        </div>
      </div>
      <div className="Buscador">
        <input
          class="input"
          name="text"
          className="input"
          type="search"
          required=""
          placeholder="Search..."
          id="search"
          value={searchTerm}
          onChange={handleSearchTermChange}
        />
      </div>
      <div className="button-container">
        <Link to="/Playlists">
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
