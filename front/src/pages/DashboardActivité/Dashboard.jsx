// AlertPage.js
import React from 'react';
import AlertChart from '../../components/Chart/AlertChart';

const Dashboard = ({ data }) => {
  return (
    <div className="alert-page mt-20 ml-14 pl-14">
      <h1 className="text-2xl font-bold mb-4">Alert Chart</h1>
      <AlertChart data={data} />
    </div>
  );
};

export default Dashboard;
