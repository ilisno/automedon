export type Mission = {
  id: string;
  immatriculation: string;
  modele: string;
  depart: string;
  arrivee: string;
  heureLimite: string; // ISO format
  statut: 'en attente' | 'acceptée' | 'en cours' | 'livrée'; // Added 'acceptée'
  commentaires?: string;
  photos?: File[];
};