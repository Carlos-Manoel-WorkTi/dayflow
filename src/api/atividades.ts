import { db } from "@/config/firebase";
import { collection, addDoc, getDocs } from "firebase/firestore";

// Adiciona uma atividade em um dia específico
export async function addAtividade(dia: string, atividade: any) {
  try {
    const colRef = collection(db, "dias", dia, "atividades");
    const docRef = await addDoc(colRef, atividade);
    console.log("Atividade adicionada com ID:", docRef.id);
  } catch (e) {
    console.error("Erro ao adicionar atividade:", e);
  }
}

// Lista todas as atividades de um dia
export async function listarAtividades(dia: string) {
  const colRef = collection(db, "dias", dia, "atividades");
  const snapshot = await getDocs(colRef);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}
