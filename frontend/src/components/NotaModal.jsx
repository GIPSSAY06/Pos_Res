import { useState } from 'react';

export default function NotaModal({ onClose, onSave, alimento }) {
  const [nota, setNota] = useState('');

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Nota para: {alimento.nombre}</h2>
        <textarea
          value={nota}
          onChange={e => setNota(e.target.value)}
          placeholder="Ej: sin cebolla, bien cocido..."
          rows="3"
        />
        <div className="modal-buttons">
          <button className="btn-cancelar" onClick={onClose}>Cancelar</button>
          <button className="btn-guardar" onClick={() => onSave(nota)}>Agregar</button>
        </div>
      </div>
    </div>
  );
}
