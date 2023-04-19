import { Feature, FeatureCard } from './FeatureCard';

import React from 'react';
import cx from 'classnames';

const FEATURES: Feature[] = [
  {
    slogan: "It's the Access list Fizz That Does The Bizz",
    title: 'Create Access Lists',
    description:
      'Start building your community by giving away precious access list spots. Manage big amounts of data easily.',
  },
  {
    slogan: 'Smart contracts created by everyone',
    title: 'Generate Smart Contract',
    description:
      'A no-code solution to integrate your access list winners into your smart contract with just one click.',
  },
  {
    slogan: 'The future of minting',
    title: 'Minting Button & Website',
    description:
      'Install the minting button to your website or simply use your profile page on gomint.art to mint your NFTs.',
  },
  {
    slogan: 'you upload the traits, we do the rest',
    title: 'Generate your NFT assets',
    description:
      'Upload your traits to then generate your NFT collection. Save a ton of work with this easy to use tool.',
  },
];

type FeaturesProps = {
  windowWidth?: number;
};

export const Features: React.FC<FeaturesProps> = ({ windowWidth }) => {
  return (
    <div className="grid grid-cols-2 gap-x-7 gap-y-10 sm:pb-10">
      {FEATURES.map(({ slogan, title, description, imgURL }, index) => (
        <div
          className={cx(
            { 'sm:translate-y-10': (index + 1) % 2 === 0 },
            'col-span-full sm:col-span-1'
          )}
          key={slogan + title + description}>
          <FeatureCard
            slogan={slogan}
            title={title}
            description={description}
            imgURL={imgURL}
            windowWidth={windowWidth}
          />
        </div>
      ))}
    </div>
  );
};
