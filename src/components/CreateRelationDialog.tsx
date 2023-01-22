import { EditorStateContext } from '@/contexts/EditorStateContext';
import {
  ColumnType,
  CreateRelationSchema,
  CreateRelationType,
  RelationActionEnum,
  TableType,
} from '@/schemas/base';
import * as Accordion from '@radix-ui/react-accordion';
import { zodResolver } from '@hookform/resolvers/zod';
import { useContext, useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { BaseDialog } from './BaseDialog';
import { Checkbox } from './Checkbox';
import { Combobox } from './Combobox';
import { FieldSet } from './FieldSet';
import { Textbox } from './Textbox';
import { Button } from './Button';
import { useLocalSchemaQuery } from '@/queries/useSchemaQuery';
import { useCreateRelation } from '@/flow-hooks/useCreateRelation';

export type CreateRelationDialogProps = {
  source: {
    columnId: ColumnType['id'];
    tableId: TableType['id'];
  } | null;
  setSource: (source: CreateRelationDialogProps['source']) => void;
};

export function CreateRelationDialog() {
  const {
    createRelationDialogStore: { source, setSource },
  } = useContext(EditorStateContext);

  const { data: schema } = useLocalSchemaQuery();

  const {
    control,
    formState: { isSubmitting },
    handleSubmit,
    register,
    reset,
    resetField,
    setValue,
    watch,
  } = useForm<CreateRelationType>({
    resolver: zodResolver(CreateRelationSchema),
    defaultValues: {
      source: {
        columnId: source?.columnId,
        tableId: source?.tableId,
      },
      actions: { onDelete: 'RESTRICT', onUpdate: 'RESTRICT' },
    },
  });

  const sourceTable = schema?.tables.find((table) => table.id === source?.tableId);
  const targetTable = schema?.tables.find((table) => table.id === watch('target.tableId'));

  const sourceColumn = sourceTable?.columns.find((column) => column.id === source?.columnId);

  const [isAdvancedSettingsEnabled, setIsAdvancedSettingsEnabled] = useState(false);

  const createRelation = useCreateRelation();

  const onSubmit = handleSubmit((data) => {
    createRelation(data);

    setSource(null);
  });

  useEffect(() => {
    if (source) {
      setValue('source.columnId', source?.columnId);
      setValue('source.tableId', source?.tableId);
    }
  }, [source]);

  return (
    <BaseDialog
      title="Add Relation"
      open={source !== null}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          setSource(null);
          reset();
          setIsAdvancedSettingsEnabled(false);
        }
      }}
    >
      <div className="pt-4 pb-2">
        <form onSubmit={onSubmit} className="flex flex-col gap-y-4">
          <div className="flex gap-x-4">
            <FieldSet label="Source" className="w-64">
              <div className="flex flex-col gap-y-2">
                {source !== null && (
                  <>
                    <Textbox
                      label="Table"
                      name="source-table-name"
                      value={sourceTable?.name}
                      readOnly
                      disabled={isSubmitting}
                      data-test="relation-source-table-name"
                    />
                    <Textbox
                      label="Column"
                      name="source-column-name"
                      value={sourceColumn?.name}
                      readOnly
                      disabled={isSubmitting}
                      data-test="relation-source-column-name"
                    />
                  </>
                )}
              </div>
            </FieldSet>
            <FieldSet label="Target" className="w-64">
              <div className="flex flex-col gap-y-2">
                <Controller
                  control={control}
                  name="target.tableId"
                  shouldUnregister
                  render={({ field: { name, onBlur, onChange, value, ref } }) => (
                    <Combobox
                      ref={ref}
                      label="Table"
                      name={name}
                      menuPortalTarget={document.body}
                      styles={{ menuPortal: (base) => ({ ...base, pointerEvents: 'auto' }) }}
                      options={
                        schema?.tables.map((table) => ({
                          label: table.name,
                          value: table.id,
                        })) ?? []
                      }
                      onBlur={onBlur}
                      onChange={(option) => {
                        if (option && 'value' in option) {
                          onChange(option.value);

                          resetField('name');
                          resetField('target.columnId');
                        }
                      }}
                      value={
                        schema?.tables
                          .map((table) => ({ label: table.name, value: table.id }))
                          .find((option) => option.value === value) ?? null
                      }
                      isDisabled={isSubmitting}
                      data-test="relation-target-table-combobox"
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="target.columnId"
                  shouldUnregister
                  render={({ field: { name, onBlur, onChange, value, ref } }) => (
                    <Combobox
                      ref={ref}
                      label="Column"
                      name={name}
                      menuPortalTarget={document.body}
                      styles={{ menuPortal: (base) => ({ ...base, pointerEvents: 'auto' }) }}
                      options={
                        targetTable?.columns
                          .filter((column) => column.id !== source?.columnId)
                          .map((column) => ({ label: column.name, value: column.id })) ?? []
                      }
                      onBlur={onBlur}
                      onChange={(option) => {
                        if (option && 'value' in option) {
                          onChange(option.value);
                          setValue(
                            'name',
                            `fk_${sourceTable?.name}_${targetTable?.name}_${sourceColumn?.name}`,
                          );
                        }
                      }}
                      value={
                        targetTable?.columns
                          .map((column) => ({ label: column.name, value: column.id }))
                          .find((option) => option.value === value) ?? null
                      }
                      isDisabled={watch('target.tableId') === undefined || isSubmitting}
                      data-test="relation-target-column-combobox"
                    />
                  )}
                />
              </div>
            </FieldSet>
          </div>
          <Accordion.Root
            type="single"
            value={isAdvancedSettingsEnabled ? 'advanced-settings' : ''}
            collapsible
            className="rounded border border-gray-200 p-4"
          >
            <Accordion.Item value="advanced-settings">
              <Accordion.Header>
                <Checkbox
                  label="Advanced settings"
                  name="as"
                  onChange={(e) => {
                    setIsAdvancedSettingsEnabled(e.target.checked);
                  }}
                />
              </Accordion.Header>
              <Accordion.Content asChild>
                <div className="mt-4 flex flex-col gap-y-4">
                  <Textbox {...register('name')} label="Constraint name" />
                  <div className="flex gap-x-4">
                    <Controller
                      control={control}
                      name="actions.onUpdate"
                      render={({ field: { name, onBlur, onChange, value, ref } }) => (
                        <Combobox
                          ref={ref}
                          label="On Update"
                          name={name}
                          options={RelationActionEnum.options.map((action) => ({
                            label: action,
                            value: action,
                          }))}
                          onBlur={onBlur}
                          onChange={(option) => {
                            if (option && 'value' in option) {
                              onChange(option.value);
                            }
                          }}
                          value={RelationActionEnum.options
                            .map((action) => ({ label: action, value: action }))
                            .find((option) => option.value === value)}
                          data-test="relation-action-on-update-combobox"
                          className="w-1/2"
                        />
                      )}
                    />
                    <Controller
                      control={control}
                      name="actions.onDelete"
                      render={({ field: { name, onBlur, onChange, value, ref } }) => (
                        <Combobox
                          ref={ref}
                          label="On Delete"
                          name={name}
                          options={RelationActionEnum.options.map((action) => ({
                            label: action,
                            value: action,
                          }))}
                          onBlur={onBlur}
                          onChange={(option) => {
                            if (option && 'value' in option) {
                              onChange(option.value);
                            }
                          }}
                          value={RelationActionEnum.options
                            .map((action) => ({ label: action, value: action }))
                            .find((option) => option.value === value)}
                          data-test="relation-action-on-delete-combobox"
                          className="w-1/2"
                        />
                      )}
                    />
                  </div>
                </div>
              </Accordion.Content>
            </Accordion.Item>
          </Accordion.Root>
          <div className="flex justify-end gap-x-2">
            <Button type="button" onClick={() => setSource(null)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={isSubmitting}>
              Save
            </Button>
          </div>
        </form>
      </div>
    </BaseDialog>
  );
}
