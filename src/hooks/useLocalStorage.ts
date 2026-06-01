import { useState } from 'react';

export function useLocalStorage<T>(chave: string, valorInicial: T) {
  const [valor, setValor] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(chave);
      return item ? JSON.parse(item) : valorInicial;
    } catch (error) {
      console.warn(`Erro ao ler localStorage (${chave}):`, error);
      return valorInicial;
    }
  });

  const setValorEPersistir = (novoValor: T | ((val: T) => T)) => {
    try {
      // Suporte para callback no set (ex: setValor(prev => prev + 1))
      const valorParaSalvar = novoValor instanceof Function ? novoValor(valor) : novoValor;
      setValor(valorParaSalvar);
      window.localStorage.setItem(chave, JSON.stringify(valorParaSalvar));
    } catch (error) {
      console.warn(`Erro ao salvar no localStorage (${chave}):`, error);
    }
  };

  return [valor, setValorEPersistir] as const; // as const fixa os tipos do array de retorno
}