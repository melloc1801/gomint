import React from 'react';
import { Tab } from '@headlessui/react';
import cx from 'classnames';
import { isNumber } from 'lodash';

export const PagesTabs = ({
  tabs,
  children,
  setTabIndex,
  tabIndex = 0,
}: {
  tabIndex?: number;
  className?: string;
  setTabIndex?: (index: number) => void;
  tabs: string[];
  children: JSX.Element[];
}) => {
  const [selectedIndex, setSelectedIndex] = React.useState(tabIndex);

  React.useEffect(() => {
    if (isNumber(tabIndex)) {
      setSelectedIndex(tabIndex);
    }
  }, [tabIndex]);

  return (
    <Tab.Group selectedIndex={selectedIndex} onChange={setTabIndex || setSelectedIndex}>
      <Tab.List className="whitespace-nowrap overflow-auto hide-scrollbar">
        {tabs.map((tab, index) => (
          <Tab
            key={index}
            className={({ selected }: { selected: boolean }) => {
              return cx(
                'text-xl font-bold no-underline hover:underline pr-6 outline-none',
                selected ? 'text-blue-1000 hover:no-underline' : 'text-slate-400'
              );
            }}>
            <div className="outline-none">{tab}</div>
          </Tab>
        ))}
      </Tab.List>
      <Tab.Panels>
        {React.Children.map(children, (child) => (
          <Tab.Panel>{child}</Tab.Panel>
        ))}
      </Tab.Panels>
    </Tab.Group>
  );
};
