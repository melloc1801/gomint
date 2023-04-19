import Image from 'next/image';
import React from 'react';

export type Feature = {
  slogan: string;
  title: string;
  description: string;
  imgURL?: string;
  windowWidth?: number;
};
export const FeatureCard: React.FC<Feature> = ({
  slogan,
  title,
  description,
  imgURL,
  windowWidth,
}) => {
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (ref.current) {
      const height = ref.current.offsetWidth / 2;
      ref.current.style.height = `${height < 100 ? 1000 : height}px`;
    }
  }, [windowWidth]);

  return (
    <div className="h-full overflow-hidden bg-white rounded shadow-xl">
      <div
        className="relative "
        ref={ref}
        style={{
          background:
            'linear-gradient(180deg, #89ACFF 0%, #5A8CFF 0.01%, #4E83FF 23.96%, #437AF9 46.88%, #2563EB 70.31%, #0035B0 100%)',
        }}>
        <Image
          className="object-cover"
          quality={100}
          src={imgURL ? imgURL : '/assets/img/sharp.png'}
          alt={title}
          layout="fill"
        />
      </div>
      <div className="p-4 lg:p-7">
        <p className="mt-0 mb-3 font-semibold uppercase text-gomint-orange">{slogan}</p>
        <h3 className="mb-3 text-2xl font-semibold lg:mb-6 lg:text-4xl">{title}</h3>
        <p className="my-0">{description}</p>
      </div>
    </div>
  );
};
