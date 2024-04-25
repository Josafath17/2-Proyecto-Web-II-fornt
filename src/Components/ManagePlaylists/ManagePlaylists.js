import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom"; // Importa Link desde react-router-dom
import "./ManagePlaylists.scss";
import Table from "../Table/Table";
import Modal from "../Modal/Modal";
import { wait } from "@testing-library/user-event/dist/utils";

const AddOrUpdatePlaylist = ({ handleClose, type, playlist }) => {
  const token = localStorage.getItem("token");
  const User = JSON.parse(localStorage.getItem("DataUser"));
  const [name, setName] = useState(playlist.name);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: name,
    user: User.id,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Form values:", formData);

    if (type === "add") {
      addplaylist();
    } else {
      updateplaylist(playlist.id);
    }
  };

  const addplaylist = async () => {
    const urllogin = `http://localhost:3000/api/playlists`;
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

  const updateplaylist = async (playlistsid) => {
    const urllogin = `http://localhost:3000/api/playlists?id=${playlistsid}`;
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

    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className="add-or-update-video">
      <div>
        <h1>{type === "add" ? "Agregar" : "Actualizar"} playlist</h1>
      </div>
      <form onSubmit={handleSubmit}>
        <input
          name="name"
          type="text"
          placeholder="Nombre de la playlist"
          required
          value={formData.name}
          onChange={handleInputChange}
        />

        <div className="buttons">
          {type === "edit" ? (
            <button
              onClick={() => {
                localStorage.setItem("PlaylistEdit", JSON.stringify(playlist));
                navigate("/manage-videos");
              }}
            >
              Editar Videos
            </button>
          ) : (
            <></>
          )}

          <button onClick={handleClose}>Cancelar</button>
          <button type="submit">Guardar</button>
        </div>
      </form>
    </div>
  );
};

const ManagePlaylists = () => {
  const token = localStorage.getItem("token");
  const User = JSON.parse(localStorage.getItem("DataUser"));
  const [modalType, setModalType] = useState("");
  const [playlists, setPlaylists] = useState([]);
  const [playlist, setPlaylist] = useState();

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
            query: `query { getPlaylistsUser(iduser: "${User.id}") {id name} }`,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.log(errorData.error);
          throw new Error("Network response was not ok");
        }
        const { data } = await response.json();
        setPlaylists(data.getPlaylistsUser);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    chargeplaylists();

    console.log();
  }, []);

  const handleDelete = async (playlistsid) => {
    const urllogin = `http://localhost:3000/api/playlists?id=${playlistsid}`;
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
        <AddOrUpdatePlaylist
          type={modalType}
          handleClose={() => setModalType("")}
          playlist={playlist}
        />
      </Modal>
      <div className="titulo">
        <h1>Playlists</h1>
      </div>

      <Table
        data={playlists}
        headers={["Nombre"]}
        onEditClick={() => {
          setModalType("edit");
        }}
        onDeleteClick={handleDelete}
        setAccount={setPlaylist}
      />
      <button
        onClick={() => {
          setModalType("add");
          setPlaylist({});
        }}
      >
        Agregar playlist
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

export default ManagePlaylists;
