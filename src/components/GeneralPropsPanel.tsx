import { Check, Pencil } from 'phosphor-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { IconButton } from './IconButton';
import { useSaveLocalSchema } from '@/mutations/useSaveLocalSchema';
import { EditorPanelContainer } from './EditorPanelContainer';
import { SchemaSchema, SchemaType } from '@/schemas/base';
import { Textbox } from './Textbox';
import FocusLock from 'react-focus-lock';

interface GeneralPropsPanelProps {
  schema: SchemaType;
}

export function GeneralPropsPanel({ schema }: GeneralPropsPanelProps) {
  const [isRenaming, setIsRenaming] = useState(false);
  const { mutateAsync: saveDatabaseLocal } = useSaveLocalSchema(schema.id);
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = useForm<SchemaType>({
    resolver: zodResolver(SchemaSchema),
    defaultValues: schema,
  });

  const onSubmit = handleSubmit(async (data) => {
    await saveDatabaseLocal(data);

    setIsRenaming(false);
  });

  const handleRename = () => {
    setIsRenaming(true);
  };

  useEffect(() => {
    reset(schema);
  }, [reset, schema?.name]);

  return (
    <EditorPanelContainer>
      {isRenaming ? (
        <FocusLock>
          <form
            onSubmit={onSubmit}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                e.preventDefault();
                e.stopPropagation();
                onSubmit();
              }
            }}
            autoComplete="off"
            className="flex items-center gap-x-1"
          >
            <Textbox
              label="Name"
              {...register('name', {
                setValueAs(value: string) {
                  return value.trim();
                },
              })}
              disabled={isSubmitting}
              autoFocus
              srOnlyLabel
            />
            <IconButton
              type="submit"
              label="Save (ENTER)"
              icon={Check}
              severity="primary"
              loading={isSubmitting}
              data-test="submit-schema"
             
              filled
            />
          </form>
        </FocusLock>
      ) : (
        <>
          <span data-test="schema-name" className="py-2 px-3 text-slate-800">
            {schema?.name}
          </span>
          <IconButton
            label="Change title"
            icon={Pencil}
            onClick={handleRename}
           
            data-test="edit-schema-button"
            filled
            className="ml-2"
          />
        </>
      )}
    </EditorPanelContainer>
  );
}
