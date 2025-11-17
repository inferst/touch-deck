export interface IPlugin {
  uuid: string;
  actions?: Action[];
  enable?: () => void;
  onEvent?: (event: string, data: any) => void;
}

export abstract class Action {
  abstract uuid: string;
  onPress(_event: ActionEvent): void {}
  onRelease(): void {}
  onMount(): void {}
  onUnmount(): void {}
}

export type ActionEvent = {
  id: string;
  data: any;
};

