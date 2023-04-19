import React from 'react';
import { Tab } from '@headlessui/react';
import cx from 'classnames';
import { isNumber } from 'lodash';

export const Tabs = ({
  tabs,
  children,
  className,
  setTabIndex,
  tabIndex = 0,
}: {
  tabIndex?: number;
  className?: string;
  setTabIndex?: (index: number) => void;
  tabs: Array<{ title: string; icon?: (props: Record<string, unknown>) => JSX.Element }>;
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
      <Tab.List className="relative h-[32px] whitespace-nowrap">
        {tabs.map((tab, index) => (
          <Tab
            key={index}
            className={({ selected }: { selected: boolean }) => {
              return cx(
                'px-4 pb-3 relative outline-none font-medium',
                selected ? 'text-gomint-orange' : 'text-gomint-dark-blue',
                className
              );
            }}>
            <div className="flex items-center">
              {tab.icon ? tab.icon({ className: 'w-5 h-5 mr-2' }) : <div className="h-5"></div>}
              {tab.title}
            </div>

            {selectedIndex === index ? (
              <div className="absolute left-0 bottom-[3.5px] w-full h-1 bg-gomint-orange border-gomint-orange border-[1px] rounded -z-10" />
            ) : null}
          </Tab>
        ))}
        <div className="absolute left-0 w-full h-1 border-b bottom-[1px] -z-20" />
      </Tab.List>
      <Tab.Panels>
        {React.Children.map(children, (child) => (
          <Tab.Panel>{child}</Tab.Panel>
        ))}
      </Tab.Panels>
    </Tab.Group>
  );
};
