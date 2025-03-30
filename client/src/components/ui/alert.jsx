import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const alertVariants = cva(
  'relative w-full rounded-lg border px-4 py-3 text-sm [&>svg+div]-y-[-3px] [&>svg] [&>svg]-4 [&>svg]-4 [&>svg]-foreground [&>svg~*]-7',
  {
    variants
      variant
        default: 'bg-background text-foreground',
        destructive:
          'border-destructive/50 text-destructive dark-destructive [&>svg]-destructive',
      },
    },
    defaultVariants
      variant: 'default',
    },
  }
);

const Alert = React.forwardRef & VariantProps<typeof alertVariants>
>(({ className, variant, ...props }, ref) => (
  <div
    ref={ref}
    role="alert"
    className={cn(alertVariants({ variant }), className)}
    {...props}
  />
));
Alert.displayName = 'Alert';

const AlertTitle = React.forwardRef
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn('mb-1 font-medium leading-none tracking-tight', className)}
    {...props}
  />
));
AlertTitle.displayName = 'AlertTitle';

const AlertDescription = React.forwardRef
>(({ className, ...props }, ref) => (
  
));
AlertDescription.displayName = 'AlertDescription';

export { Alert, AlertTitle, AlertDescription };




