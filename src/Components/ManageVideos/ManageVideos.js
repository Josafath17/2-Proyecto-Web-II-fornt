import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // Importa Link desde react-router-dom
import "./ManageVideos.scss";
import Table from "../Table/Table";
import Modal from "../Modal/Modal";
import { wait } from "@testing-library/user-event/dist/utils";

const AddOrUpdateVideo = ({ handleClose, type, playlist, video }) => {
  const User = JSON.parse(localStorage.getItem("DataUser"));
  const [name, setName] = useState(video.name);
  const [url, setUrl] = useState(video.url);

  const [formData, setFormData] = useState({
    name: name,
    url: url,
    playlist: playlist._id,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Form values:", formData);

    if (type === "add") {
      console.log();
      if (!playlist._id) {
        const data = {
          user: User._id,
        };
        console.log(data);
        const create = await createplaylist(data);
        if (create) {
          console.log(data);
          addvidoe();
        }
        return;
      }
      addvidoe();
    } else {
      updatevidoe(video.id);
    }
  };

  const createplaylist = async (body) => {
    const urllogin = `http://localhost:3000/api/playlists`;
    try {
      const response = await fetch(urllogin, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.log(errorData.error);
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      playlist = data;
      setFormData({ ...formData, playlist: playlist._id });
      return true;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    return false;
  };

  const addvidoe = async () => {
    const urllogin = `http://localhost:3000/api/videos`;
    try {
      const response = await fetch(urllogin, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.log(errorData.error);
        throw new Error("Network response was not ok");
      }
      window.location.reload();
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const updatevidoe = async (videoid) => {
    const urllogin = `http://localhost:3000/api/videos?id=${videoid}`;
    try {
      const response = await fetch(urllogin, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        console.log(errorData.error);
        throw new Error("Network response was not ok");
      }
      window.location.reload();
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className="add-or-update-video">
      <div>
        <h1>{type === "add" ? "Agregar" : "Actualizar"} video</h1>
      </div>
      <form onSubmit={handleSubmit}>
        <input
          name="name"
          type="text"
          placeholder="Nombre del video"
          required
          value={formData.name}
          onChange={handleInputChange}
        />
        <input
          name="url"
          type="text"
          placeholder="Url del video"
          required
          value={formData.url}
          onChange={handleInputChange}
        />

        <div className="buttons">
          <button onClick={handleClose}>Cancelar</button>
          <button type="submit">Guardar</button>
        </div>
      </form>
    </div>
  );
};

const ManageVideos = () => {
  const User = JSON.parse(localStorage.getItem("DataUser"));
  const [modalType, setModalType] = useState("");
  const [playlists, setPlaylists] = useState([]);
  const [playlist, setPlaylist] = useState();
  const [videos, setVideos] = useState([]);
  const [video, setVideo] = useState([]);

  useEffect(() => {
    const chargeplaylists = async () => {
      const urllogin = `http://localhost:3000/api/playlists?userid=${User._id}`;
      try {
        const response = await fetch(urllogin, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.log(errorData.error);
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        console.log("data");
        console.log(data);
        setPlaylists(data);
        const chargevideos = [];
        await data.map(async (playlist) => {
          const videos = await chbargeVideos(playlist._id);
          console.log("1 videos");
          console.log(videos);
          await videos.map((video) => {
            const newvideo = {
              id: video._id,
              name: video.name,
              url: video.url,
              playlist: video.playlist,
            };
            console.log("2 video");
            console.log(newvideo);
            chargevideos.push(newvideo);
            console.log("3 chargevideos");
            console.log(chargevideos);
            setVideos(chargevideos);
          });
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    chargeplaylists();

    console.log();
  }, []);

  const chbargeVideos = async (playlistid) => {
    const urllogin = `http://localhost:3000/api/videos?playlistid=${playlistid}`;
    try {
      const response = await fetch(urllogin, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.log(errorData.error);
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleDelete = async (videoid) => {
    const urllogin = `http://localhost:3000/api/videos?id=${videoid}`;
    try {
      const response = await fetch(urllogin, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.log(errorData.error);
        throw new Error("Network response was not ok");
      }
      window.location.reload();
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <div className="manage-videos-container">
      <Modal show={modalType} handleClose={() => setModalType("")}>
        <AddOrUpdateVideo
          video={video}
          type={modalType}
          handleClose={() => setModalType("")}
          videoId={video._id}
          playlist={playlist}
        />
      </Modal>
      <div className="titulo">
        <h1>Playlist general</h1>
      </div>

      <Table
        data={videos}
        headers={["Nombre", "Url"]}
        onEditClick={() => {
          const playlist = playlists.filter(
            (playlist) => playlist._id === video.playlist
          );
          setPlaylist(playlist);
          setModalType("edit");
        }}
        onDeleteClick={handleDelete}
        setAccount={setVideo}
      />
      <button
        onClick={() => {
          setModalType("add");
          setPlaylist({});
          setVideo([]);
        }}
      >
        Agregar video
      </button>

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

export default ManageVideos;
