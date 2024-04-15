import React from "react";
import "./Table.scss";

const Table = ({ headers, data, onEditClick, onDeleteClick, setAccount }) => {
  return (
    <table>
      <thead>
        <tr>
          {headers.map((header, index) => (
            <th key={index}>{header}</th>
          ))}
          <th colSpan="2">Acciones</th>
        </tr>
      </thead>
      <tbody>
        {data.map((row, index) => (
          <tr key={index}>
            {Object.values(row).map((value, index) => {
              const pregunta = !(
                index === 0 || (!!row.url ? index === 3 : false)
              );
              return pregunta ? <td key={index}>{value}</td> : <></>;
            })}
            <td>
              <button
                onClick={() => {
                  setAccount(row);
                  onEditClick();
                }}
              >
                Editar
              </button>
              <button onClick={() => onDeleteClick(row.id)}>Eliminar</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;
