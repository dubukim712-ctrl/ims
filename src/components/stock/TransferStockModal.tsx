import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/Button';
import { Field } from '@/components/ui/Field';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { useBranches } from '@/context/BranchContext';
import { useTransferStock } from '@/hooks/useStock';
import { listIngredients } from '@/services/ingredients.service';
import { getErrorMessage } from '@/lib/errors';
import { formatQuantity } from '@/lib/format';
import type { Ingredient } from '@/types/domain';

interface TransferStockModalProps {
  open: boolean;
  onClose: () => void;
  ingredientId?: string;
}

export function TransferStockModal({ open, onClose, ingredientId }: TransferStockModalProps) {
  const { branches, selectedBranch } = useBranches();
  const transfer = useTransferStock();
  const [fromBranchId, setFromBranchId] = useState(selectedBranch?.id ?? '');
  const [toBranchId, setToBranchId] = useState('');
  const [selectedIngredientId, setSelectedIngredientId] = useState(ingredientId ?? '');
  const [quantity, setQuantity] = useState(1);
  const [note, setNote] = useState('');

  const [fromIngredients, setFromIngredients] = useState<Ingredient[]>([]);
  useEffect(() => {
    if (!fromBranchId) return;
    void listIngredients(fromBranchId).then(setFromIngredients).catch((error) => {
      toast.error('Could not load source stock', { description: getErrorMessage(error) });
    });
  }, [fromBranchId]);
  const ingredient = fromIngredients.find((item) => item.id === selectedIngredientId);
  const destinationBranches = useMemo(
    () => branches.filter((branch) => branch.id !== fromBranchId),
    [branches, fromBranchId],
  );

  const submit = async () => {
    if (!fromBranchId || !toBranchId || !selectedIngredientId) {
      toast.error('Choose a source, destination and ingredient');
      return;
    }
    if (!ingredient || quantity <= 0 || quantity > ingredient.current_stock) {
      toast.error('Quantity exceeds available source stock');
      return;
    }
    try {
      await transfer.mutateAsync({
        from_branch_id: fromBranchId,
        to_branch_id: toBranchId,
        ingredient_id: selectedIngredientId,
        quantity,
        note,
      });
      toast.success('Stock transferred');
      onClose();
    } catch (error) {
      toast.error('Could not transfer stock', { description: getErrorMessage(error) });
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Transfer stock"
      description="Move inventory between branches atomically."
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose} disabled={transfer.isPending}>Cancel</Button>
          <Button onClick={() => void submit()} loading={transfer.isPending}>Transfer stock</Button>
        </div>
      }
    >
      <div className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="From branch" htmlFor="from-branch" required>
            <Select id="from-branch" value={fromBranchId} onChange={(event) => setFromBranchId(event.target.value)}>
              {branches.map((branch) => (
                <option key={branch.id} value={branch.id}>{branch.name}</option>
              ))}
            </Select>
          </Field>
          <Field label="To branch" htmlFor="to-branch" required>
            <Select id="to-branch" value={toBranchId} onChange={(event) => setToBranchId(event.target.value)}>
              <option value="">Choose branch</option>
              {destinationBranches.map((branch) => (
                <option key={branch.id} value={branch.id}>{branch.name}</option>
              ))}
            </Select>
          </Field>
        </div>
        <Field label="Ingredient" htmlFor="transfer-ingredient" required>
          <Select
            id="transfer-ingredient"
            value={selectedIngredientId}
            onChange={(event) => setSelectedIngredientId(event.target.value)}
          >
            <option value="">Choose ingredient</option>
            {fromIngredients.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name} · {formatQuantity(item.current_stock, item.unit)} available
              </option>
            ))}
          </Select>
        </Field>
        <Field
          label="Quantity"
          htmlFor="transfer-quantity"
          hint={ingredient ? `Available: ${formatQuantity(ingredient.current_stock, ingredient.unit)}` : undefined}
          required
        >
          <Input
            id="transfer-quantity"
            type="number"
            min="0.01"
            step="0.01"
            value={quantity}
            onChange={(event) => setQuantity(Number(event.target.value) || 0)}
          />
        </Field>
        <Field label="Note" htmlFor="transfer-note">
          <Textarea
            id="transfer-note"
            value={note}
            onChange={(event) => setNote(event.target.value)}
            placeholder="Optional transfer note"
          />
        </Field>
      </div>
    </Modal>
  );
}
