import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import type { Personagem, RespostaAPI, FiltroStatus } from './types/rickandmorty';
import './App.css';

// ─── HOOKS E CONTEXTOS (Desafio 9) ────────────────────────────
import { useFetch } from './hooks/useFetch';
import { useDebounce } from './hooks/useDebounce';
import { useFavoritos } from './contexts/FavoritosContext';

// ─── COMPONENTES SEPARADOS ────────────────────────────────────
import CartaoPersonagem from './components/CartaoPersonagem';
import BarraBusca from './components/BarraBusca';
import BotoesStatus from './components/BotoesStatus';
import Paginacao from './components/Paginacao';

// ─── COMPONENTE DO MODAL (Mantido do seu código original) ─────
interface ModalProps {
  idPersonagem: number;
  onClose: () => void;
}

function ModalPersonagem({ idPersonagem, onClose }: ModalProps) {
  const [detalhes, setDetalhes] = useState<Personagem | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    async function buscarDetalhes() {
      setLoading(true);
      setErro(null);
      try {
        const response = await fetch(`https://rickandmortyapi.com/api/character/${idPersonagem}`);
        if (!response.ok) throw new Error("Erro ao buscar detalhes do personagem");
        const data = await response.json();
        setDetalhes(data);
      } catch (err: any) {
        setErro(err.message);
      } finally {
        setLoading(false);
      }
    }
    buscarDetalhes();
  }, [idPersonagem]);

  return (
    <div className="modal ativo" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <span className="fechar-modal" onClick={onClose}>&times;</span>

        {loading && <span className="status loading" style={{ display: 'block', textAlign: 'center' }}>⏳ Carregando detalhes...</span>}
        {erro && <span className="status erro" style={{ display: 'block', textAlign: 'center' }}>❌ {erro}</span>}

        {detalhes && !loading && !erro && (
          <div className="modal-body-content">
            <img src={detalhes.image} alt={detalhes.name} className="modal-img" />
            <div className="modal-info">
              <h2 style={{ color: 'white', marginBottom: '12px', fontSize: '22px' }}>{detalhes.name}</h2>
              <p>🌍 <span>Origem:</span> {detalhes.origin.name}</p>
              <p>📍 <span>Localização Atual:</span> {detalhes.location.name}</p>
              <p>📺 <span>Aparece em:</span> {detalhes.episode.length} episódio(s)</p>
              <p>🧬 <span>Gênero:</span> {detalhes.gender}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── COMPONENTE PRINCIPAL APP REFATORADO ──────────────────────
function App() {
  const [pagina, setPagina] = useState<number>(1);
  const [filtroStatus, setFiltroStatus] = useState<FiltroStatus>('all');
  const [busca, setBusca] = useState<string>('');
  const [idPersonagemSelecionado, setIdPersonagemSelecionado] = useState<number | null>(null);

  // 1. Usando os novos Custom Hooks e Contexto
  const buscaDebounced = useDebounce(busca, 400);
  const { totalFavoritos } = useFavoritos();
  const inputRef = useRef<HTMLInputElement>(null);

  // 2. Fetch Automático (sem precisar de useEffect manual aqui)
  const statusParam = filtroStatus !== 'all' ? `&status=${filtroStatus}` : '';
  const url = `https://rickandmortyapi.com/api/character?page=${pagina}${statusParam}`;
  const { dados, loading, erro } = useFetch<RespostaAPI>(url);

  // 3. Filtro Otimizado com useMemo
  const personagensFiltrados = useMemo(() => {
    return (dados?.results || []).filter((p) =>
      p.name.toLowerCase().includes(buscaDebounced.toLowerCase())
    );
  }, [dados, buscaDebounced]);

  // 4. Callback para evitar re-renderização dos botões de status
  const handleFiltroStatus = useCallback((s: FiltroStatus) => {
    setFiltroStatus(s);
    setPagina(1);
    setBusca('');
    inputRef.current?.focus();
  }, []);

  return (
    <div className="app">
      <header className="header">
        <div>
          <h1>🧬 Painel de Personagens</h1>
          <p className="subtitulo">useFetch + useDebounce + Context</p>
        </div>
        <div className="contador">
          ❤️ {totalFavoritos} favoritos
        </div>
      </header>

      <div className="controles">
        {/* Componentes UI separados */}
        <BarraBusca busca={busca} setBusca={setBusca} inputRef={inputRef} />
        <BotoesStatus ativo={filtroStatus} onChange={handleFiltroStatus} />
      </div>

      {loading && <p className="status loading" id="status-mensagem">⏳ Carregando personagens...</p>}
      {erro && <p className="status erro" id="status-mensagem">❌ {erro}</p>}

      {!loading && !erro && (
        <div className="grid">
          {personagensFiltrados.length > 0
            ? personagensFiltrados.map((p) => (
                <CartaoPersonagem
                  key={p.id}
                  personagem={p}
                  // Modificação no CartãoPersonagem da Aula 9, o onClick passa a ser na div principal do card
                  // Mas caso você não tenha alterado, pode usar assim mesmo.
                  onClick={() => setIdPersonagemSelecionado(p.id)}
                />
              ))
            : <p className="vazio">Nenhum personagem encontrado.</p>
          }
        </div>
      )}

      {dados?.info && !loading && !erro && (
        <Paginacao info={dados.info} pagina={pagina} setPagina={setPagina} />
      )}

      {idPersonagemSelecionado && (
        <ModalPersonagem
          idPersonagem={idPersonagemSelecionado}
          onClose={() => setIdPersonagemSelecionado(null)}
        />
      )}
    </div>
  );
}

export default App;