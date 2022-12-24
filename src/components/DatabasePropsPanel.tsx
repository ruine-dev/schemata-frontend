import { FloppyDisk, Pencil, X } from 'phosphor-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { DatabaseProps, DatabaseSchema } from '@/schemas/database';
import { IconButton } from './IconButton';
import { useSaveDatabaseLocal } from '@/mutations/useSaveDatabaseLocal';
import { EditorPanelContainer } from './EditorPanelContainer';

interface DatabasePropsPanelProps {
  database?: DatabaseProps;
}

export function DatabasePropsPanel({ database }: DatabasePropsPanelProps) {
  const [isRenaming, setIsRenaming] = useState(false);
  const { mutateAsync: saveDatabaseLocal } = useSaveDatabaseLocal();
  const {
    register,
    handleSubmit,
    formState: { isDirty, isSubmitting },
    reset,
  } = useForm<DatabaseProps>({
    resolver: zodResolver(DatabaseSchema),
    defaultValues: database,
  });

  const onSubmit = handleSubmit(async (data) => {
    await saveDatabaseLocal(data);

    setIsRenaming(false);
  });

  const handleCancelRename = () => {
    reset();
    setIsRenaming(false);
  };

  const handleRename = () => {
    setIsRenaming(true);
  };

  useEffect(() => {
    reset(database);
  }, [reset, database]);

  return (
    <EditorPanelContainer>
      {isRenaming ? (
        <form onSubmit={onSubmit} className="flex items-center">
          <input
            {...register('name')}
            type="text"
            disabled={isSubmitting}
            autoFocus
            className="form-input"
          />
          <IconButton
            type="button"
            label="Cancel"
            icon={X}
            severity="danger"
            onClick={handleCancelRename}
            disabled={isSubmitting}
            size="large"
            className="ml-1"
          />
          <IconButton
            type="submit"
            label="Save"
            icon={FloppyDisk}
            severity="primary"
            disabled={!isDirty}
            loading={isSubmitting}
            size="large"
          />
        </form>
      ) : (
        <>
          <span className="py-2 px-3 text-slate-800">{database?.name}</span>
          <IconButton
            label="Change title"
            icon={Pencil}
            onClick={handleRename}
            size="large"
            className="ml-2"
          />
        </>
      )}
    </EditorPanelContainer>
  );
}
