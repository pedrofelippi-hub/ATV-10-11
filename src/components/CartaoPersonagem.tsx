import { memo } from 'react';
import type { Personagem } from '../types/rickandmorty';
import { useFavoritos } from '../contexts/FavoritosContext';

interface Props {
  personagem: Personagem;
  onClick?: () => void;
}

const CartaoPersonagem = memo(function CartaoPersonagem({ personagem, onClick }: Props) {
  const { toggleFavorito, isFavorito } = useFavoritos();
  const favorito = isFavorito(personagem.id);

  const classeBadge = 
    personagem.status === "Alive" ? "badge-alive" :
    personagem.status === "Dead" ? "badge-dead" : "badge-unknown";

  return (
    <div 
      className={`card ${favorito ? 'card-favorito' : ''}`} 
      onClick={onClick}
      style={{ position: 'relative' }}
    >
      {/* Botão de coração posicionado no canto superior direito */}
      <button 
        onClick={(e) => {
          e.stopPropagation(); 
          toggleFavorito(personagem.id);
        }} 
        className="btn-fav"
        style={{ 
          position: 'absolute', 
          top: '12px', 
          right: '12px', 
          background: 'none', 
          border: 'none', 
          cursor: 'pointer',
          fontSize: '1.2rem',
          zIndex: 10
        }}
      >
        {favorito ? '❤️' : '🤍'}
      </button>

      <img src={personagem.image} alt={personagem.name} className="card-img" />
      
      <div className="card-body">
        <h3 className="card-nome">{personagem.name}</h3>
        <p className="card-especie">{personagem.species}</p>
        <span className={`badge ${classeBadge}`}>{personagem.status}</span>
      </div>
    </div>
  );
});

export default CartaoPersonagem;