import React from 'react';

interface DashboardProps {

}

const Dashboard: React.FC<DashboardProps> = () => {
  return (
    <div className={"w-full h-full flex flex-col justify-start items-start"}>
      {Array.from({length: 10}, (_, i) => (
        <p key={i}>{i}</p>
      ))}
    </div>
  );
};

export default Dashboard;
