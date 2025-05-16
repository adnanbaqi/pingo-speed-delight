
import React from 'react';
import NetworkInfoItem from './NetworkInfoItem';

interface NetworkInfoColumnProps {
  items: {
    label: string;
    value: string;
    ariaLabel?: string;
  }[];
}

const NetworkInfoColumn: React.FC<NetworkInfoColumnProps> = ({ items }) => {
  return (
    <div className="space-y-2">
      {items.map((item, index) => (
        <NetworkInfoItem
          key={index}
          label={item.label}
          value={item.value}
          ariaLabel={item.ariaLabel}
        />
      ))}
    </div>
  );
};

export default NetworkInfoColumn;
