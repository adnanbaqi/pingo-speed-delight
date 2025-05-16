
import React from 'react';

interface NetworkInfoItemProps {
  label: string;
  value: string;
  ariaLabel?: string;
}

const NetworkInfoItem: React.FC<NetworkInfoItemProps> = ({ 
  label, 
  value,
  ariaLabel
}) => {
  return (
    <div className="space-y-1">
      <h3 className="text-sm font-medium text-muted-foreground">
        {label}
      </h3>
      <p aria-label={ariaLabel || label}>{value}</p>
    </div>
  );
};

export default NetworkInfoItem;
