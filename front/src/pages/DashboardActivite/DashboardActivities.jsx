import React from 'react';
import {
    Typography,
} from "@material-tailwind/react";
import { StatisticsCard } from "../../components/Widgets/Cards/StatisticsCard";
import { StatisticsChart } from "../../components/Widgets/Charts/StatiticsCharts";
import StatisticsCardsData from "../../components/Data/DashboardActivitiesData/StatisticsCardsData";
import StatisticsChartsData from "../../components/Data/DashboardActivitiesData/StatisticsChartsData";
import { ClockIcon } from "@heroicons/react/24/solid";
import {
Tabs,
TabsHeader,
TabsBody,
Tab,
TabPanel,
} from "@material-tailwind/react";


const DashboardActivities = () => {
    const [activeTab, setActiveTab] = React.useState("websiteview");
    return (
        <div className="ml-32 mt-24 mr-12 px-28">
          <div className="mb-12 grid gap-y-10 gap-x-6 md:grid-cols-2 xl:grid-cols-4">
            {StatisticsCardsData.map(({ icon, title, footer, ...rest }) => (
              <StatisticsCard
                key={title}
                {...rest}
                title={title}
                icon={React.createElement(icon, {
                  className: "w-6 h-6 text-white",
                })}
                footer={
                  <Typography className="font-normal text-blue-gray-600">
                    <strong className={footer.color}>{footer.value}</strong>
                    &nbsp;{footer.label}
                  </Typography>
                }
              />
            ))}
          </div>
          <div className="mb-6 grid grid-cols-1 gap-y-12 gap-x-6">
            <Tabs value={activeTab} orientation="vertical">
              <TabsHeader className="w-40">
              {StatisticsChartsData.map((props) => (
                  <Tab key={props.value} value={props.value} className="place-items-start justify-start">
                      <div className="flex items-center gap-2">
                      {React.createElement(props.icon, { className: "w-5 h-5" })}
                      {props.title}
                      </div>
                  </Tab>
                  ))}
              </TabsHeader>
              <TabsBody>
              {StatisticsChartsData.map((props) => (
                  <TabPanel key={props.value} value={props.value} className="py-0">
                      <StatisticsChart
                          key={props.title}
                          {...props}
                          footer={
                          <Typography
                              variant="small"
                              className="flex items-center font-normal text-blue-gray-600"
                          >
                              <ClockIcon strokeWidth={2} className="h-4 w-4 text-blue-gray-400" />
                              &nbsp;{props.footer}
                          </Typography>
                          }
                      />
                  </TabPanel>
                  ))}
              </TabsBody>
            </Tabs>
          </div>
        </div>
      );
}

export default DashboardActivities;