import React from "react";
import { useParams, useNavigate } from "react-router-dom";

import "./Confirm.scss";

function Confirm() {
  const navigate = useNavigate();
  const { id } = useParams();

  const confirmaccount = async () => {
    console.log("xd");
    const urllogin = `http://localhost:3000/api/usersconfirm?id=${id}`;
    await fetch(urllogin, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
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

        navigate("/")
        return;
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  return (
    <div className="Confirm_cart">
      <h3>Confirma tu Cuenta</h3>
      <div className="Container_button">
        <button className="Confirm_button" onClick={() => confirmaccount()}>
          Confirm Account
        </button>
      </div>
    </div>
  );
}

export default Confirm;
