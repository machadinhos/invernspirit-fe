export type Country = {
  name: string;
  code: string;
  locale: string;
  currency: {
    code: string;
    name: string;
    symbol: string;
  };
  taxes: Taxes[];
};

export type Taxes = {
  name: string;
  rate: number;
};
