export type Mission = {
  id: string;
  immatriculation: string;
  modele: string;
  depart: string;
  arrivee: string;
  heureLimite: string; // ISO format
  statut: 'en attente' | 'en cours' | 'livrée';
  commentaires?: string;
  photos?: File[];
};