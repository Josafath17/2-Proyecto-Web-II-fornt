import './User.scss';
import React, { useState, useEffect, useContext } from 'react';
import img from '../../Accets/Perfil-usuario.webp'
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../App';

const User = () => {


    const [isValidImage, setIsValidImage] = useState(false);
    const navigate = useNavigate();
    const { logeado, setLogeado } = useContext(AppContext);
    const [menuVisible, setMenuVisible] = useState(true);

    const datauser = JSON.parse(localStorage.getItem('DataUser'));

    const handleLogout = () => {
        setLogeado(false);
        localStorage.clear();
        navigate("/Home");
    };

    useEffect(() => {
        const image = new Image();
        image.src = datauser.image;
        image.onload = () => {
            setIsValidImage(true); // La URL es una imagen válida
        };
        image.onerror = () => {
            setIsValidImage(false); // La URL no es una imagen válida
        };
    }, [datauser]);



    const toggleMenu = () => {
        setMenuVisible(!menuVisible);
    };

    return (
        <div>
            <input
                className="user__checkbox"
                id="toggleMenuCheckbox"
                type="checkbox"
                checked={menuVisible}
                onChange={toggleMenu}
            />

            {menuVisible && (
                <div className="user">
                    <span className="user__name">{datauser.firstName}</span>
                    <img className="user__img" src={isValidImage ? datauser.image : img} alt={`${datauser.firstName}'s Avatar`} />
                    <div className="user__menu" onClick={toggleMenu}>{menuVisible ? '▲' : '▼'}</div>
                    {menuVisible && (
                        <div className="user__menu__button"  >
                            <ul>
                                <button onClick={handleLogout}>Cerrar Sesión</button>
                            </ul>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default User;