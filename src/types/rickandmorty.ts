// ── Interfaces de dados da API Rick and Morty ──────────────

export interface ApiInfo {
  count: number;
  pages: number;
  next: string | null;
  prev: string | null;
}

export interface Personagem {
  id: number;
  name: string;
  status: "Alive" | "Dead" | "unknown";
  species: string;
  image: string;
  gender: string; // Adicionado para o modal
  location: {
    name: string;
    url: string;
  };
  origin: {
    name: string;
    url: string;
  };
  episode: string[];
  created: string;
}

export interface RespostaAPI {
  info: ApiInfo;
  results: Personagem[];
}

// Union type com os valores exatos de filtro
export type FiltroStatus = "all" | "alive" | "dead" | "unknown";