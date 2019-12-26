interface filterItem {
  key: string | number;
  title?: string;
  type?: string;
  cols?: 1 | 2 | 3 | 4 | 6 | 8;
  placeholder?: string;
  hide?: boolean;
  initValue?: any;
  normalize?: "dotNumber" | "dotNumberPercent" | "number" | "numberPercent";
  options?: {
    key?: string | number;
    title?: string;
    id?: string | number;
    name?: string;
    props?: { [any: string]: any };
  }[];
  optionsUrl?: string;
  optionsParams?: obj;
  uploadUrl?: string;
  react?: {
    key?: string;
    url?: string;
    paramsKey?: string;
    callback?: (value: any, form: any) => void;
    immediate?: boolean;
  };
  rules?: {
    type?: string;
    required?: boolean;
    message: string;
    validator?: any;
  }[];
  props?: { [any: string]: any };
  tsx?: ReactNode | ((form: any) => ReactNode);
}

type filters = filterItem[];
