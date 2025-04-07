import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function FloatingButton({ onClick }) {
  return (
    <div className="fixed right-4 bottom-4 z-50">
      <Button
        onClick={onClick}
        className="rounded-full h-14 w-14 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg flex items-center justify-center"
        aria-label="Add subscription"
      >
        <Plus className="h-6 w-6" />
      </Button>
    </div>
  );
}