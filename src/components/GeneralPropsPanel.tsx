import { FloppyDisk, Pencil, X } from 'phosphor-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { IconButton } from './IconButton';
import { useSaveLocalSchema } from '@/mutations/useSaveLocalSchema';
import { EditorPanelContainer } from './EditorPanelContainer';
import { SchemaSchema, SchemaType } from '@/schemas/base';

interface GeneralPropsPanelProps {
  schema?: SchemaType;
}

export function GeneralPropsPanel({ schema }: GeneralPropsPanelProps) {
  const [isRenaming, setIsRenaming] = useState(false);
  const { mutateAsync: saveDatabaseLocal } = useSaveLocalSchema();
  const {
    register,
    handleSubmit,
    formState: { isDirty, isSubmitting },
    reset,
  } = useForm<SchemaType>({
    resolver: zodResolver(SchemaSchema),
    defaultValues: schema,
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
    reset(schema);
  }, [reset, schema]);

  return (
    <EditorPanelContainer>
      {isRenaming ? (
        <form onSubmit={onSubmit} autoComplete="off" className="flex items-center">
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
            data-test="submit-schema"
            size="large"
          />
        </form>
      ) : (
        <>
          <span data-test="schema-name" className="py-2 px-3 text-slate-800">
            {schema?.name}
          </span>
          <IconButton
            label="Change title"
            icon={Pencil}
            onClick={handleRename}
            size="large"
            data-test="edit-schema-button"
            className="ml-2"
          />
        </>
      )}
    </EditorPanelContainer>
  );
}
