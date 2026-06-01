import type { RefObject } from 'react';

interface BarraBuscaProps {
  busca: string;
  setBusca: (valor: string) => void;
  inputRef: RefObject<HTMLInputElement | null>;
}

export default function BarraBusca({ busca, setBusca, inputRef }: BarraBuscaProps) {
  return (
    <input
      type="text"
      className="campo-busca"
      id="campo-busca"
      placeholder="🔍 Buscar por nome..."
      autoComplete="off"
      value={busca}
      onChange={(e) => setBusca(e.target.value)}
      ref={inputRef}
    />
  );
}