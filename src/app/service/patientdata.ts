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
  lastDayInfo: DayInfo;
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
