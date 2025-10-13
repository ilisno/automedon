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
  const addField = (label: string, value: string | number | null | undefined) => {
    if (yPos + lineHeight * 3 > maxPageHeight) { // Check if label, value, and extra line fit
      doc.addPage();
      yPos = margin;
    }
    doc.setFont('helvetica', 'bold');
    doc.text(`${label}:`, margin, yPos);
    yPos += lineHeight; // Move to next line for value

    doc.setFont('helvetica', 'normal');
    const textValue = value !== null && value !== undefined ? String(value) : 'N/A';
    const splitText = doc.splitTextToSize(textValue, 180 - margin); // Adjust width for value
    doc.text(splitText, margin + 5, yPos); // Indent value slightly
    yPos += lineHeight * (splitText.length > 1 ? splitText.length : 1);
    yPos += lineHeight; // Add an extra line for spacing
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

    const imgWidth = 80; // Width of image in mm
    const imgHeight = 60; // Height of image in mm
    let xOffset = margin;

    for (const photoUrl of sheet.photos) {
      try {
        const response = await fetch(photoUrl);
        const blob = await response.blob();
        const reader = new FileReader();
        await new Promise<void>((resolve) => {
          reader.onload = () => {
            const imgData = reader.result as string;
            if (yPos + imgHeight + lineHeight > maxPageHeight) { // Check if image fits on current page
              doc.addPage();
              yPos = margin;
              xOffset = margin; // Reset xOffset for new page
            }

            doc.addImage(imgData, 'JPEG', xOffset, yPos, imgWidth, imgHeight);
            xOffset += imgWidth + margin; // Move to next position for image
            if (xOffset + imgWidth > doc.internal.pageSize.getWidth() - margin) { // If next image won't fit horizontally
              xOffset = margin; // Reset xOffset
              yPos += imgHeight + lineHeight; // Move to next row
            }
            resolve();
          };
          reader.readAsDataURL(blob);
        });
      } catch (error) {
        console.error(`Failed to load image from ${photoUrl}:`, error);
        if (yPos + lineHeight > maxPageHeight) {
          doc.addPage();
          yPos = margin;
        }
        doc.setFont('helvetica', 'italic');
        doc.setTextColor(255, 0, 0); // Red color for error
        doc.text(`(Image non chargée: ${photoUrl.substring(0, 50)}...)`, xOffset, yPos);
        doc.setTextColor(0, 0, 0); // Reset color
        doc.setFont('helvetica', 'normal');
        yPos += lineHeight;
      }
    }
    if (xOffset !== margin) { // If last row wasn't full, advance yPos
      yPos += imgHeight + lineHeight;
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