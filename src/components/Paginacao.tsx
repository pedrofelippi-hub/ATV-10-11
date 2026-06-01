import type { ApiInfo } from '../types/rickandmorty';

interface PaginacaoProps {
  info: ApiInfo;
  pagina: number;
  setPagina: (updater: (p: number) => number) => void;
}

export default function Paginacao({ info, pagina, setPagina }: PaginacaoProps) {
  return (
    <div className="paginacao">
      <span className="pag-info">
        Página {pagina} de {info.pages}
      </span>
      <div className="pag-botoes">
        <button
          className="btn-pag anterior"
          disabled={!info.prev}
          onClick={() => setPagina((p) => p - 1)}
        >
          ← Anterior
        </button>
        <button
          className={`btn-pag proximo`}
          disabled={!info.next}
          onClick={() => setPagina((p) => p + 1)}
        >
          Próxima →
        </button>
      </div>
    </div>
  );
}