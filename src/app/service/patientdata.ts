export class WholeData {
  confirmed: PatientData[] = [];
  deaths: PatientData[] = [];
  recovered: PatientData[] = [];
}

export class PatientData {
  id: string;
  date: string;
  healthCareDistrict: string;
  infectionSourceCountry: string;
}

export class DisplayData {
  districtName: string;
  confirmedCount: number;
  deathCount: number;
  recoveredCount: number;
  confirmedCountries: CountryData[] = [];
  pandemic: boolean;
  dateDetailsMap = {};
  lastDay: DayData;
  dayInfoArray: DayInfo[] = [];
}

export class CountryData {
  name: string;
  count: number;
}

export class DayData {
  date: string;
  count: number;
}

export class DayInfo {
  confirmedCount: number;
  confirmedCountries: CountryData[] = [];
  date: string;
}

export class ThlDistrictData {
  name: string;
  count: string;
}

export class HospitalData {
  area: string;
  inHospital: number;
  inWard: number;
  inIcu: number;
  dead: number;
}

export class HospitalRawData {
  date: string;
  area: string;
  totalHospitalised: number;
  inWard: number;
  inIcu: number;
  dead: number;
}
export class FeedbackData {
  name: string;
  subject: string;
  content: string;
}

