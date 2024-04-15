import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.scss";
import { AppContext } from "../../App";

function Login() {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [datauser, setDatauser] = useState([]);
  const navigate = useNavigate();
  const [erroruser, setErroruser] = useState("");

  const { logeado, setLogeado } = useContext(AppContext);

  useEffect(() => {
    if (!!datauser.id) {
      setLogeado(true);
      setErroruser("");
    }

    if (logeado) {
      localStorage.setItem("token", true);
      localStorage.setItem("DataUser", JSON.stringify(datauser));
      navigate("/Home");
    }
  }, [logeado, navigate, setLogeado, datauser]);

  const Confirm = (usertrue, passwordtrue) => {
    if (usertrue == email && passwordtrue == password) {
      return true;
    } else {
      console.log("no se encontro");
      return false;
    }
  };

  const esCorreoValido = (correo) => {
    var regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$/;
    return regex.test(correo);
  };
  const Validar = () => {
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
      fetch("http://localhost:3000/api/users", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          data.forEach((user) => {
            if (esCorreoValido(email)) {
              if (Confirm(user.username, user.password)) {
                setDatauser(user);
                setLogeado(true);
                return;
              }
              setErroruser("EL usurio o contraseña son invalidos");
            }
          });
        })

        .catch((err) => {
          console.log("error: " + err);
          alert("Datos incorrectos");
        });
    }
  };

  return (
    <>
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
                  type="text"
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
