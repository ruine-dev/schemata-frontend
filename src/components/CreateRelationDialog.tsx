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
import { useContext, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { BaseDialog } from './BaseDialog';
import { Checkbox } from './Checkbox';
import { Combobox } from './Combobox';
import { FieldSet } from './FieldSet';
import { Textbox } from './Textbox';
import { Button } from './Button';

export type CreateRelationDialogProps = {
  source: {
    columnId: ColumnType['id'];
    tableId: TableType['id'];
  } | null;
  open: boolean;
  onOpenChange: (isOpen: boolean) => void;
};

export function CreateRelationDialog() {
  const {
    createRelationDialogStore: { source, open, onOpenChange },
  } = useContext(EditorStateContext);

  const { control, register, handleSubmit } = useForm<CreateRelationType>({
    resolver: zodResolver(CreateRelationSchema),
    defaultValues: {
      source: {
        columnId: source?.columnId,
        tableId: source?.tableId,
      },
    },
  });

  const onSubmit = handleSubmit((data) => {});

  const [isAdvancedSettingsEnabled, setIsAdvancedSettingsEnabled] = useState(false);

  return (
    <BaseDialog title="Add Relation" open={open} onOpenChange={onOpenChange}>
      <div className="pt-4 pb-2">
        <form onSubmit={onSubmit} className="flex flex-col gap-y-4">
          <div className="flex gap-x-4">
            <FieldSet label="Source" className="w-64">
              <div className="flex flex-col gap-y-2">
                <Textbox label="Table" name="source-table-name" value="users" readOnly />
                <Textbox
                  label="Column"
                  name="source-column-name"
                  value="organization_id"
                  readOnly
                />
              </div>
            </FieldSet>
            <FieldSet label="Target" className="w-64">
              <div className="flex flex-col gap-y-2">
                <Controller
                  control={control}
                  name="target.tableId"
                  render={({ field: { name, onBlur, onChange, value, ref } }) => (
                    <Combobox
                      ref={ref}
                      label="Table"
                      name={name}
                      options={[]}
                      onBlur={onBlur}
                      onChange={(option) => {
                        if (option && 'value' in option) {
                          onChange(option.value);
                        }
                      }}
                      data-test="relation-target-table-combobox"
                    />
                  )}
                />
                <Controller
                  control={control}
                  name="target.columnId"
                  render={({ field: { name, onBlur, onChange, value, ref } }) => (
                    <Combobox
                      ref={ref}
                      label="Column"
                      name={name}
                      options={[]}
                      onBlur={onBlur}
                      onChange={(option) => {
                        if (option && 'value' in option) {
                          onChange(option.value);
                        }
                      }}
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
            <Button type="button" onClick={() => onOpenChange(false)} className="text-red-500">
              Cancel
            </Button>
            <Button type="submit" variant="outline">
              Save
            </Button>
          </div>
        </form>
      </div>
    </BaseDialog>
  );
}
