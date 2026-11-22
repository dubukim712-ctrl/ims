import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Button } from '@/components/ui/Button';
import { Field } from '@/components/ui/Field';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { useBranches } from '@/context/BranchContext';
import { getErrorMessage } from '@/lib/errors';
import type { Branch } from '@/types/domain';

interface BranchManagerModalProps {
  open: boolean;
  onClose: () => void;
  branch?: Branch | null;
}

export function BranchManagerModal({ open, onClose, branch }: BranchManagerModalProps) {
  const { saveBranch } = useBranches();
  const { register, handleSubmit, reset, formState: { isSubmitting, errors } } = useForm({
    defaultValues: { name: branch?.name ?? '', location: branch?.location ?? '' },
  });

  const onSubmit = async (values: { name: string; location: string }) => {
    try {
      await saveBranch({
        id: branch?.id,
        name: values.name,
        location: values.location,
      }, true);
      toast.success(branch ? 'Branch updated' : 'Branch added');
      reset();
      onClose();
    } catch (error) {
      toast.error('Could not save branch', { description: getErrorMessage(error) });
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={branch ? 'Edit branch' : 'Add branch'}
      description="Branches share ingredients and recipes but keep separate stock."
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>Cancel</Button>
          <Button type="submit" form="branch-form" loading={isSubmitting}>
            {branch ? 'Save changes' : 'Add branch'}
          </Button>
        </div>
      }
    >
      <form id="branch-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Field label="Branch name" htmlFor="branch-name" error={errors.name?.message} required>
          <Input id="branch-name" {...register('name', { required: 'Branch name is required' })} />
        </Field>
        <Field label="Location" htmlFor="branch-location">
          <Input id="branch-location" placeholder="Optional" {...register('location')} />
        </Field>
      </form>
    </Modal>
  );
}
