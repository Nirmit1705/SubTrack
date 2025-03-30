import * as React from 'react';
import { Cross2Icon } from '@radix-ui/react-icons';
import * as ToastPrimitives from '@radix-ui/react-toast';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const ToastProvider = ToastPrimitives.Provider;

const ToastViewport = React.forwardRef
>(({ className, ...props }, ref) => (
  
));
ToastViewport.displayName = ToastPrimitives.Viewport.displayName;

const toastVariants = cva(
  'group pointer-events-auto relative flex w-full items-center justify-between space-x-2 overflow-hidden rounded-md border p-4 pr-6 shadow-lg transition-all data-[swipe=cancel]-x-0 data-[swipe=end]-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]-none data-[state=open]-in data-[state=closed]-out data-[swipe=end]-out data-[state=closed]-out-80 data-[state=closed]-out-to-right-full data-[state=open]-in-from-top-full data-[state=open]-in-from-bottom-full',
  {
    variants
      variant
        default: 'border bg-background text-foreground',
        destructive:
          'destructive group border-destructive bg-destructive text-destructive-foreground',
      },
    },
    defaultVariants
      variant: 'default',
    },
  }
);

const Toast = React.forwardRef &
    VariantProps<typeof toastVariants>
>(({ className, variant, ...props }, ref) => {
  return (
    <ToastPrimitives.Root
      ref={ref}
      className={cn(toastVariants({ variant }), className)}
      {...props}
    />
  );
});
Toast.displayName = ToastPrimitives.Root.displayName;

const ToastAction = React.forwardRef
>(({ className, ...props }, ref) => (
  
));
ToastAction.displayName = ToastPrimitives.Action.displayName;

const ToastClose = React.forwardRef
>(({ className, ...props }, ref) => (
  
    <Cross2Icon className="h-4 w-4" />
  </ToastPrimitives.Close>
));
ToastClose.displayName = ToastPrimitives.Close.displayName;

const ToastTitle = React.forwardRef
>(({ className, ...props }, ref) => (
  
));
ToastTitle.displayName = ToastPrimitives.Title.displayName;

const ToastDescription = React.forwardRef
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Description
    ref={ref}
    className={cn('text-sm opacity-90', className)}
    {...props}
  />
));
ToastDescription.displayName = ToastPrimitives.Description.displayName;

type ToastProps = React.ComponentPropsWithoutRef<typeof Toast>;

type ToastActionElement = React.ReactElement<typeof ToastAction>;

export {
  type ToastProps,
  type ToastActionElement,
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
};




