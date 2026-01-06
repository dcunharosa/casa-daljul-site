import { differenceInDays, getDay, isSameDay } from 'date-fns';
import { StayRule, StayValidation, BlockedDate } from './types';

export function validateStay(
    checkIn: Date,
    checkOut: Date,
    rules: StayRule[],
    blockedDates: BlockedDate[]
): StayValidation {
    const errors: string[] = [];
    const nights = differenceInDays(checkOut, checkIn);

    if (nights < 1) {
        return { valid: false, errors: ['Check-out date must be after check-in date'] };
    }

    // 1. Check Blocked Dates
    const isBlocked = blockedDates.some(block => {
        const blockStart = new Date(block.start_date);
        const blockEnd = new Date(block.end_date);
        // Overlap logic: (StartA < EndB) and (EndA > StartB)
        // Stay is [checkIn, checkOut), Block is [blockStart, blockEnd)
        return checkIn < blockEnd && checkOut > blockStart;
    });

    if (isBlocked) {
        return { valid: false, errors: ['Selected dates are not available'] };
    }

    // 2. Find Applicable Rule
    // "The rule whose date range contains check_in, with highest priority."
    const applicableRule = rules
        .filter(r => {
            const start = new Date(r.start_date);
            const end = new Date(r.end_date);
            return checkIn >= start && checkIn < end;
        })
        .sort((a, b) => b.priority - a.priority)[0];

    if (!applicableRule) {
        // If no rule matches, maybe fallback to default? Or allow?
        // Let's assume there is always a default rule, or if not, we allow it.
        // For safety in this bespoke system, if no rule coverage, we might warn, 
        // but returning valid=true is standard if no restrictions apply.
        return { valid: true, errors: [] };
    }

    // 3. Enforce Rule

    // Min Nights
    if (nights < applicableRule.min_nights) {
        errors.push(`Minimum stay for this period is ${applicableRule.min_nights} nights`);
    }

    // Exact Nights
    if (applicableRule.enforce_exact_nights && applicableRule.exact_nights) {
        if (nights !== applicableRule.exact_nights) {
            errors.push(`Stay must be exactly ${applicableRule.exact_nights} nights`);
        }
    }

    // Check-in Day
    if (applicableRule.allowed_check_in_dow && applicableRule.allowed_check_in_dow.length > 0) {
        const day = getDay(checkIn); // 0 = Sun, 6 = Sat
        if (!applicableRule.allowed_check_in_dow.includes(day)) {
            errors.push('Check-in not allowed on this day');
        }
    }

    // Check-out Day
    if (applicableRule.allowed_check_out_dow && applicableRule.allowed_check_out_dow.length > 0) {
        const day = getDay(checkOut);
        if (!applicableRule.allowed_check_out_dow.includes(day)) {
            errors.push('Check-out not allowed on this day');
        }
    }

    return {
        valid: errors.length === 0,
        errors
    };
}
