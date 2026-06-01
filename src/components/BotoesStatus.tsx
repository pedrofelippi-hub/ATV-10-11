import { memo } from 'react';
import type { FiltroStatus } from '../types/rickandmorty';

interface BotoesStatusProps {
  ativo: FiltroStatus;
  onChange: (status: FiltroStatus) => void;
}

const BotoesStatus = memo(function BotoesStatus({ ativo, onChange }: BotoesStatusProps) {
  return (
    <div className="filtros">
      {(['all', 'alive', 'dead', 'unknown'] as FiltroStatus[]).map((s) => {
        const classesExtras = 
          s === 'alive' ? 'vivo' : 
          s === 'dead' ? 'morto' : 
          s === 'unknown' ? 'desconhecido' : '';
          
        return (
          <button
            key={s}
            className={`btn-filtro ${classesExtras} ${ativo === s ? 'ativo' : ''}`}
            onClick={() => onChange(s)}
          >
            {s === 'all' ? 'Todos' : s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        )
      })}
    </div>
  );
});

export default BotoesStatus;