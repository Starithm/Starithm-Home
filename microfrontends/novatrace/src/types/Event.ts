export interface Event {
  id: string;
  canonicalId: string;
  alertKind: string;
  sourceName: string;
  phase: string;
  t0: string;
  producedAt: string;
  raDeg?: number;
  decDeg?: number;
  posErrorDeg?: number;
  hasSkymap: boolean;
  classification?: Record<string, any>;
}

export interface EventListResponse {
  events: Event[];
  total?: number;
  page?: number;
  limit?: number;
}

export interface EventDetailsResponse {
  event: Event;
  // Additional details can be added here
}
