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
  export type Alert = {
    id: number;
    alertKey: string; // Format: GCN-{gcnid}
    broker: string; // Source: gcn, atel, etc.
    event: string; // Event name like "EP J1350.0-8622"
    date: string;
    data: AlertData;
    summary: string;
    confidenceLevel: number; // Confidence score (0.0 to 1.0)
    tags: string[];
    createdAt: Date;
    updatedAt: Date;
  };
  
  export type MeasurementData = {
    ra?: number | null; // Right Ascension in degrees
    dec?: number | null; // Declination in degrees
    redshift?: number | null;
    distance?: number | null; // in Mpc
    magnitude?: number | null;
    duration?: number | null; // in seconds
    fluence?: number | null; // in erg/cm²
    energy?: number | null; // in erg
    tables?: Array<Record<string, any>>;
    other_measurements?: Record<string, any>; // Additional measurements
  };
  
  // Author data structure
  export type AuthorData = {
    universities?: string[];
    institutions?: string[];
    authors?: string[];
    affiliations?: string[];
  };
  
  // Telescope data structure
  export type TelescopeData = {
    telescopes?: string[];
    instruments?: string[];
    observatories?: string[];
    facilities?: string[];
  };
  
  // Basic data from broker parsing
  export type BasicData = {
    event?: string;
    eventType?: string;
    detectionTime?: string;
    author?: string;
    [key: string]: any;
  };
  
  // Alert data structure
  export type AlertData = {
    measurements: MeasurementData;
    authors: AuthorData;
    telescopes: TelescopeData;
    urls?: string[];
    basic_data: BasicData;
    raw: string; // Original email content
  };
  
  // Timeline item structure
  export type TimelineItem = {
    date: string; // ISO date string
    alertKey: string; // Format: GCN-{gcnid}
    summary: string;
    current: boolean; // Whether this is the current alert
  };
  