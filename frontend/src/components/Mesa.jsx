import './Mesa.css';

export default function Mesa({ numero, estado, onClick }) {
  return (
    <div className="mesa" onClick={estado === 'disponible' ? () => onClick(numero) : null}>
      <div className="mesa-label">MESA {numero}</div>
      <div className={`mesa-estado ${estado === 'ocupada' ? 'rojo' : 'verde'}`}>
        {estado.toUpperCase()}
      </div>
    </div>
  );
}
