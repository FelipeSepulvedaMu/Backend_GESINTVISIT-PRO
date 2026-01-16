export type VisitType = 'visita' | 'encomienda';

export interface Visit {
  id?: string;
  date: Date | string;
  houseNumber: string;
  residentName: string;
  type: VisitType;
  visitorName: string;
  visitorRut: string;
  plate?: string;
  conciergeName: string;
  createdAt?: Date;
}

export interface House {
  id: string;
  number: string;
  residentName: string;
  phone: string;
  ownerEmail?: string;
}

export interface CreateVisitDTO {
  date: string;
  houseNumber: string;
  residentName: string;
  type: VisitType;
  visitorName: string;
  visitorRut: string;
  plate?: string;
  conciergeName: string;
}