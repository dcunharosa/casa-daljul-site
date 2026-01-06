import { Database } from '@/types/database.types';

export type PricingSeason = Database['public']['Tables']['pricing_seasons']['Row'];
export type StayRule = Database['public']['Tables']['stay_rules']['Row'];
export type BlockedDate = Database['public']['Tables']['blocked_dates']['Row'];

export interface DateRange {
    from: Date;
    to: Date;
}

export interface PriceBreakdown {
    total: number;
    currency: string;
    nights: number;
    segments: {
        type: 'night' | 'week';
        start: string;
        end: string;
        price: number;
        season_id?: string;
    }[];
}

export interface QuoteEstimate {
    min: number;
    max: number;
    currency: string;
    breakdown: {
        min: PriceBreakdown;
        max: PriceBreakdown;
    };
}

export interface StayValidation {
    valid: boolean;
    errors: string[];
}
