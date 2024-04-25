import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.scss";
import { AppContext } from "../../App";
import PinDisplay from "../PinDisplay/PinDisplay";

function Login() {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [datauser, setDatauser] = useState({});
  const navigate = useNavigate();
  const [erroruser, setErroruser] = useState("");

  const [showManageUsersPin, setShowManageUsersPin] = useState(false);

  const { logeado, setLogeado } = useContext(AppContext);

  useEffect(() => {
    // console.log("logueado")
    // console.log(!!datauser.id)
    // if (!!datauser.id) {
    //   localStorage.setItem("DataUser", JSON.stringify(datauser));
    //   navigate("/Home");
    // }
  }, [navigate, datauser, setDatauser]);

  const Validar = async () => {
    if (!email || !password) {
      if (!email && password) {
        alert("Favor introducir un Email");
      }
      if (!password && email) {
        alert("Favor introducir una contraseña");
      }
      if (!email && !password) {
        alert("Favor Llenar los campos");
      }
    } else {
      const data = {
        username: email,
        password: password,
      };
      await fetch("http://localhost:3000/api/session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          console.log("Exito");
          console.log(data);
          localStorage.setItem("token", data);
          setShowManageUsersPin(true);
        })

        .catch((err) => {
          console.log("error: " + err);
          setErroruser("EL usurio o contraseña son invalidos");
        });
    }
  };

  const Verificar = async (pin) => {
    let respuesta;
    const token = localStorage.getItem("token");
    const data = {
      code: pin,
    };
    await fetch("http://localhost:3000/api/authorization", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Exito valido");
        console.log(data);
        const user = {
          id: data.user.id,
          pin: data.user.pin,
          firstName: data.user.firstName,
          lastName: data.user.lastName,
        };
        console.log(user);
        localStorage.setItem("token", data.token);
        localStorage.setItem("DataUser", JSON.stringify(user));
        localStorage.setItem("logeado", true);
        setLogeado(true);
        respuesta = true;
      })

      .catch((err) => {
        console.log("error: " + err);
        alert("Codigo no valido");
        respuesta = false;
      });
    return respuesta;
  };

  return (
    <>
      <PinDisplay
        show={showManageUsersPin}
        setShow={setShowManageUsersPin}
        validatePin={(pin) => Verificar(pin)}
        onSuccess={() => {}}
      />
      <div className="boddylogin">
        <div id="hero">
          <div className="container1">
            <h1>Login</h1>
            <div id="contain">
              <div className="errormesage">
                <p>{erroruser}</p>
              </div>

              <div className="tex_field">
                <input
                  className="email"
                  type="mail"
                  onChange={(ev) => setEmail(ev.target.value)}
                  required
                />
                <span></span>
                <label>Email </label>
              </div>
              <div className="tex_field">
                <input
                  className="contra"
                  type="password"
                  onChange={(ev) => setPassword(ev.target.value)}
                  required
                />
                <span></span>
                <label>Password</label>
              </div>
              <div className="forget">
                <label htmlFor="">
                  <input type="checkbox" />
                  Recordar
                </label>
                <a href="/#">Olvidé la Contraseña</a>
              </div>
              <input type="submit" value="Login" onClick={() => Validar()} />

              <div className="register">
                <p>
                  No cuento con una cuenta <a href="/Register">Registrate</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
