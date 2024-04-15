import React, { useState, useEffect } from "react";
import "./ManageUsers.scss";
import { Link } from "react-router-dom";
import Table from "../Table/Table";
import Modal from "../Modal/Modal";

const AddOrUpdateVideo = ({ handleClose, type, account }) => {
  const [firstName, setFirstName] = useState(account.firstName);
  const [avatar, setAvatar] = useState(account.avatar);
  const [age, setAge] = useState(account.age);
  const [pin, setPin] = useState(account.pin);
  const userData = JSON.parse(localStorage.getItem("DataUser") || "{}");

  const [formData, setFormData] = useState({
    firstName: firstName,
    avatar: avatar,
    age: age,
    pin: pin,
    user: userData._id,
  });
  console.log(formData.avatar);

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Form values:", formData);

    if (type === "add") {
      agregar();
      // Implementar Add
    } else {
      actualizar(account.id);
      // Implementar Update
    }
  };
  const actualizar = async (userId) => {
    const urlAccount = `http://localhost:3000/api/accounts/?id=${userId}`;

    await fetch(urlAccount, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => {
        if (!response.ok) {
          response.json().then((errorData) => {
            console.log(errorData.error);
          });

          throw new Error("Network response was not ok");
        }

        return response.json();
      })
      .then((data) => {
        console.log(data);
        window.location.reload();
      })
      .catch((err) => {
        console.error(err);
        // Manejar errores de manera apropiada
      });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // const updatedValue = name === 'pin' ? parseInt(value) : value;

    setFormData({ ...formData, [name]: value });
  };

  const handlePinChange = (event) => {
    event.target.value = event.target.value.replace(/\D/g, "");
    handleInputChange(event);
  };

  const agregar = async () => {
    const urlaccount = "http://localhost:3000/api/accounts";

    await fetch(urlaccount, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => {
        console.log(2);
        if (!response.ok) {
          response.json().then((errorData) => {
            console.log(errorData.error);
          });

          throw new Error("Network response was not ok");
        }

        console.log(4);
        return response.json();
      })
      .then((data) => {
        console.log(data);
        window.location.reload();
      })
      .catch((err) => {
        /* setErrorRegister(err.message); */
      });
  };

  return (
    <div className="add-or-update-user">
      <h1>{type === "add" ? "Agregar" : "Actualizar"} usuario</h1>

      <form onSubmit={handleSubmit}>
        <input
          name="firstName"
          type="text"
          placeholder="Nombre del usuario"
          value={formData.firstName}
          onChange={handleInputChange}
          required
        />
        <select
          name="avatar"
          value={formData.avatar}
          onChange={handleInputChange}
          required
        >
          <option value="">Seleccione el avatar del usuario</option>
          <option value="Avatar1">Avatar1</option>
          <option value="Avatar2">Avatar2</option>
        </select>
        <input
          name="age"
          type="number"
          placeholder="Edad del usuario"
          value={formData.age}
          onChange={handleInputChange}
          required
        />
        <input
          name="pin"
          type="text"
          maxLength="6"
          placeholder="Pin del usuario"
          value={formData.pin}
          onChange={handlePinChange}
          required
        />

        <div className="buttons">
          <button type="button" onClick={handleClose}>
            Cancelar
          </button>

          <button type="submit">Guardar</button>
        </div>
      </form>
    </div>
  );
};

const ManageUsers = () => {
  const [modalType, setModalType] = useState("");
  const [users, setUsers] = useState([]);
  const [accounts, setAccounts] = useState([]);
  useEffect(() => {
    // Lógica para obtener la lista de usuarios al cargar el componente
    fetch("http://localhost:3000/api/accounts")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error fetching users");
        }
        return response.json();
      })

      .then((data) => {
        const accountfilter = [];
        data.forEach((account) => {
          // Utilizar la función Confirm y setDatauser
          accountfilter.push({
            id: account._id,
            firstName: account.firstName,
            avatar: account.avatar,
            age: account.age,
            pin: account.pin,
          });
        });
        setUsers(data);
        setAccounts(accountfilter);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const handleDelete = async (userId) => {
    //Implementar Delete
    const urlaccount = `http://localhost:3000/api/accounts/?id=${userId}`;
    await fetch(urlaccount, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        console.log(2);
        if (!response.ok) {
          response.json().then((errorData) => {
            console.log(errorData.error);
          });

          throw new Error("Network response was not ok");
        }
        console.log(4);
        window.location.reload();
        return
      })
      .catch((err) => {
        /* setErrorRegister(err.message); */
      });
  };
  const [account, setAccount] = useState([]);
  return (
    <div className="manage-users-container">
      <Modal show={modalType} handleClose={() => setModalType("")}>
        {
          <AddOrUpdateVideo
            account={account}
            type={modalType}
            handleClose={() => setModalType("")}
            accountId={account._id}
          />
        }
      </Modal>

      <div className="titulo">
        <h1>Playlist general</h1>
      </div>
      <Table
        users={users}
        data={accounts}
        headers={["Nombre", "Avatar", "Edad", "Pin"]}
        onEditClick={() => setModalType("edit")}
        onDeleteClick={handleDelete}
        setAccount={setAccount}
      />
      <button
        onClick={() => {
          setModalType("add");
          setAccount([]);
        }}
      >
        Agregar usuario
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

export default ManageUsers;
