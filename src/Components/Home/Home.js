import React, { useState, useEffect } from "react";
import "./Home.scss";
import User from "../User/User";
import PinDisplay from "../PinDisplay/PinDisplay";
import { useNavigate } from "react-router-dom";
import Perfil from "../../Accets/Perfil-usuario.webp";
import avatar1 from "../../Accets/1.jpg";
import avatar2 from "../../Accets/2.jpg";
import avatar3 from "../../Accets/3.jpg";

const Home = () => {
  const token = localStorage.getItem("token");
  const Userinfo = JSON.parse(localStorage.getItem("DataUser"));
  const [showManageUsersPin, setShowManageUsersPin] = useState(false);
  const [showManageVideosPin, setShowManageVideosPin] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
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
            query: `query { getAccountsUser(iduser: "${Userinfo.id}") {id firstName avatar age pin} }`,
          }),
        });

        if (!response.ok) {
          throw new Error("Error fetching users");
        }
        const { data } = await response.json();
        setUsers(data.getAccountsUser);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    chargeAccounts();
  }, []);

  const validateAdminPin = (pin) => {
    const userData = JSON.parse(localStorage.getItem("DataUser") || "{}");
    console.log(userData);

    if (userData) {
      return userData.pin === Number(pin);
    } else return false;
  };

  const validateUserPin = (pin) => {
    if (selectedUser?.pin) {
      return selectedUser.pin === Number(pin);
    } else return false;
  };
  const chargeAvatars = (avatar) => {
    if (avatar === "Avatar1") {
      return avatar1;
    } else {
      if (avatar === "Avatar2") {
        return avatar2;
      } else {
        if (avatar === "Avatar3") {
          return avatar3;
        } else {
          return Perfil;
        }
      }
    }
  };

  return (
    <div className="boddys">
      <PinDisplay
        show={showManageUsersPin}
        setShow={setShowManageUsersPin}
        onSuccess={() => navigate("/manage-users")}
        validatePin={validateAdminPin}
      />

      <PinDisplay
        show={showManageVideosPin}
        setShow={setShowManageVideosPin}
        onSuccess={() => navigate("/manage-playlists")}
        validatePin={validateAdminPin}
      />

      <PinDisplay
        show={Boolean(selectedUser?.pin)}
        setShow={setSelectedUser}
        onSuccess={() => navigate("/playlists")}
        validatePin={validateUserPin}
      />

      <div className="user">
        <User />
      </div>
      <div className="Titulo">
        <p>¿Quién está viendo ahora?</p>
      </div>

      <div className="users-container">
        {users.map((user, index) => (
          <div
            className="user-card"
            key={index}
            onClick={() => setSelectedUser(user)}
          >
            <img src={chargeAvatars(user.avatar)} alt="Avatar" />
            <div className="user-info">
              <p>{user.firstName}</p>
            </div>
          </div>
        ))}

        <button className="icon-botton add-botton ">
          <div class="add-icon"></div>
          <div class="botton-txt" onClick={() => setShowManageUsersPin(true)}>
            Agregar perfil{" "}
          </div>
        </button>
      </div>

      <button className="btn" onClick={() => setShowManageVideosPin(true)}>
        Administrar playlist
      </button>
    </div>
  );
};

export default Home;
