export const useSpellCheck = () => {
const corrections: Record<string, string> = {
  // Tempo e dia
  "hj": "hoje",
  "amanha": "amanhã",
  "ontem": "ontem",
  "dps": "depois",
  "agnt": "a gente",
  "agora": "agora",
  "cedo": "cedo",
  "tarde": "tarde",
  "noite": "à noite",
  
  // Verbos comuns do dia a dia
  "acordei": "acordei",
  "levantei": "levantei",
  "dormi": "dormi",
  "estudei": "estudei",
  "trabalhei": "trabalhei",
  "fiz": "fiz",
  "comi": "comi",
  "saí": "saí",
  "voltei": "voltei",
  "assisti": "assisti",
  "li": "li",
  "escrevi": "escrevi",
  
  // Abreviações comuns nesse contexto
  "vc": "você",
  "vcs": "vocês",
  "pq": "porque",
  "q": "que",
  "n": "não",
  "ta": "está",
  "to": "estou",
  "td": "tudo",
  "tb": "também",
  "tbm": "também",
  "cmg": "comigo",
  "msg": "mensagem",
  "msgs": "mensagens",
  
  // Expressões de estado/emoção
  "cansad": "cansado",
  "cansada": "cansada",
  "feliz": "feliz",
  "triste": "triste",
  "animad": "animado",
  "animada": "animada",
  "de boa": "tranquilo",
  "estresse": "estresse",
  "preocup": "preocupado",
  "preocupada": "preocupada",
};


  const autoCorrect = (text: string) => {
    let result = text;
    Object.entries(corrections).forEach(([err, cor]) => {
      const regex = new RegExp(`\\b${err}\\b`, "gi");
      result = result.replace(regex, cor);
    });
    return result;
  };

  return { autoCorrect };
};
