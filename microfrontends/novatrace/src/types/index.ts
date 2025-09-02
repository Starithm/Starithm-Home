import { Event } from '@shared/types';

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
