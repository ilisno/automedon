import jsPDF from 'jspdf';
import { DepartureSheet, ArrivalSheet } from '@/context/MissionsContext';

interface MissionDetails {
  immatriculation: string;
  modele: string;
  lieu_depart: string;
  lieu_arrivee: string;
}

type SheetType = 'departure' | 'arrival';

export const generateSheetPdf = async (
  sheet: DepartureSheet | ArrivalSheet,
  missionDetails: MissionDetails,
  sheetType: SheetType,
  filename: string
) => {
  const doc = new jsPDF('p', 'mm', 'a4'); // Portrait, millimeters, A4 size
  let yPos = 10; // Initial Y position
  const margin = 10;
  const lineHeight = 7;
  const maxPageHeight = 280; // Max height for content on a page

  doc.setFontSize(18);
  doc.text(`Fiche ${sheetType === 'departure' ? 'Départ' : 'Arrivée'}`, 105, yPos, { align: 'center' });
  yPos += lineHeight * 2;

  doc.setFontSize(12);
  doc.text(`${missionDetails.modele} (${missionDetails.immatriculation})`, 105, yPos, { align: 'center' });
  yPos += lineHeight;
  doc.text(`De: ${missionDetails.lieu_depart} à ${missionDetails.lieu_arrivee}`, 105, yPos, { align: 'center' });
  yPos += lineHeight * 2;

  doc.setFontSize(10);
  const valueIndent = 5; // Indentation for the value text

  const addField = (label: string, value: string | number | null | undefined) => {
    const textValue = value !== null && value !== undefined ? String(value) : 'N/A';
    const splitValue = doc.splitTextToSize(textValue, doc.internal.pageSize.getWidth() - 2 * margin - valueIndent);
    const numLines = splitValue.length;

    // Check if label, value (potentially multi-line), and the extra spacing line fit
    if (yPos + lineHeight * (1 + numLines + 1) > maxPageHeight) { 
      doc.addPage();
      yPos = margin;
    }

    doc.setFont('helvetica', 'bold');
    doc.text(`${label}:`, margin, yPos);
    yPos += lineHeight; // Move to the next line for the value

    doc.setFont('helvetica', 'normal');
    doc.text(splitValue, margin + valueIndent, yPos); // Print value, indented
    yPos += lineHeight * numLines; // Advance yPos by the number of lines the value took
    yPos += lineHeight; // Add an extra line for spacing before the next field
  };

  addField('Date de création', new Date(sheet.created_at).toLocaleString());
  addField('Kilométrage', `${sheet.mileage} km`);
  addField('Niveau de carburant', `${sheet.fuel_level} / 8`);
  addField('Propreté intérieure', `${sheet.interior_cleanliness} / 8`);
  addField('Propreté extérieure', `${sheet.exterior_cleanliness} / 8`);
  addField('État général du véhicule', sheet.general_condition);
  addField('Conditions Météo', sheet.weather_conditions);
  addField(`Lieu d'${sheetType === 'departure' ? 'enlèvement' : 'livraison'}`, sheet.pickup_location_type);
  addField('Carte SD ou CD/DVD', sheet.sd_card_cd_dvd);
  addField('Antenne', sheet.antenna);
  addField('Roue de secours / Kit anticrevaison', sheet.spare_tire_kit);
  addField('Kit de sécurité (Triangle / Gilet)', sheet.safety_kit);
  addField('Nombre de clefs confiées', sheet.number_of_keys);
  addField('Tapis de sol avants', sheet.front_floor_mats);
  addField('Tapis de sol arrières', sheet.rear_floor_mats);
  addField('Certificat d\'immatriculation (carte grise) (originale ou copie)', sheet.registration_card);
  addField('Carte carburant', sheet.fuel_card);
  addField('Vignette crit\'air', sheet.critair_sticker);
  addField('Manuel d\'utilisation du véhicule', sheet.user_manual);
  addField('PV de livraison', sheet.delivery_report);
  addField('Signature Convoyeur', sheet.convoyeur_signature_name);
  addField('Signature Client', sheet.client_signature_name);

  yPos += lineHeight; // Add some space before photos

  if (sheet.photos && sheet.photos.length > 0) {
    if (yPos + lineHeight > maxPageHeight) {
      doc.addPage();
      yPos = margin;
    }
    doc.setFont('helvetica', 'bold');
    doc.text(`Photos ${sheetType === 'departure' ? 'Départ' : 'Arrivée'}:`, margin, yPos);
    doc.setFont('helvetica', 'normal');
    yPos += lineHeight;

    const maxImgWidthPdf = doc.internal.pageSize.getWidth() - 2 * margin; // Max width for image on PDF page
    const maxImgHeightPdf = 60; // Max height for image on PDF page (in mm)
    let xOffset = margin;
    let currentLineMaxHeight = 0; // To track the tallest image in the current row

    for (const photoUrl of sheet.photos) {
      try {
        const img = new Image();
        img.src = photoUrl;
        await new Promise<void>((resolve, reject) => {
          img.onload = () => {
            const naturalWidth = img.naturalWidth;
            const naturalHeight = img.naturalHeight;
            const aspectRatio = naturalWidth / naturalHeight;

            let finalImgWidth = maxImgWidthPdf;
            let finalImgHeight = maxImgWidthPdf / aspectRatio;

            if (finalImgHeight > maxImgHeightPdf) {
              finalImgHeight = maxImgHeightPdf;
              finalImgWidth = maxImgHeightPdf * aspectRatio;
            }

            // Ensure image doesn't exceed page width if it's very wide and short
            if (finalImgWidth > maxImgWidthPdf) {
                finalImgWidth = maxImgWidthPdf;
                finalImgHeight = maxImgWidthPdf / aspectRatio;
            }

            // Check if image fits on current page vertically
            if (yPos + finalImgHeight + lineHeight > maxPageHeight) {
              doc.addPage();
              yPos = margin;
              xOffset = margin; // Reset xOffset for new page
              currentLineMaxHeight = 0; // Reset max height for new page
            }

            // Check if image fits horizontally on current line
            if (xOffset + finalImgWidth + margin > doc.internal.pageSize.getWidth()) {
              xOffset = margin; // Move to next row
              yPos += currentLineMaxHeight + lineHeight; // Advance yPos by the tallest image in the previous row
              currentLineMaxHeight = 0; // Reset for new row
            }

            doc.addImage(img.src, 'JPEG', xOffset, yPos, finalImgWidth, finalImgHeight);
            xOffset += finalImgWidth + margin; // Move to next position for image
            currentLineMaxHeight = Math.max(currentLineMaxHeight, finalImgHeight); // Update max height for current row
            resolve();
          };
          img.onerror = (e) => {
            console.error(`Failed to load image from ${photoUrl}:`, e);
            // Add placeholder text for failed image
            if (yPos + lineHeight > maxPageHeight) {
              doc.addPage();
              yPos = margin;
              xOffset = margin;
            }
            doc.setFont('helvetica', 'italic');
            doc.setTextColor(255, 0, 0); // Red color for error
            doc.text(`(Image non chargée: ${photoUrl.substring(0, 50)}...)`, xOffset, yPos);
            doc.setTextColor(0, 0, 0); // Reset color
            doc.setFont('helvetica', 'normal');
            xOffset += 100; // Advance xOffset for placeholder
            if (xOffset + margin > doc.internal.pageSize.getWidth()) {
                xOffset = margin;
                yPos += lineHeight;
            }
            resolve(); // Still resolve to continue PDF generation
          };
        });
      } catch (error) {
        console.error(`Unexpected error processing image from ${photoUrl}:`, error);
        if (yPos + lineHeight > maxPageHeight) {
          doc.addPage();
          yPos = margin;
          xOffset = margin;
        }
        doc.setFont('helvetica', 'italic');
        doc.setTextColor(255, 0, 0);
        doc.text(`(Erreur traitement image: ${photoUrl.substring(0, 50)}...)`, xOffset, yPos);
        doc.setTextColor(0, 0, 0);
        doc.setFont('helvetica', 'normal');
        xOffset += 100;
        if (xOffset + margin > doc.internal.pageSize.getWidth()) {
            xOffset = margin;
            yPos += lineHeight;
        }
      }
    }
    if (currentLineMaxHeight > 0) { // If there were images in the last row
      yPos += currentLineMaxHeight + lineHeight; // Advance yPos by the tallest image in the last row
    }
  }

  if (yPos + lineHeight > maxPageHeight) {
    doc.addPage();
    yPos = margin;
  }
  doc.setFontSize(8);
  doc.text(`Document généré par Automedon le ${new Date().toLocaleDateString()}.`, margin, maxPageHeight - 5);

  doc.save(filename);
};