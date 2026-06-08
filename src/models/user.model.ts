export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  birthDate: string;
  image: string;
  eyeColor: string;
  university: string;
  macAddress: string;
  ip: string;
  address: {
    city: string;
    postalCode: string;
  };
}

export interface LoginData {
  firstName: string;
  lastName: string;
  loginTime: string;
  clickCount: number;
}

export interface UserDetail {
  name: string;
  startTime: string;
  endTime: string;
}
