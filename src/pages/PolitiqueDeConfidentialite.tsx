import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const PolitiqueDeConfidentialite = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Header />
      <main className="flex-grow flex flex-col items-center justify-center p-4 text-center">
        <h1 className="text-4xl font-bold mb-6">Politique de Confidentialité</h1>
        <div className="text-left max-w-3xl mx-auto space-y-4 text-gray-700 dark:text-gray-300">
          <p>
            Les dispositions concernant la protection des données à caractère personnel telles qu’issues de la Loi Informatique et Libertés en date du 6 janvier 1978 telle que modifiée par la Loi du 20 juin 2018 relative à la protection des données personnelles et du Règlement européen sur la protection des données personnelles (« RGPD ») sont :
          </p>
          <p className="font-bold">La présente Politique de Confidentialité est à jour au 25 mars 2025</p>

          <h2 className="text-2xl font-semibold mt-6 mb-2">1. INTRODUCTION</h2>
          <h3 className="text-xl font-semibold mt-4 mb-2">1.1. Objet de la Politique de Confidentialité</h3>
          <p>
            La présente politique de confidentialité (ci-après la « Politique de Confidentialité ») est proposée à l’utilisateur (ci-après « l’Utilisateur ») par la société SAS, société par actions simplifiées, URUK au capital de 500 euros, immatriculée au Registre du Commerce et des Sociétés de Châlons-en-Champagne, sous le numéro RCS : 97759264100012 et dont le siège est situé 79 RUE D'ORADOUR 51000 CHÂLONS-EN-CHAMPAGNE, France, (ci-après « la Société »).
          </p>
          <h3 className="text-xl font-semibold mt-4 mb-2">1.2. Coordonnées de la Société</h3>
          <p>
            Le numéro de téléphone non surtaxé de la Société est le suivant : <strong>+33 6 50 78 84 87</strong> et l’adresse email est : <strong>contact@automedon.net</strong>
          </p>
          <h3 className="text-xl font-semibold mt-4 mb-2">1.3. Le Site</h3>
          <p>
            La Société est éditrice du site Internet <a href="https://www.automedon.net" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline"><strong>www.automedon.net</strong></a> (ci-après le « Site ») qu’elle met à la disposition des Utilisateurs.
          </p>
          <h3 className="text-xl font-semibold mt-4 mb-2">1.4. Les Services</h3>
          <p>
            La Société propose aux Utilisateurs sur le Site le convoyage de véhicules (ci-après les « Services »).
          </p>
          <h3 className="text-xl font-semibold mt-4 mb-2">1.5. Acceptation de la Politique</h3>
          <p>
            L’Utilisateur déclare avoir pris connaissance et accepté la présente Politique de Confidentialité avant d’utiliser le Site.
          </p>

          <h2 className="text-2xl font-semibold mt-6 mb-2">2. PROTECTION DES DONNÉES À CARACTÈRE PERSONNEL</h2>
          <h3 className="text-xl font-semibold mt-4 mb-2">2.1. Données collectées</h3>
          <p>
            Afin de permettre aux Utilisateurs de pouvoir commander des Services sur le Site, la Société agissant en tant que responsable de traitement, se réserve le droit de collecter des données nominatives relatives aux Utilisateurs, notamment les données personnelles suivantes :
          </p>
          <ul className="list-disc list-inside ml-4 space-y-1">
            <li>Nom et prénom ;</li>
            <li>Poste (pour les Utilisateurs professionnels) ;</li>
            <li>Adresse email ;</li>
            <li>Adresse postale ;</li>
            <li>Nom, prénom, numéro de téléphone, email du contact au départ ;</li>
            <li>Nom, prénom, numéro de téléphone, email du contact à l’arrivée ;</li>
            <li>Adresse de départ du trajet ;</li>
            <li>Adresse d’arrivée du trajet ;</li>
            <li>Adresses supplémentaires (de facturation le cas échéant) ;</li>
            <li>(Facultatif) : Carte grise du véhicule ;</li>
            <li>Coordonnées bancaires ;</li>
            <li>RIB (particuliers) ;</li>
            <li>IBAN (particuliers) ;</li>
            <li>Numéro de téléphone fixe et mobile (particuliers) ;</li>
          </ul>
          <p>
            Pour les Utilisateurs professionnels, la Société collecte également les données suivantes : Nom et prénom, email, numéro de téléphone, fax du responsable du compte.
          </p>
          <h3 className="text-xl font-semibold mt-4 mb-2">2.2. Conséquences du refus de fournir des données</h3>
          <p>
            L’Utilisateur est informé que s’il ne souhaite pas fournir les données personnelles demandées, la Société ne pourra pas exécuter sa commande de Services.
          </p>
          <h3 className="text-xl font-semibold mt-4 mb-2">2.3. Restriction d'âge</h3>
          <p className="font-bold">
            LE SITE NE PEUT ÊTRE UTILISÉ QUE PAR DES PERSONNES ÂGÉES DE QUINZE ANS ET PLUS. SI UNE PERSONNE DE MOINS DE QUINZE ANS SOUHAITE UTILISER LE SITE, ELLE DEVRA AVOIR L’ACCORD EXPRES DE SON REPRÉSENTANT LÉGAL.
          </p>
          <h3 className="text-xl font-semibold mt-4 mb-2">2.4. Finalités et bases légales des traitements</h3>
          <p>
            La Société utilise les données personnelles des Utilisateurs pour les finalités suivantes :
          </p>
          <ul className="list-disc list-inside ml-4 space-y-1">
            <li><strong>Création et gestion d’un compte :</strong> Le traitement est nécessaire à l’exécution du contrat conclu avec l’Utilisateur.</li>
            <li><strong>Gestion et traitement des commandes :</strong> Le traitement est nécessaire à l’exécution du contrat conclu avec l’Utilisateur.</li>
            <li><strong>Fourniture des Services :</strong> Le traitement est nécessaire à l'exécution du contrat conclu avec l’Utilisateur.</li>
            <li><strong>Prise en compte des commandes :</strong> Le traitement est nécessaire à l'exécution du contrat conclu avec l’Utilisateur.</li>
            <li><strong>Facturation :</strong> Le traitement est nécessaire à l'exécution du contrat conclu avec l’Utilisateur.</li>
            <li><strong>Information sur la Société, les Services et les activités de la Société :</strong> Le traitement est nécessaire aux fins des intérêts légitimes poursuivis par la Société.</li>
            <li><strong>Réponse aux éventuelles questions/réclamations des Utilisateurs :</strong> Le traitement est nécessaire à l'exécution du contrat conclu avec l’Utilisateur.</li>
            <li><strong>Élaboration de statistiques commerciales :</strong> Le traitement est nécessaire aux fins des intérêts légitimes poursuivis par la Société.</li>
            <li><strong>Gestion des demandes de droits d’accès, de portabilité, d’effacement, de rectification et d’opposition :</strong> Le traitement est nécessaire à l'exécution du contrat conclu avec l’Utilisateur.</li>
            <li><strong>Gestion des impayés et du contentieux :</strong> Le traitement est nécessaire à l'exécution du contrat conclu avec l’Utilisateur.</li>
            <li><strong>Collecte des données bancaires des Utilisateurs :</strong> Le traitement est nécessaire à l'exécution du contrat conclu avec l’Utilisateur.</li>
          </ul>
          <h3 className="text-xl font-semibold mt-4 mb-2">2.5. Durée de conservation des données</h3>
          <p>
            Les données personnelles des Utilisateurs sont conservées uniquement le temps nécessaire à la réalisation de la finalité pour laquelle la Société détient ces données, afin de répondre aux besoins des Utilisateurs ou pour remplir ses obligations légales.
          </p>
          <h3 className="text-xl font-semibold mt-4 mb-2">2.6. Critères de conservation</h3>
          <p>
            Pour établir la durée de conservation des données personnelles, la Société applique les critères suivants :
          </p>
          <ul className="list-disc list-inside ml-4 space-y-1">
            <li>En cas de commande de Services, les données personnelles sont conservées pour la durée de la relation contractuelle et pour les durées de prescription légales ;</li>
            <li>Les données des Utilisateurs collectées sont aussi utilisées à des fins de prospection commerciale et sont conservées trois ans après la collecte ou le dernier contact avec l’Utilisateur ;</li>
            <li>Si l’Utilisateur participe à une offre promotionnelle, les données personnelles sont conservées pour la durée de l’offre promotionnelle concernée ;</li>
            <li>Si l’Utilisateur fait une demande auprès de la Société, les données personnelles seront conservées pour la durée nécessaire au traitement de la demande ;</li>
            <li>Si l’Utilisateur crée un compte, les données personnelles seront conservées jusqu’à ce que l’Utilisateur demande la suppression de son compte ou à l’issue d’une période d’inactivité, dans les limites de la durée des prescriptions légales ;</li>
            <li>Si des cookies sont placés sur l’ordinateur de l’Utilisateur, les données personnelles sont conservées pour la durée d’une session pour les cookies liés au panier d’achat ou les cookies d’identification de session et pour toute période définie conformément aux réglementations applicables ;</li>
            <li>La Société est susceptible de conserver certaines données afin de remplir ses obligations légales ou réglementaires afin de lui permettre d’exercer ses droits et/ou à des fins statistiques ou historiques.</li>
          </ul>
          <h3 className="text-xl font-semibold mt-4 mb-2">2.7. Suppression ou anonymisation des données</h3>
          <p>
            À l’issue des durées mentionnées ci-dessus, les données personnelles seront supprimées ou la Société procédera à leur anonymisation.
          </p>
          <h3 className="text-xl font-semibold mt-4 mb-2">2.8. Communication des données aux convoyeurs</h3>
          <p>
            La Société communique également les données des Utilisateurs particuliers et des Utilisateurs professionnels aux convoyeurs des véhicules (professionnels ou particuliers) afin de pouvoir exécuter les commandes.
          </p>
          <h3 className="text-xl font-semibold mt-4 mb-2">2.9. Communication aux autorités</h3>
          <p>
            La Société peut également communiquer les données personnelles afin de coopérer avec les autorités administratives et judiciaires.
          </p>
          <h3 className="text-xl font-semibold mt-4 mb-2">2.10. Sécurité des données</h3>
          <p>
            La Société veille à sécuriser les données personnelles des Utilisateurs de manière adéquate et appropriée et a pris les précautions utiles afin de préserver la sécurité et la confidentialité des données et notamment empêcher qu’elles ne soient déformées, endommagées ou communiquées à des personnes non autorisées.
          </p>
          <h3 className="text-xl font-semibold mt-4 mb-2">2.11. Services tiers et hébergement</h3>
          <p>
            La Société utilise les services de plusieurs entreprises pour assurer le bon fonctionnement de sa plateforme. Ces entreprises sont amenées à effectuer des traitements des données personnelles strictement nécessaires à la fourniture de leurs services et hébergent régulièrement leurs services au sein de structures d’informatique en nuage situées aux États-Unis. Elles ont toutes indiqué être conformes aux prescriptions du règlement général sur la protection des données ou le cas échéant, pour les entreprises dont le siège est situé en dehors du territoire de l’Union se sont déclarées conformes au cadre Privacy Shield. Le délégué à la protection des données tient à jour la liste de ces applications ainsi que le niveau de garantie qu’ils offrent en matière de protection des données.
          </p>
          <h3 className="text-xl font-semibold mt-4 mb-2">2.12. Conservation des données par l'hébergeur (Décret n°2011-219)</h3>
          <p>
            En vertu du Décret n°2011-219 du 25 février 2011 relatif à la conservation et à la communication des données permettant d’identifier toute personne ayant contribué à la création d’un contenu mis en ligne, l’Utilisateur est informé que l’hébergeur du Site a l’obligation de conserver pendant une durée d’un an à compter du jour de la création des contenus, pour chaque opération contribuant à la création d'un contenu :
          </p>
          <ul className="list-disc list-inside ml-4 space-y-1">
            <li>L’identifiant de la connexion à l’origine de la communication ;</li>
            <li>L'identifiant attribué par le système d'information au contenu, objet de l’opération ;</li>
            <li>Les types de protocoles utilisés pour la connexion au service et pour le transfert des contenus ;</li>
            <li>La nature de l'opération ;</li>
            <li>Les date et heure de l'opération ;</li>
            <li>L'identifiant utilisé par l'auteur de l'opération lorsque celui-ci l'a fourni.</li>
          </ul>
          <h3 className="text-xl font-semibold mt-4 mb-2">2.13. Conservation des données après résiliation/fermeture de compte</h3>
          <p>
            En cas de résiliation du contrat ou de la fermeture du compte, l’hébergeur doit également conserver durant un an à compter du jour de la résiliation du contrat ou de la fermeture du compte les informations fournies lors de la souscription d'un contrat (commande) par l’Utilisateur ou lors de la création d'un compte, à savoir :
          </p>
          <ul className="list-disc list-inside ml-4 space-y-1">
            <li>Au moment de la création du compte : l'identifiant de cette connexion ;</li>
            <li>Les nom et prénom ou la raison sociale ;</li>
            <li>Les adresses postales associées ;</li>
            <li>Les pseudonymes utilisés ;</li>
            <li>Les adresses de courrier électronique ou de compte associées ;</li>
            <li>Les numéros de téléphone ;</li>
            <li>Le mot de passe ainsi que les données permettant de le vérifier ou de le modifier, dans leur dernière version mise à jour.</li>
          </ul>
          <h3 className="text-xl font-semibold mt-4 mb-2">2.14. Conservation des données de paiement</h3>
          <p>
            L’hébergeur du Site doit enfin, lorsque la souscription du contrat (commande) ou du compte est payante, conserver durant un an à compter de la date d'émission de la facture ou de l'opération de paiement, pour chaque facture ou opération de paiement, les informations suivantes relatives au paiement, pour chaque opération de paiement :
          </p>
          <ul className="list-disc list-inside ml-4 space-y-1">
            <li>Le type de paiement utilisé ;</li>
            <li>La référence du paiement ;</li>
            <li>Le montant ;</li>
            <li>La date et l'heure de la transaction.</li>
          </ul>
          <h3 className="text-xl font-semibold mt-4 mb-2">2.15. Obligations des Utilisateurs</h3>
          <p>
            Les Utilisateurs reconnaissent que les données personnelles divulguées par eux sont valides, à jour et adéquates. Les Utilisateurs s’engagent à ne pas porter atteinte à la vie privée et à la protection des données personnelles de toute personne tierce et ainsi à ne pas communiquer à la Société les données de personnes tierces sans leur consentement.
          </p>
          <h3 className="text-xl font-semibold mt-4 mb-2">2.16. Droits des Utilisateurs</h3>
          <p>
            Les Utilisateurs disposent d’un droit d’accès, de rectification, de suppression (effacement), de portabilité de leurs données personnelles, de limitation du traitement ainsi qu’un droit d’opposition au traitement de leurs données collectées et traitées par la Société, en contactant directement la Société à l’adresse email suivante : <a href="mailto:contact@automedon.net" className="text-blue-500 hover:underline"><strong>contact@automedon.net</strong></a>
          </p>
          <p>
            Les Utilisateurs peuvent également, à tout moment, retirer leur consentement au traitement de leurs données personnelles par la Société ainsi que par les sous-traitants en contactant la Société à l’adresse email suivante : <a href="mailto:contact@automedon.net" className="text-blue-500 hover:underline"><strong>contact@automedon.net</strong></a> qui devra les en informer.
          </p>
          <h3 className="text-xl font-semibold mt-4 mb-2">2.17. Directives post-mortem</h3>
          <p>
            Conformément à l’article 40-1 de la Loi Informatique et Libertés telle que modifiée, la Société respectera les directives données par tout Utilisateur et relatives à la conservation, à l'effacement et à la communication de ses données à caractère personnel après son décès. En l’absence de telles directives, la Société fera droit aux demandes des héritiers telles que limitativement énoncées à l’article 40-1, III de la Loi Informatique et Libertés.
          </p>
          <h3 className="text-xl font-semibold mt-4 mb-2">2.18. Réclamations auprès de la CNIL</h3>
          <p>
            En cas de réclamation, les Utilisateurs peuvent contacter la CNIL qui est l’autorité compétente en matière de protection des données personnelles, dont voici les coordonnées : <strong>3 Place de Fontenoy, 75007 Paris, téléphone : 01 53 73 22 22</strong>.
          </p>
          <h3 className="text-xl font-semibold mt-4 mb-2">2.19. Contact pour les données personnelles</h3>
          <p>
            Pour toute question concernant le traitement de ses données personnelles, l’Utilisateur peut contacter la Société par email à l’adresse suivante : <a href="mailto:contact@automedon.net" className="text-blue-500 hover:underline"><strong>contact@automedon.net</strong></a>
          </p>

          <h2 className="text-2xl font-semibold mt-6 mb-2">3. COOKIES ET OUTILS STATISTIQUES</h2>
          <h3 className="text-xl font-semibold mt-4 mb-2">3.1. Utilisation des cookies</h3>
          <p>
            Dans le cadre de la commande de Services sur le Site par les Utilisateurs, la Société est susceptible d’utiliser des cookies.
          </p>
          <h3 className="text-xl font-semibold mt-4 mb-2">3.2. Information et consentement</h3>
          <p>
            Conformément à la délibération de la CNIL n° 2013-378 du 5 décembre 2013, la Société informe les Utilisateurs que des cookies enregistrent certaines informations qui sont stockées dans la mémoire de leur matériel/équipement informatique mobile. Ces informations servent à améliorer l’utilisation et le fonctionnement du Site, mais aussi pour comprendre comment le Site est utilisé par les Utilisateurs, ainsi que les outils et Services que la Société leur met à disposition. Un message d’alerte demande à chaque personne visitant le Site, au préalable, si elle souhaite accepter les cookies. Ces cookies ne contiennent pas d’informations confidentielles concernant les Utilisateurs.
          </p>
          <p>
            L’Utilisateur se rendant sur la page d’accueil ou une autre page du Site directement à partir d’un moteur de recherche sera informé :
          </p>
          <ul className="list-disc list-inside ml-4 space-y-1">
            <li>Des finalités précises des cookies utilisés ;</li>
            <li>De la possibilité de s’opposer à ces cookies et de changer les paramètres en cliquant sur un lien présent dans le bandeau ;</li>
            <li>Et du fait que la poursuite de sa navigation vaut accord au dépôt de cookies sur son terminal.</li>
          </ul>
          <h3 className="text-xl font-semibold mt-4 mb-2">3.3. Garantie du consentement</h3>
          <p>
            Pour garantir le consentement libre, éclairé et non équivoque de l’Utilisateur, le bandeau ne disparaîtra pas tant qu’il n’aura pas poursuivi sa navigation.
          </p>
          <h3 className="text-xl font-semibold mt-4 mb-2">3.4. Conditions de non-dépôt de cookies</h3>
          <p>
            Sauf consentement préalable de l’Utilisateur, le dépôt et la lecture de cookies ne seront pas effectués :
          </p>
          <ul className="list-disc list-inside ml-4 space-y-1">
            <li>S’il se rend sur le Site (page d'accueil ou directement sur une autre page du Site) et ne poursuit pas sa navigation : une simple absence d’action ne saurait être en effet assimilée à une manifestation de volonté ;</li>
            <li>Ou s’il clique sur le lien présent dans le bandeau lui permettant de paramétrer les cookies et, le cas échéant, refuse le dépôt de cookies.</li>
          </ul>
          <h3 className="text-xl font-semibold mt-4 mb-2">3.5. Désactivation des cookies</h3>
          <p>
            L’Utilisateur peut à tout moment choisir de désactiver les cookies et autres traceurs. Son navigateur peut être paramétré pour lui signaler les cookies qui sont déposés dans son terminal et lui demander de les accepter ou non.
          </p>
          <h3 className="text-xl font-semibold mt-4 mb-2">3.6. Configuration des navigateurs</h3>
          <p>
            La configuration de chaque navigateur est différente. Elle est décrite dans le menu d'aide de son navigateur, qui permettra à l’Utilisateur de savoir de quelle manière modifier ses souhaits en matière de cookies.
          </p>
          <ul className="list-disc list-inside ml-4 space-y-1">
            <li><strong>Firefox :</strong> <a href="https://support.mozilla.org/fr/kb/cookies" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Lien Firefox</a><br />
              {"Cliquez sur le bouton de menu et sélectionnez \"Options\". Sélectionnez le panneau \"Vie privée\". Paramétrez le menu \"Règles de conservation\" sur \"Utiliser les paramètres personnalisés pour l'historique\". Décochez la case \"Accepter les cookies\". Toutes les modifications que vous avez apportées seront automatiquement enregistrées."}
            </li>
            <li><strong>Internet Explorer :</strong> <a href="https://support.microsoft.com/en-us/products/windows" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Lien Internet Explorer</a><br />
              {"Cliquez sur le bouton Outils, puis sur \"Options Internet\". Cliquez sur l’onglet \"Confidentialité\", puis sous \"Paramètres\", déplacez le curseur vers le haut pour bloquer tous les cookies ou vers le bas pour autoriser tous les cookies, puis cliquez sur OK."}
            </li>
            <li><strong>Google Chrome :</strong> <a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Lien Google Chrome</a><br />
              {"Sélectionnez l'icône du menu Chrome. Sélectionnez \"Paramètres\". En bas de la page, sélectionnez \"Afficher les paramètres avancés\". Dans la section \"Confidentialité », sélectionnez \"Paramètres de contenu\". Sélectionnez \"Interdire à tous les sites de stocker des données\". Sélectionnez OK."}
            </li>
            <li><strong>Safari :</strong> <a href="https://www.apple.com/legal/privacy/fr-ww/cookies" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Lien Safari</a><br />
              {"Cliquez sur \"Réglages\" > \"Safari\" > \"Confidentialité\" > \"Cookies et données de site web\"."}
            </li>
          </ul>
        </div>
        <Link to="/">
          <Button variant="outline" className="px-8 py-4 text-lg mt-8">Retour à l'accueil</Button>
        </Link>
      </main>
      <Footer />
    </div>
  );
};

export default PolitiqueDeConfidentialite;