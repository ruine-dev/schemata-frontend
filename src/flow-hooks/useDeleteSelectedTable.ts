import { useReactFlow } from 'reactflow';

export function useDeleteSelectedTable() {
  const reactFlowInstance = useReactFlow();

  return () => {
    const nodes = reactFlowInstance.getNodes();
    const selectedNodes = nodes.filter((node) => node.selected);

    reactFlowInstance.deleteElements({ nodes: selectedNodes });
  };
}
