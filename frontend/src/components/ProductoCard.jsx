import './ProductoCard.css';

export default function ProductoCard({ alimento, onClick }) {
  return (
    <div className="producto-card" onClick={() => onClick(alimento)}>
      <div className="producto-nombre">{alimento.nombre}</div>
      <div className="producto-precio">${Number(alimento.precio).toFixed(2)}</div>
      <button className="btn-agregar">Agregar +</button>
    </div>
  );
}
