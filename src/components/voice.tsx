import { useState } from "react";
import { Mic, MicOff } from "lucide-react";

export default function VoiceLogger() {
  const [listening, setListening] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);

  const startListening = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Seu navegador não suporta SpeechRecognition 😢");
      return;
    }

    const recog = new SpeechRecognition();
    recog.lang = "pt-BR";
    recog.continuous = true;

    recog.onresult = (event: any) => {
      const transcript = Array.from(event.results)
        .map((result: any) => result[0].transcript)
        .join("");
      console.log("🎤 Você disse:", transcript);
    };

    recog.onerror = (event: any) => {
      console.error("Erro:", event.error);
    };

    recog.onend = () => {
      setListening(false);
      setRecognition(null);
    };

    recog.start();
    setRecognition(recog);
    setListening(true);
  };

  const stopListening = () => {
    recognition?.stop();
    setListening(false);
  };

  return (
    <div className="p-4">
      {listening ? (
        <MicOff
          size={40}
          className="cursor-pointer text-red-500"
          onClick={stopListening}
        />
      ) : (
        <Mic
          size={40}
          className="cursor-pointer text-green-500"
          onClick={startListening}
        />
      )}
    </div>
  );
}
