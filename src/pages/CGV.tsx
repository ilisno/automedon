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
          <p>
            AUTOMEDON retiendra dans tous les cas, les frais d’annulation selon le barème suivant : - Annulation constatée plus de 4 jours avant le départ :  200,00 €  -  Annulation constatée entre 4 et 2 jours avant le départ : 50% du prix de la prestation.  - Annulation constatée la veille du départ :  75% du prix de la prestation - Annulation constatée le jour du départ :100% du prix de la prestation 
          </p>
          <p>
            En cas de prise en charge rendue impossible du fait de l’état technique du véhicule, de 
            son attelage, de son chargement ou de tout autre circonstance rendant sa conduite 
            dangereuse ou impossible, le Convoyeur AUTOMEDON rendra compte de cette 
            impossibilité à la centrale d’AUTOMEDON. Si aucune solution n’est apportée par le 
            Donneur d’ordre afin de remédier rapidement au problème rencontré, la mission ne 
            pourra être effectuée et le prix de la prestation restera acquis à AUTOMEDON. 
          </p>
          <p>
            Des dispositions particulières pourront toutefois être convenues en cas de report 
            demandé par le Donneur d’ordre à une date et à des nouvelles conditions – y compris 
            financières – acceptées par AUTOMEDON. 
          </p>
          <h3 className="text-xl font-semibold mt-4 mb-2">1.6. Annulation pour cas de force majeure.</h3>
          <p>
            En cas de force majeure compromettant la libre circulation des biens et/ou des 
            personnes (grève ou dysfonctionnement dans les transports, blocus routier, difficultés de 
            ravitaillement en carburant, intempéries, inondations, épidémie…) et rendant de ce fait 
            impossible l’accomplissement de la prestation dans les conditions initialement prévues, 
            le Donneur d’ordre en sera immédiatement informé et les sommes versées seront 
            intégralement remboursées. Le Donneur d’ordre pourra toutefois opter pour un report de 
            la prestation à une date ultérieure qui resterait à définir entre le Donneur d’ordre et 
            AUTOMEDON lorsque les conditions le permettront. 
          </p>
          <h2 className="text-2xl font-semibold mt-6 mb-2">2/ DISPOSITIONS PRATIQUES</h2>
          <h3 className="text-xl font-semibold mt-4 mb-2">2. 1. Aspects documentaires :</h3>
          <p>
            Le Convoyeur AUTOMEDON effectuera un état descriptif précis du véhicule. Ce 
            document sera validé à la prise en charge et à l’arrivée à destination par le Donneur 
            d’ordre ou son représentant. 
          </p>
          <p>
            Le véhicule ne devra contenir aucun objet de valeur ou objets dont le transport ou la 
            détention est interdite ou règlementée. A la remise du véhicule, le Donneur d’ordre – ou 
            son représentant – est invité à vérifier la parfaite conformité de l’état descriptif et le bon 
            fonctionnement du véhicule. Aucune réclamation ne pourra être prise en considération 
            après signature de ce document.
          </p>
          <p>
            Une rubrique « observations » est réservée au Donneur d’ordre qui pourra faire part de ses 
            commentaires ou remarques sur l’accomplissement de la prestation. 
          </p>
          <h3 className="text-xl font-semibold mt-4 mb-2">2. 2. Véhicules admissibles et conditions techniques :</h3>
          <p>
            La prestation « Convoyeur AUTOMEDON » est applicable pour la conduite de toute 
            voiture particulière, véhicule utilitaire léger, fourgon, camping-car et leur attelage 
            éventuel répondant aux conditions ci-dessous. Les véhicules peuvent être immatriculés 
            en France ou à l’étranger sous réserve de dispositions administratives pouvant interdire 
            la conduite du véhicule par un tiers. Le Donneur d’ordre devra être en possession du 
            certificat d’immatriculation du véhicule et de son attelage éventuel (caravane ou 
            remorque). 
          </p>
          <p>
            Le véhicule doit être à jour de son contrôle technique et en parfait état de 
            fonctionnement. Le Donneur d’ordre certifie que le véhicule (ou attelage) confié au 
            Convoyeur AUTOMEDON ne présente pas de défaut(s) connu(s) de lui et qu’il peut ainsi 
            être conduit dans des conditions optimales de sécurité et sans risque aggravé de panne 
            ou d’accident. Toute inexactitude ou omission quant à l’état mécanique du véhicule 
            entraînera la responsabilité du Donneur d’ordre en cas de sinistre consécutif. Le véhicule 
            doit avoir fait l’objet d’un entretien périodique régulier selon les préconisations du 
            constructeur. 
          </p>
          <p>
            L’attention du Donneur d’ordre est attirée tout particulièrement sur l’état des 
            pneumatiques (gonflage, niveau d’usure, déformation, hernies, coupures…) et le 
            fonctionnement des feux et clignoteurs (y compris pour l’attelage éventuel) qui doivent 
            être impérativement vérifiés avant le départ afin d’éviter des complications dans 
            l’accomplissement de la mission ou son annulation. Sauf dispositions contraires 
            l’attelage de la caravane ou de la remorque et/ou son chargement sont effectués par le 
            Donneur d’ordre sous sa seule responsabilité. 
          </p>
          <p>
            Le Convoyeur AUTOMEDON procèdera à la prise en charge à la vérification des niveaux et 
            à un contrôle du bon fonctionnement du véhicule. 
          </p>
          <h3 className="text-xl font-semibold mt-4 mb-2">2.3. Itinéraires et étapes :</h3>
          <p>
            Le Convoyeur AUTOMEDON respectera le rendez-vous convenu avec le Donneur d’ordre 
            lors de la commande. Le Convoyeur empruntera l’itinéraire convenu lors de la commande 
            de la prestation. Il ne pourra être dérogé à cet itinéraire sauf en cas de force majeure dont 
            le Convoyeur AUTOMEDON rendra préalablement compte à la centrale AUTOMEDON. 
          </p>
          <p>
            Les conditions de circulation ou conditions météorologiques rencontrées peuvent 
            entraîner des retards importants rendant exceptionnellement nécessaire pour des 
            questions de sécurité une ou plusieurs étapes en cours de route non prévues lors de la
            commande. En ce cas, et pour toutes autres circonstances entraînant un retard non 
            imputable au Convoyeur (panne, blocus routier…), 
            Le Donneur d’ordre accepte expressément de supporter et de régler directement les frais 
            d’étape(s) supplémentaire(s) – hôtel, repas, petit-déjeuner pour le Convoyeur. 
            Les réservations d’hôtel seront effectuées par la centrale AUTOMEDON.  
          </p>
          <h3 className="text-xl font-semibold mt-4 mb-2">2.4. Frais de route :</h3>
          <p>
            Le Convoyeur AUTOMEDON fera l’avance des frais qui devront être remboursés par le 
            Donneur d’ordre lors de la remise du véhicule. Le remboursement peut se faire en 
            espèces contre reçu ou par chèque bancaire à l’ordre d’URUK SAS. Le Convoyeur 
            AUTOMEDON remettra les justificatifs des frais engagés pour le compte du Donneur 
            d’ordre. Dans le cas où une provision pour frais de route aura été demandée par 
            AUTOMEDON, une régularisation financière (positive ou négative) sera effectuée lors de 
            l’envoi de la facture. 
          </p>
          <h2 className="text-2xl font-semibold mt-6 mb-2">3/ CONFIDENTIALITÉ</h2>
          <p>
            Le personnel AUTOMEDON est tenu au secret professionnel le plus absolu et s’engage 
            de ce fait à ne divulguer à des tiers aucune information concernant le Donneur d’ordre, 
            sa famille, son environnement personnel ou professionnel et la raison pour laquelle il a 
            été fait appel à AUTOMEDON. AUTOMEDON s’engage également à ne pas communiquer 
            à des tiers les coordonnées des Donneurs d’ordre s à des fins de sollicitation ou de 
            prospection commerciale ni pour tout autre motif. Les coordonnées du Donneur d’ordre 
            seront enregistrées et conservées dans les fichiers informatiques AUTOMEDON qui 
            s’engage à effacer tout enregistrement sur simple demande de sa part formulée par écrit. 
          </p>
          <h2 className="text-2xl font-semibold mt-6 mb-2">4/ ASSURANCES</h2>
          <p>
            La société URUK SAS, a souscrit des garanties d’assurances prévoyant l’indemnisation 
            des dommages matériels et corporels pouvant survenir en cours de mission si la nature 
            des dommages ou les circonstances du sinistre impliquent sa responsabilité, même 
            partielle, ou celle de ses préposés. 
          </p>
          <p>
            Il est toutefois expressément convenu et accepté par le Donneur d’ordre que son véhicule 
            (et attelage éventuel) restera assuré par le titulaire de la carte grise pendant 
            l’accomplissement de la mission. Le Donneur d’ordre s’engage à n’exercer aucun recours 
            en cas de sinistre n’impliquant pas la responsabilité du Convoyeur AUTOMEDON. Il en 
            sera notamment ainsi dans les cas ci-dessous sans que la présente liste soit limitative :
          </p>
          <p>
            Bris de glace par projection,  crevaison, actes de vandalisme,  vol d’accessoire, vol du 
            véhicule ou car-jacking, dégradation suite à agression, détérioration du véhicule en 
            stationnement, panne ou accident résultant d’une défaillance mécanique,  …. 
            En cas d’accident – avec ou sans tiers identifié – un constat amiable sera rédigé par le 
            Convoyeur AUTOMEDON qui sera désigné « conducteur » du véhicule. Le constat amiable 
            sera remis au Donneur d’ordre pour traitement par son assureur pour instruction du 
            dossier « sinistre ». 
          </p>
          <h2 className="text-2xl font-semibold mt-6 mb-2">5/ PANNE EN COURS DE ROUTE</h2>
          <p>
            En cas de panne ou crevaison, le Convoyeur AUTOMEDON veillera à la sécurité du 
            véhicule immobilisé et se chargera de prévenir les secours routiers afin d’obtenir un 
            remorquage ou un dépannage sur place dans les plus brefs délais. Le Convoyeur 
            AUTOMEDON et la centrale AUTOMEDON faciliteront la relation avec l’assistance du 
            Donneur d’ordre afin que le véhicule puisse être dépanné dans les meilleurs délais. 
            IMPORTANT : Il est rappelé que le stationnement et la circulation de personnes sur les 
            bandes d’arrêt d’urgence des autoroutes ou voies rapides sont rigoureusement interdits. 
          </p>
          <h2 className="text-2xl font-semibold mt-6 mb-2">6/ RÉCLAMATIONS</h2>
          <p>
            Toute réclamation concernant l’exécution des prestations « Convoyeur AUTOMEDON » 
            doit faire l’objet d’une mention portée sur les documents opérationnels signés par le 
            Donneur d’ordre en cours de route ou à l’arrivée à destination (feuille de route ou état 
            descriptif). 
          </p>
          <p>
            La réclamation devra être confirmée dans les 48 heures suivant la fin de l’exécution de la 
            prestation : Soit par courrier postal recommandé adressé à : 
          </p>
          <h2 className="text-2xl font-semibold mt-6 mb-2">7/ AUTOMEDON</h2>
          <p>
            URUK SAS 
            79 RUE D'ORADOUR 51000 CHALONS-EN-CHAMPAGNE  
          </p>
          <p>
            Le Donneur d’ordre précisera l’objet détaillé de sa réclamation et apportera toutes 
            informations ou documents justifiant du bien-fondé de sa réclamation. 
          </p>
          <p>
            Pour les missions l’attention du Donneur d’ordre est attirée sur le fait qu’aucune 
            réclamation ne sera prise en considération après signature de l’état descriptif dont un 
            exemplaire sera remis au réceptionnaire. La mention « sous réserve » portée sur l’état 
            descriptif n’est pas acceptable. 
          </p>
          <h2 className="text-2xl font-semibold mt-6 mb-2">8/ ATTRIBUTION DE COMPÉTENCE</h2>
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