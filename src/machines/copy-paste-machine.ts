import { assign, createMachine } from 'xstate';
import { ColumnType, TableType } from '@/schemas/base';
import { ReactFlowInstance } from 'reactflow';

type ClipboardPayloadType =
  | { type: 'COLUMN'; payload: ColumnType }
  | { type: 'TABLE'; payload: TableType };

type ClipboardPayloadWithStatusType =
  | ({ status: 'COPIED' | 'CUT' } & ClipboardPayloadType)
  | { status: 'EMPTY' };

type CopyPasteMachineEvent =
  | { type: 'COPY'; data: ClipboardPayloadType }
  | { type: 'CUT'; data: ClipboardPayloadType; reactFlowInstance: ReactFlowInstance };

export const copyPasteMachine = createMachine(
  {
    id: 'COPY_PASTE_MACHINE',
    initial: 'EMPTY_CLIPBOARD',
    states: {
      EMPTY_CLIPBOARD: {
        on: {
          COPY: {
            target: 'FILLED_CLIPBOARD',
            actions: ['replaceClipboard'],
          },
          CUT: {
            target: 'FILLED_CLIPBOARD',
            actions: ['replaceClipboard', 'deleteInstance'],
          },
        },
      },
      FILLED_CLIPBOARD: {
        on: {
          COPY: {
            actions: ['replaceClipboard'],
          },
          CUT: {
            actions: ['replaceClipboard', 'deleteInstance'],
          },
        },
      },
    },
    schema: {
      context: {} as { clipboard: ClipboardPayloadWithStatusType },
      events: {} as CopyPasteMachineEvent,
    },
    context: { clipboard: { status: 'EMPTY' } },
    predictableActionArguments: true,
    preserveActionOrder: true,
  },
  {
    actions: {
      replaceClipboard: assign({
        clipboard(context, event) {
          if (event.data.type === 'TABLE') {
            return {
              type: event.data.type,
              status: event.type === 'COPY' ? ('COPIED' as const) : ('CUT' as const),
              payload: event.data.payload,
            };
          } else if (event.data.type === 'COLUMN') {
            return {
              type: event.data.type,
              status: event.type === 'COPY' ? ('COPIED' as const) : ('CUT' as const),
              payload: event.data.payload,
            };
          } else {
            return {
              status: 'EMPTY' as const,
            };
          }
        },
      }),
      deleteInstance(context, event) {
        if (event.type === 'CUT' && event.data.type === 'TABLE') {
          event.reactFlowInstance.deleteElements({ nodes: [{ id: event.data.payload.id }] });
        }
      },
    },
  },
);
