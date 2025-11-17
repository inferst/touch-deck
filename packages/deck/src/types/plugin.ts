export type Action = {
  name: string;
  uuid: string;
};

export type Manifest = {
  name: string;
  uuid: string;
  category: string;
  description: string;
  actions: Action[];
};

export type Plugins = {
  plugins: Manifest[];
};
