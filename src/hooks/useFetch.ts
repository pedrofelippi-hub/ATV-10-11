import { useState, useEffect } from 'react';

export function useFetch<T>(url: string) {
  const [dados, setDados] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    if (!url) return;
    
    const controller = new AbortController();
    setLoading(true);
    setErro(null);

    fetch(url, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error('Erro ao buscar dados na API');
        return res.json();
      })
      .then((data) => setDados(data))
      .catch((err) => {
        // Ignora erros de cancelamento (abort)
        if (err.name !== 'AbortError') {
          setErro(err.message);
          setDados(null);
        }
      })
      .finally(() => setLoading(false));

    // Cleanup: cancela o fetch se a URL mudar antes de concluir
    return () => controller.abort();
  }, [url]);

  return { dados, loading, erro };
}