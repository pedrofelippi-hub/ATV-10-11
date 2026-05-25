import { useState, useEffect } from 'react';
import CartaoPersonagem from './components/CartaoPersonagem';
import type { Personagem, ApiInfo, RespostaAPI, FiltroStatus } from './types/rickandmorty';
import './App.css'; // Certifique-se de que seu CSS (aquele que você compartilhou) esteja aqui

// ─── COMPONENTE DO MODAL ──────────────────────────────────────
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

// ─── COMPONENTE PRINCIPAL APP ─────────────────────────────────
function App() {
  // Estados de dados e interface
  const [personagens, setPersonagens] = useState<Personagem[]>([]);
  const [info, setInfo] = useState<ApiInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [erro, setErro] = useState<string | null>(null);
  
  // Estados de paginação e filtros da API
  const [pagina, setPagina] = useState<number>(1);
  const [filtroStatus, setFiltroStatus] = useState<FiltroStatus>('all');
  
  // Estados para o Debounce da busca local
  const [busca, setBusca] = useState<string>('');
  const [buscaDebounced, setBuscaDebounced] = useState<string>('');
  
  // Estado para controlar a exibição do Modal
  const [idPersonagemSelecionado, setIdPersonagemSelecionado] = useState<number | null>(null);

  // Efeito do Debounce (atrasa a atualização da busca em 500ms)
  useEffect(() => {
    const handler = setTimeout(() => {
      setBuscaDebounced(busca);
    }, 500);

    return () => clearTimeout(handler);
  }, [busca]);

  // Função principal de requisição à API
  async function buscarPersonagens(): Promise<void> {
    setLoading(true);
    setErro(null);
    
    try {
      const statusParam = filtroStatus !== 'all' ? `&status=${filtroStatus}` : '';
      const url = `https://rickandmortyapi.com/api/character?page=${pagina}${statusParam}`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        if (response.status === 404) {
           setPersonagens([]);
           setInfo(null);
           return;
        }
        throw new Error('Falha ao buscar personagens');
      }
      
      const data: RespostaAPI = await response.json();
      setPersonagens(data.results);
      setInfo(data.info);
    } catch (err: any) {
      setErro(err.message || 'Ocorreu um erro desconhecido');
      setPersonagens([]);
      setInfo(null);
    } finally {
      setLoading(false);
    }
  }

  // Reage a mudanças de página ou filtro de status na API
  useEffect(() => {
    buscarPersonagens();
  }, [pagina, filtroStatus]);

  // Filtro local aplicando o valor já atrasado pelo debounce
  const personagensFiltrados: Personagem[] = personagens.filter((p) =>
    p.name.toLowerCase().includes(buscaDebounced.toLowerCase())
  );

  return (
    <div className="app">
      <header className="header">
        <div>
          <h1>🧬 Painel de Personagens</h1>
          <p className="subtitulo">Dados consumidos da Rick and Morty API</p>
        </div>
        <div className="contador">
          {buscaDebounced ? `${personagensFiltrados.length} personagens` : (info ? `${info.count} personagens` : '—')}
        </div>
      </header>

      <div className="controles">
        <input
          type="text"
          className="campo-busca"
          id="campo-busca"
          placeholder="🔍 Buscar por nome..."
          autoComplete="off"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />

        <div className="filtros">
          {(['all', 'alive', 'dead', 'unknown'] as FiltroStatus[]).map((s) => {
            const classesExtras = 
              s === 'alive' ? 'vivo' : 
              s === 'dead' ? 'morto' : 
              s === 'unknown' ? 'desconhecido' : '';
              
            return (
              <button
                key={s}
                className={`btn-filtro ${classesExtras} ${filtroStatus === s ? 'ativo' : ''}`}
                onClick={() => {
                  setFiltroStatus(s);
                  setPagina(1);
                  setBusca('');
                }}
              >
                {s === 'all' ? 'Todos' : s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            )
          })}
        </div>
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
                  onClick={() => setIdPersonagemSelecionado(p.id)} 
                />
              ))
            : <p className="vazio">Nenhum personagem encontrado.</p>
          }
        </div>
      )}

      {info && !loading && !erro && (
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
      )}

      {/* Renderização do Modal */}
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