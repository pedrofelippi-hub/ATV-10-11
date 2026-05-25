import type { Personagem } from '../types/rickandmorty';
interface Props {
  personagem: Personagem;
  onClick?: () => void;
}

function CartaoPersonagem({ personagem, onClick }: Props) {
  const classeBadge = 
    personagem.status === "Alive" ? "badge-alive" :
    personagem.status === "Dead" ? "badge-dead" : 
    "badge-unknown";

  return (
    <div className="card" onClick={onClick}>
      <img
        src={personagem.image}
        alt={personagem.name}
        className="card-img"
      />
      <div className="card-body">
        <h3 className="card-nome" title={personagem.name}>{personagem.name}</h3>
        <p className="card-especie">{personagem.species}</p>
        <span className={`badge ${classeBadge}`}>
          {personagem.status}
        </span>
      </div>
    </div>
  );
}

export default CartaoPersonagem;