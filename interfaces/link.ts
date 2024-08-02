export interface Link {
  name: string;
  href?: string;
  variant?:
    | "solid"
    | "bordered"
    | "light"
    | "flat"
    | "faded"
    | "shadow"
    | "ghost";
  fn?: () => void;
  icon?: string;
  links?: Link[];
  value?: number;
}
