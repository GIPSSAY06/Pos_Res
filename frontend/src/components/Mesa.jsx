export default function Mesa({ numero, estado, onClick }) {
  const colorEstado = estado === 'ocupada' ? '#e74c3c' : '#2ecc71'; // rojo o verde
  const esMesaLarga = typeof numero === 'string' && numero.length > 6;

  return (
    <div
      onClick={() => onClick(numero)}
      style={{
        position: 'relative',
        width: '100px',
        height: '100px',
        backgroundColor: '#CD853F', // tono más claro (antes: '#8B4513')
        borderRadius: '12px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        cursor: 'pointer',
        textAlign: 'center',
        padding: '0.5rem',
        boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
      }}
    >
      {/* Sillas alrededor */}
      {['top', 'bottom', 'left', 'right'].map((pos) => (
        <div
          key={pos}
          style={{
            position: 'absolute',
            width: '20px',
            height: '20px',
            backgroundColor: '#333',
            borderRadius: '50%',
            ...(pos === 'top' && { top: '-12px', left: 'calc(50% - 10px)' }),
            ...(pos === 'bottom' && { bottom: '-12px', left: 'calc(50% - 10px)' }),
            ...(pos === 'left' && { left: '-12px', top: 'calc(50% - 10px)' }),
            ...(pos === 'right' && { right: '-12px', top: 'calc(50% - 10px)' }),
          }}
        ></div>
      ))}

      {/* Nombre/ID */}
      <span
        style={{
          color: 'white',
          fontWeight: 'bold',
          fontSize: esMesaLarga ? '11px' : '14px',
          lineHeight: '1.3',
          wordBreak: 'break-word',
        }}
      >
        MESA<br />
        {numero}
      </span>

      {/* Estado */}
      <div
        style={{
          position: 'absolute',
          bottom: '-22px',
          fontSize: '12px',
          color: 'white',
          backgroundColor: colorEstado,
          padding: '2px 8px',
          borderRadius: '12px',
        }}
      >
        {estado.toUpperCase()}
      </div>
    </div>
  );
}
