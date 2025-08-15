import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mission, useMissions } from "@/context/MissionsContext";
import { showSuccess, showError } from "@/utils/toast";

interface AddExpenseDialogProps {
  mission: Mission | null;
  isOpen: boolean;
  onClose: () => void;
}

const AddExpenseDialog: React.FC<AddExpenseDialogProps> = ({
  mission,
  isOpen,
  onClose,
}) => {
  const { addMissionExpense } = useMissions();
  const [expenseType, setExpenseType] = useState("");
  const [amount, setAmount] = useState<string>("");
  const [description, setDescription] = useState("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      // Reset form when dialog closes
      setExpenseType("");
      setAmount("");
      setDescription("");
      setPhotoFile(null);
      setIsSubmitting(false);
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    if (!mission) return;
    if (!expenseType || !amount || isNaN(parseFloat(amount))) {
      showError("Veuillez sélectionner un type de frais et entrer un montant valide.");
      return;
    }

    setIsSubmitting(true);
    try {
      await addMissionExpense(
        mission.id,
        expenseType,
        parseFloat(amount),
        description,
        photoFile
      );
      showSuccess("Frais ajoutés avec succès !");
      onClose();
    } catch (error) {
      console.error("Error adding expense:", error);
      showError("Erreur lors de l'ajout des frais.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!mission) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Ajouter des frais pour la mission</DialogTitle>
          <DialogDescription>
            {mission.modele} ({mission.immatriculation}) - De {mission.lieu_depart} à {mission.lieu_arrivee}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="expenseType" className="text-right">
              Type de frais
            </Label>
            <Select value={expenseType} onValueChange={setExpenseType}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Sélectionnez un type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="carburant">Carburant</SelectItem>
                <SelectItem value="peage">Péage</SelectItem>
                <SelectItem value="repas">Repas</SelectItem>
                <SelectItem value="hebergement">Hébergement</SelectItem>
                <SelectItem value="autre">Autre</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="amount" className="text-right">
              Montant (€)
            </Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description des frais (facultatif)"
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="photo" className="text-right">
              Justificatif
            </Label>
            <Input
              id="photo"
              type="file"
              accept="image/*"
              onChange={(e) => setPhotoFile(e.target.files ? e.target.files[0] : null)}
              className="col-span-3"
            />
          </div>
        </div>
        <Button onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? "Ajout en cours..." : "Ajouter les frais"}
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default AddExpenseDialog;