export type Mission = {
  id: string;
  immatriculation: string;
  modele: string;
  depart: string;
  arrivee: string;
  heureLimite: string; // ISO format
  statut: 'en attente' | 'acceptée' | 'en cours' | 'livrée';
  commentaires?: string;
  photos?: string[]; // Changed to string[] to store URLs if uploaded to storage
  concessionnaire_id?: string; // ID of the user who created the mission
  convoyeur_id?: string | null; // ID of the convoyeur assigned to the mission
};