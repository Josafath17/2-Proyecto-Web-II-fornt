import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // Importa Link desde react-router-dom
import "./ManageVideos.scss";
import Table from "../Table/Table";
import Modal from "../Modal/Modal";
import { wait } from "@testing-library/user-event/dist/utils";

const AddOrUpdateVideo = ({ handleClose, type, playlist, video }) => {
  const token = localStorage.getItem("token");
  const User = JSON.parse(localStorage.getItem("DataUser"));
  const [name, setName] = useState(video.name);
  const [url, setUrl] = useState(video.url);
  const [description, setDescription] = useState(video.description);

  const [formData, setFormData] = useState({
    name: name,
    url: url,
    description: description,
    playlist: playlist.id,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Form values:", formData);

    if (type === "add") {
      console.log();
      addvidoe();
    } else {
      updatevidoe(video.id);
    }
  };

  const addvidoe = async () => {
    const urllogin = `http://localhost:3000/api/videos`;
    try {
      const response = await fetch(urllogin, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
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
          authorization: `Bearer ${token}`,
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
    console.log(value)

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
          required
          placeholder="Url del video"
          value={formData.url}
          onChange={handleInputChange}
        />
        <input
          name="description"
          type="text"
          placeholder="Descripccion del video"
          value={formData.description}
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
  const token = localStorage.getItem("token");
  const User = JSON.parse(localStorage.getItem("DataUser"));
  const playlist = JSON.parse(localStorage.getItem("PlaylistEdit"));
  const [modalType, setModalType] = useState("");
  const [videos, setVideos] = useState([]);
  const [video, setVideo] = useState([]);

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
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    chargeplaylists();

    console.log();
  }, []);

  const handleDelete = async (videoid) => {
    const urllogin = `http://localhost:3000/api/videos?id=${videoid}`;
    try {
      const response = await fetch(urllogin, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
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
        <h1>{playlist.name}</h1>
      </div>

      <Table
        data={videos}
        headers={["Nombre", "Url", "Descripccion"]}
        onEditClick={() => {
          // const playlist = playlists.filter(
          //   (playlist) => playlist._id === video.playlist
          // );
          // setPlaylist(playlist);
          setModalType("edit");
        }}
        onDeleteClick={handleDelete}
        setAccount={setVideo}
      />
      <button
        onClick={() => {
          setModalType("add");
          setVideo([]);
        }}
      >
        Agregar video
      </button>

      <div className="button-container">
        <Link to="/manage-playlists">
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
