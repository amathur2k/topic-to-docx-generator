
import React from "react";

interface LoadingIndicatorProps {
  message?: string;
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ 
  message = "Generating your content..." 
}) => {
  return (
    <div className="w-full flex flex-col items-center justify-center py-16 space-y-6 fade-in">
      <div className="relative w-24 h-24">
        <div className="absolute inset-0 rounded-full border-t-4 border-primary/30 animate-spin"></div>
        <div className="absolute inset-2 rounded-full border-l-4 border-primary/40 animate-spin" style={{ animationDuration: '1.5s' }}></div>
        <div className="absolute inset-4 rounded-full border-b-4 border-primary/50 animate-spin" style={{ animationDuration: '2s' }}></div>
        <div className="absolute inset-6 rounded-full border-r-4 border-primary/60 animate-spin" style={{ animationDuration: '2.5s' }}></div>
      </div>
      
      <div className="text-center space-y-2">
        <p className="font-medium text-xl">{message}</p>
        <p className="text-muted-foreground text-sm">This may take a moment...</p>
      </div>
      
      <div className="w-64 h-1.5 bg-secondary rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-primary/40 via-primary to-primary/40 animate-shimmer bg-[length:200%_100%]"></div>
      </div>
    </div>
  );
};

export default LoadingIndicator;
