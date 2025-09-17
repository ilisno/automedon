import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const CGV = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Header />
      <main className="flex-grow flex flex-col items-center justify-center p-4 text-center">
        <h1 className="text-4xl font-bold mb-6">Conditions Générales de Vente</h1>
        <div className="text-left max-w-3xl mx-auto space-y-4 text-gray-700 dark:text-gray-300">
          <p className="font-bold">AUTOMEDON est un service proposé par URUK SAS</p>
          <h2 className="text-2xl font-semibold mt-6 mb-2">PRÉAMBULE</h2>
          <p>
            La prestation « convoyeur AUTOMEDON » consiste en la mise à disposition d’un « 
            convoyeur qualifié » pour la conduite des véhicules de nos donneurs d’ordre depuis le 
            lieu de prise en charge jusqu’au lieu de destination convenus lors de la commande de 
            prestation.
          </p>
          <p>
            Les convoyages de véhicules peuvent être effectués entre l’ile de France et toute région 
            de France ou à l’étranger.
          </p>
          <p>
            Le terme « Donneur d’ordre » désigne le demandeur de la prestation, particulier ou 
            association, agissant en tant que propriétaire (ou loueur) du véhicule.
          </p>
          <p>
            L’achat d’une prestation « AUTOMEDON » implique l’acceptation des conditions 
            générales de ventes ci-après dont le Donneur d’ordre reconnait avoir pris connaissance 
            et en accepter le contenu sans réserve.
          </p>
          <h2 className="text-2xl font-semibold mt-6 mb-2">CAPACITÉ</h2>
          <p>
            Le Donneur d’ordre reconnait avoir la capacité de contracter aux conditions décrites, 
            c’est-à-dire être âgé d’au moins 18 ans, être capable juridiquement de contracter et ne 
            pas être sous tutelle ou curatelle.
          </p>
          <p>
            Le Donneur d’ordre garantit la véracité des informations fournies à AUTOMEDON pour le 
            calcul du devis préalable, sur l’état mécanique de son véhicule et de son attelage 
            éventuel (caravane ou remorque).
          </p>
          <p className="font-bold">AVERTISSEMENT : Rappel des termes de l’article L313-1 du Code Pénal :</p>
          <p>
            « L’escroquerie est le fait, soit par l’usage d’un faux nom ou d’une fausse qualité, soit par 
            l’abus d’une qualité vraie, soit par l’emploi de manœuvres frauduleuses de tromper, une 
            personne physique ou morale et de la déterminer ainsi, à son préjudice ou au préjudice 
            d’un tiers, à remettre des fonds, des valeurs ou un bien quelconque, à fournir un service 
            ou à consentir un acte opérant, à fournir obligation ou décharge. L’escroquerie est punie 
            de cinq ans d’emprisonnement et de 375.000 € d’amende. »
          </p>
          <h2 className="text-2xl font-semibold mt-6 mb-2">1/ DISPOSITIONS ADMINISTRATIVES ET FINANCIÈRES</h2>
          <h3 className="text-xl font-semibold mt-4 mb-2">1.1. Demande de prestation et devis préalable.</h3>
          <p>
            Pour toute demande de prestation « Convoyeur », AUTOMEDON établira un devis en 
            euros sur la base des souhaits et éléments convenus avec le Donneur d’ordre. Le devis 
            sera adressé au Donneur d’ordre par courrier électronique. 
          </p>
          <h3 className="text-xl font-semibold mt-4 mb-2">1.1 Demande de prestation</h3>
          <p>
            Le Donneur d'ordre fournit a AUTOMEDON, préalablement à la présentation du véhicule au fin 
            de transport, sur le Site ou par tout autre procédé en permettant la mémorisation, les 
            indications suivantes (les « Conditions Initiales ») : 
          </p>
          <p>
            Son nom, prénom, adresse complète, ainsi que ses numéros de téléphone et télécopie le cas 
            échant et son adresse électronique. 
          </p>
          <p>
            Le nom, prénom, adresse complète, ainsi que les numéros de téléphone et télécopie le cas 
            échant et l’adresse électronique de la personne chargée de la remise du véhicule au Convoyeur 
            dans l’hypothèse où le Donneur d’ordre ne serait pas le remettant. 
          </p>
          <p>
            Le nom, prénom, adresse complète, ainsi que les numéros de téléphone et télécopie le cas 
            échant et l’adresse électronique du Destinataire dans l’hypothèse où le Destinataire ne serait 
            pas le Donneur d’ordre. 
          </p>
          <p>
            La plage de dates de livraison conformément au choix proposé sur le Site et lieu de livraison 
            du Véhicule. 
          </p>
          <p>
            Les heures limites de mise à disposition du Véhicule en vue du transport du Véhicule. 
          </p>
          <p>
            Le genre, le type, l’immatriculation, le numéro de châssis le tout repris dans un récapitulatif 
            de commande. 
          </p>
          <p>
            La spécificité du Véhicule quand ce dernier requiert des dispositions particulières (véhicule 
            GPL, GNV…). 
          </p>
          <p>
            En outre le Donneur d'ordre informe le Transporteur des particularités non apparentes du 
            Véhicules et de toutes données susceptibles d'avoir une incidence sur la bonne exécution du 
            transport. 
          </p>
          <p>
            Le Donneur d'ordre fournit à AUTOMEDON, en même temps que le Véhicule, les 
            renseignements et les documents d'accompagnement nécessaires à la bonne exécution d'une 
            opération de transport soumise à une réglementation particulière telle que douane, police, etc. 
          </p>
          <p>
            Un document de transport est établi sur la base de ces indications. Il est complété, si besoin est, 
            au fur et à mesure de l'opération de transport, un exemplaire du document de transport est 
            remis au Destinataire au moment de la livraison. 
          </p>
          <p>
            Le Donneur d'ordre supporte vis-à-vis de AUTOMEDON les conséquences d'une déclaration 
            erronée, fausse ou incomplète sur les caractéristiques de l'envoi ainsi que d'une absence ou 
            d'une insuffisance de déclaration ayant eu pour effet, entre autres, de dissimuler le caractère 
            dangereux ou frauduleux du Véhicule. 
          </p>
          <h3 className="text-xl font-semibold mt-4 mb-2">1.2 Modifications des conditions initiales</h3>
          <p>
            Toute nouvelle instruction du Donneur d'ordre ayant pour objet la modification des Conditions 
            Initiales doit être donnée par écrit ou par tout autre procédé en permettant la mémorisation 
            à AUTOMEDON. 
          </p>
          <p>
            AUTOMEDON n'est pas tenu d'accepter ces nouvelles instructions si elles sont de nature à 
            l'empêcher d'honorer des engagements de transport pris antérieurement. Il doit alors en aviser 
            immédiatement le Donneur d'ordre par écrit ou par tout autre procédé en permettant la 
            mémorisation. 
          </p>
          <p>
            Lorsque les instructions entraînent une immobilisation du Véhicule et/ou de l'équipage, 
            AUTOMEDON perçoit un complément de rémunération pour frais d'immobilisation facturé 
            séparément. 
          </p>
          <p>
            Ainsi, toute modification portée aux Conditions Initiales entraîne un réajustement du prix 
            initial. 
          </p>
          <h3 className="text-xl font-semibold mt-4 mb-2">1.2. Commande et réservation du Convoyeur AUTOMEDON.</h3>
          <p>
            En cas d’accord sur les conditions proposées, le Donneur d’ordre validera le devis et 
            procédera alors au paiement de la totalité : 
          </p>
          <h3 className="text-xl font-semibold mt-4 mb-2">1.3. Mode de paiement.</h3>
          <p>
            Les paiements sont acceptés par cartes de paiement sur le site AUTOMEDON, virement 
            bancaire ou par chèque bancaire libellé à l’ordre d’URUK SAS. Aucun règlement en 
            espèces ne peut être accepté. 
          </p>
          <h3 className="text-xl font-semibold mt-4 mb-2">1.4. Conditions de règlement.</h3>
          <p>
            Le paiement complet de la prestation est exigé une semaine avant la date de prise en 
            charge (Sauf urgence). 
          </p>
          <p>
            A défaut de paiement complet reçu au plus tard 7 jours avant la date de prise en charge 
            prévue, AUTOMEDON est en droit d’annuler la commande. En cas de prestation 
            commandée en urgence, des dispositions particulières pourront toutefois être 
            convenues avec le Donneur d’ordre afin de rendre la prestation souhaitée. 
          </p>
          <p>
            AUTOMEDON adressera au Donneur d’ordre par courrier électronique une facture de 
            régularisation dans les 30 jours suivant l’accomplissement de la prestation. 
          </p>
          <h3 className="text-xl font-semibold mt-4 mb-2">1.5. Annulation de la part du Donneur d’ordre.</h3>
          <p>
            Le Donneur d’ordre est informé, qu’en application de l’article L. 121-21-8 du code de la 
            consommation, les services de transport proposés sur le Site ne bénéficient pas de droit de 
            rétractation.  
          </p>
          <p>
            En cas d’annulation de la prestation pour quelle que cause que ce soit, le Donneur d’ordre 
            en informera AUTOMEDON par téléphone au +33 6 50 78 84 87. L’annulation devra faire 
            l’objet d’une confirmation écrite immédiate.
          </p>
        </div>
        <Link to="/">
          <Button variant="outline" className="px-8 py-4 text-lg mt-8">Retour à l'accueil</Button>
        </Link>
      </main>
      <Footer />
    </div>
  );
};

export default CGV;