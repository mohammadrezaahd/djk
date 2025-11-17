export interface IRegister {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}

export interface ICheckNumber {
  phone: string;
}

export interface ISendOtp {
  phone: string;
}

export interface IVerifyOtp {
  phone: string;
  code: string;
}

export interface ILoginWithPassword {
  phone: string;
  password: string;
}
