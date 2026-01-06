export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            site_content: {
                Row: {
                    key: string
                    value: Json
                    updated_at: string
                }
                Insert: {
                    key: string
                    value: Json
                    updated_at?: string
                }
                Update: {
                    key?: string
                    value?: Json
                    updated_at?: string
                }
            }
            site_media: {
                Row: {
                    id: string
                    section: 'hero' | 'gallery' | 'property' | 'experiences' | 'location'
                    title: string | null
                    alt: string
                    storage_path: string
                    sort_order: number
                    is_primary: boolean
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    section: 'hero' | 'gallery' | 'property' | 'experiences' | 'location'
                    title?: string | null
                    alt: string
                    storage_path: string
                    sort_order?: number
                    is_primary?: boolean
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    section?: 'hero' | 'gallery' | 'property' | 'experiences' | 'location'
                    title?: string | null
                    alt?: string
                    storage_path?: string
                    sort_order?: number
                    is_primary?: boolean
                    created_at?: string
                    updated_at?: string
                }
            }
            pricing_seasons: {
                Row: {
                    id: string
                    name: string
                    start_date: string
                    end_date: string
                    currency: string
                    nightly_min: number | null
                    nightly_max: number | null
                    weekly_min: number | null
                    weekly_max: number | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    name: string
                    start_date: string
                    end_date: string
                    currency?: string
                    nightly_min?: number | null
                    nightly_max?: number | null
                    weekly_min?: number | null
                    weekly_max?: number | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    name?: string
                    start_date?: string
                    end_date?: string
                    currency?: string
                    nightly_min?: number | null
                    nightly_max?: number | null
                    weekly_min?: number | null
                    weekly_max?: number | null
                    created_at?: string
                    updated_at?: string
                }
            }
            stay_rules: {
                Row: {
                    id: string
                    name: string
                    start_date: string
                    end_date: string
                    priority: number
                    min_nights: number
                    allowed_check_in_dow: number[] | null
                    allowed_check_out_dow: number[] | null
                    enforce_exact_nights: boolean
                    exact_nights: number | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    name: string
                    start_date: string
                    end_date: string
                    priority?: number
                    min_nights?: number
                    allowed_check_in_dow?: number[] | null
                    allowed_check_out_dow?: number[] | null
                    enforce_exact_nights?: boolean
                    exact_nights?: number | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    name?: string
                    start_date?: string
                    end_date?: string
                    priority?: number
                    min_nights?: number
                    allowed_check_in_dow?: number[] | null
                    allowed_check_out_dow?: number[] | null
                    enforce_exact_nights?: boolean
                    exact_nights?: number | null
                    created_at?: string
                    updated_at?: string
                }
            }
            blocked_dates: {
                Row: {
                    id: string
                    start_date: string
                    end_date: string
                    reason: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    start_date: string
                    end_date: string
                    reason?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    start_date?: string
                    end_date?: string
                    reason?: string | null
                    created_at?: string
                    updated_at?: string
                }
            }
            quote_requests: {
                Row: {
                    id: string
                    created_at: string
                    updated_at: string
                    status: 'new' | 'replied' | 'booked' | 'closed'
                    source_page: string | null
                    check_in: string
                    check_out: string
                    guests: number
                    full_name: string
                    email: string
                    phone: string | null
                    prefers_whatsapp: boolean
                    pets: boolean
                    pets_details: string | null
                    event: boolean
                    event_details: string | null
                    arrival_time: string | null
                    special_requests: string | null
                    estimate_currency: string | null
                    estimate_min: number | null
                    estimate_max: number | null
                    estimate_breakdown: Json | null
                }
                Insert: {
                    id?: string
                    created_at?: string
                    updated_at?: string
                    status?: 'new' | 'replied' | 'booked' | 'closed'
                    source_page?: string | null
                    check_in: string
                    check_out: string
                    guests: number
                    full_name: string
                    email: string
                    phone?: string | null
                    prefers_whatsapp?: boolean
                    pets?: boolean
                    pets_details?: string | null
                    event?: boolean
                    event_details?: string | null
                    arrival_time?: string | null
                    special_requests?: string | null
                    estimate_currency?: string | null
                    estimate_min?: number | null
                    estimate_max?: number | null
                    estimate_breakdown?: Json | null
                }
                Update: {
                    id?: string
                    created_at?: string
                    updated_at?: string
                    status?: 'new' | 'replied' | 'booked' | 'closed'
                    source_page?: string | null
                    check_in?: string
                    check_out?: string
                    guests?: number
                    full_name?: string
                    email?: string
                    phone?: string | null
                    prefers_whatsapp?: boolean
                    pets?: boolean
                    pets_details?: string | null
                    event?: boolean
                    event_details?: string | null
                    arrival_time?: string | null
                    special_requests?: string | null
                    estimate_currency?: string | null
                    estimate_min?: number | null
                    estimate_max?: number | null
                    estimate_breakdown?: Json | null
                }
            }
        }
    }
}
