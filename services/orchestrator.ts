
import { WorkflowState, WorkflowNode, NodeStatus } from '../types';

type TaskFunction = (input: any) => Promise<any>;

interface NodeDefinition {
  id: string;
  labelAr: string;
  labelEn: string;
  task: TaskFunction;
}

export class Orchestrator {
  private state: WorkflowState;
  private onUpdate: (state: WorkflowState) => void;

  constructor(
    id: string,
    nameAr: string,
    nameEn: string,
    definitions: NodeDefinition[],
    onUpdate: (state: WorkflowState) => void
  ) {
    this.onUpdate = onUpdate;
    this.state = {
      id,
      nameAr,
      nameEn,
      nodes: definitions.map(d => ({
        id: d.id,
        labelAr: d.labelAr,
        labelEn: d.labelEn,
        status: 'idle'
      })),
      progress: 0,
      isComplete: false
    };
    this.notify();
  }

  private notify() {
    this.onUpdate({ ...this.state });
  }

  private updateNode(id: string, status: NodeStatus, output?: any) {
    this.state.nodes = this.state.nodes.map(n => 
      n.id === id ? { ...n, status, output } : n
    );
    const completed = this.state.nodes.filter(n => n.status === 'completed').length;
    this.state.progress = (completed / this.state.nodes.length) * 100;
    this.notify();
  }

  async execute(definitions: NodeDefinition[], initialInput: any) {
    let currentInput = initialInput;

    for (const def of definitions) {
      this.updateNode(def.id, 'running');
      try {
        currentInput = await def.task(currentInput);
        this.updateNode(def.id, 'completed', currentInput);
      } catch (error: any) {
        this.updateNode(def.id, 'failed');
        this.state.isComplete = true;
        this.notify();
        throw error;
      }
    }

    this.state.isComplete = true;
    this.state.progress = 100;
    this.notify();
    return currentInput;
  }
}
