import { Suspense } from 'react';
import FlightsClient from './flights-client';

export default function FlightsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-xl text-gray-500">Loading flights...</div>
      </div>
    }>
      <FlightsClient />
    </Suspense>
  );
}
