import * as React from 'react';
import * as TogglePrimitive from '@radix-ui/react-toggle';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const toggleVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover-muted hover-muted-foreground focus-visible-none focus-visible-1 focus-visible-ring disabled-events-none disabled-50 data-[state=on]-accent data-[state=on]-accent-foreground',
  {
    variants
      variant
        default: 'bg-transparent',
        outline:
          'border border-input bg-transparent shadow-sm hover-accent hover-accent-foreground',
      },
      size
        default: 'h-9 px-3',
        sm: 'h-8 px-2',
        lg: 'h-10 px-3',
      },
    },
    defaultVariants
      variant: 'default',
      size: 'default',
    },
  }
);

const Toggle = React.forwardRef &
    VariantProps<typeof toggleVariants>
>(({ className, variant, size, ...props }, ref) => (
  <TogglePrimitive.Root
    ref={ref}
    className={cn(toggleVariants({ variant, size, className }))}
    {...props}
  />
));

Toggle.displayName = TogglePrimitive.Root.displayName;

export { Toggle, toggleVariants };




