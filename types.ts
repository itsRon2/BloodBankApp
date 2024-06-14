export interface Donor {
  id: number;
  name: string;
  date: number;
  national_id: string;
  height: number;
  mass: number;
  packNumber: number;
  age: number;
  sex: string;
}

export interface DonorsBled {
  maleDonors: number;
  femaleDonors: number;
}

export type RootStackParamList = {
  Home: undefined;
  Sync: undefined;
  SplashScreen: undefined;
};
