import * as React from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@radix-ui/react-icons';
import { DayPicker } from 'react-day-picker';

import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
} {
  return (
    .day-range-end)]-r-md [&-range-start)]-l-md first-selected])]-l-md last-selected])]-r-md'
            : '[&-selected])]-md'
        ),
        day
          buttonVariants({ variant: 'ghost' }),
          'h-8 w-8 p-0 font-normal aria-selected-100'
        ),
        day_range_start: 'day-range-start',
        day_range_end: 'day-range-end',
        day_selected:
          'bg-primary text-primary-foreground hover-primary hover-primary-foreground focus-primary focus-primary-foreground',
        day_today: 'bg-accent text-accent-foreground',
        day_outside:
          'day-outside text-muted-foreground opacity-50  aria-selected-accent/50 aria-selected-muted-foreground aria-selected-30',
        day_disabled: 'text-muted-foreground opacity-50',
        day_range_middle:
          'aria-selected-accent aria-selected-accent-foreground',
        day_hidden: 'invisible',
        ...classNames,
      }}
      components={{
        IconLeft ...props }) => <ChevronLeftIcon className="h-4 w-4" />,
        IconRight ...props }) => <ChevronRightIcon className="h-4 w-4" />,
      }}
      {...props}
    />
  );
}
Calendar.displayName = 'Calendar';

export { Calendar };




