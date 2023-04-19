import * as React from 'react';

import { DiscordIcon, GlobalIcon, TwitterIcon } from '../../../public/assets/icons';
import { PencilIcon, PencilSquareIcon, PlusCircleIcon } from '@heroicons/react/24/solid';

import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { PhaseRegistration } from '../../phase/components/phase.component.registration';
import { ReadonlyEditor } from '../../../components/Editor/ReadonlyEditor';
import { ReportPage } from '../../report/pages/report.page.index';
import { Typography } from '../../../components/Typography';
import cx from 'classnames';
import { isNumber } from 'lodash';
import set from 'lodash/set';
import { sortPhases } from '../../phase/utils/phase.utils.helpers';
import { useProject } from '../hooks/project.hook';
import { useRouter } from 'next/router';
import { useWindowSize } from '../../../hooks/useWindowSize';

export const ProjectPage = () => {
  const [showAllPhases, setShowAllPhases] = React.useState(false);
  const phaseComponent = React.useRef<HTMLDivElement>(null);

  const router = useRouter();
  const size = useWindowSize();
  const ref = React.useRef<HTMLDivElement>(null);
  const project = useProject(
    router.query.project as string,
    { isExternal: true },
    router.query.list as string
  );

  React.useEffect(() => {
    if (ref.current) {
      const height = ref.current.offsetWidth / 3;
      ref.current.style.height = `${height < 250 ? 250 : height}px`;
    }
  }, [project.bySlug.isSuccess, size.width]);

  React.useEffect(() => {
    if (project.bySlug.isError) {
      router.push('/404');
    }
  }, [project.bySlug.isError, router]);

  if (project.bySlug.isSuccess) {
    const { data } = project.bySlug;
    const headerBackgroundStyles = {};

    const phaseData = data.phases.find((phase) => phase.name === router.query.list);

    if (data.headerColor) {
      set(headerBackgroundStyles, 'backgroundColor', data.headerColor);
    }

    if (!data.headerColor && !data.headerURL) {
      set(headerBackgroundStyles, 'backgroundColor', '#f1f5f9');
    }

    const descriptionSchema = JSON.parse(data.description) || [];
    const descriptionParagraphNode = descriptionSchema.find((node: Record<string, unknown>) => {
      const [firstParagraph] = (node?.children as Array<{ bold: boolean }>) || [];
      return node?.type === 'paragraph' && !firstParagraph.bold;
    });

    const [firstParagraph] = descriptionParagraphNode?.children || [];
    const metaContent = firstParagraph ? firstParagraph.text : '';

    const hasSocialLinks = data.twitterURL || data.discordURL || data.websiteURL;

    const sortedPhases = sortPhases(data.phases);

    const socialLinks = (
      <>
        {data.twitterURL ? (
          <a target="_blank" rel="noreferrer" href={data.twitterURL}>
            <TwitterIcon className="w-5 mx-3 text-blue-1000" />
          </a>
        ) : null}
        {data.discordURL ? (
          <a target="_blank" rel="noreferrer" href={data.discordURL}>
            <DiscordIcon className="w-5 mx-3 text-blue-1000" />
          </a>
        ) : null}
        {data.websiteURL ? (
          <a target="_blank" rel="noreferrer" href={data.websiteURL}>
            <GlobalIcon className="w-[17px] mx-3 text-blue-1000" />
          </a>
        ) : null}
      </>
    );

    const head = (
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="description" content={metaContent} />
        <title>{project.bySlug.data.name} — Powered by GOMINT</title>

        <meta property="og:description" content={metaContent} />
        <meta property="og:title" content={project.bySlug.data.name} />
        <meta property="og:image" content={project.bySlug.data.pfpURL} />
      </Head>
    );

    const header = (
      <div
        ref={ref}
        style={headerBackgroundStyles}
        className="relative flex justify-center bg-slate-100 sm:rounded-lg">
        {data.headerURL ? (
          <Image
            layout="fill"
            alt={data.name}
            src={data.headerURL}
            className="object-cover sm:rounded-lg"
          />
        ) : null}
        {data.pfpURL ? (
          <div
            className="absolute bg-white bg-center bg-cover border-4 border-white rounded-full shadow-lg w-28 h-28 -bottom-14 xl:h-32 xl:w-32 lg:left-10"
            style={{ backgroundImage: data.pfpURL ? `url('${data.pfpURL}')` : 'none' }}
          />
        ) : (
          <div
            className="absolute border-4 border-white rounded-full bg-slate-100 w-28 h-28 -bottom-14 xl:h-32 xl:w-32 lg:left-10"
            style={{ backgroundImage: data.pfpURL ? `url('${data.pfpURL}')` : 'none' }}
          />
        )}
      </div>
    );

    const content = descriptionSchema ? <ReadonlyEditor value={descriptionSchema} /> : null;

    const poweredBy = (
      <Link passHref href="/">
        <a target="_blank" className="py-4 text-sm text-right no-underline text-slate-400">
          Powered by <span className="font-black">GOMINT</span>
        </a>
      </Link>
    );

    const nameMobile = (
      <Typography
        variant="h1"
        className={cx(
          'mt-20 px-10 text-center leading-tight lg:hidden',
          hasSocialLinks ? 'mb-6' : 'mb-8'
        )}>
        {data.name}
      </Typography>
    );

    const nameDesktop = (
      <Typography variant="h1" className="hidden my-6 mt-10 leading-tight lg:block">
        {data.name}
      </Typography>
    );

    const settings = ({ phaseId, hasManyPhases }: { phaseId?: number; hasManyPhases?: boolean }) =>
      data.isOwner || data.isController ? (
        <div className="fixed flex justify-center w-full px-8 bottom-4">
          <div className="flex px-5 py-4 overflow-x-auto text-xs text-white rounded-full shadow-lg bg-slate-800 whitespace-nowrap">
            <div
              className="flex items-center pr-3 cursor-pointer hover:underline"
              onClick={() =>
                router.push(
                  isNumber(phaseId)
                    ? `/projects/${data.slug}/dashboard?phaseId=${phaseId}`
                    : `/projects/${data.slug}/dashboard`
                )
              }>
              {isNumber(phaseId) && !hasManyPhases ? <PencilSquareIcon width={16} /> : null}
              {!isNumber(phaseId) && hasManyPhases ? <PencilSquareIcon width={16} /> : null}
              {!isNumber(phaseId) && !hasManyPhases ? <PlusCircleIcon width={16} /> : null}

              <span className="pl-2">
                {isNumber(phaseId) && !hasManyPhases ? 'Edit access list' : null}
                {!isNumber(phaseId) && hasManyPhases ? 'Edit access lists' : null}
                {!isNumber(phaseId) && !hasManyPhases ? 'Create access list' : null}
              </span>
            </div>
            <span className="text-slate-600">|</span>
            <div
              className="flex items-center pl-3 cursor-pointer hover:underline"
              onClick={() => router.push(`/projects/${data.slug}/update`)}>
              <PencilIcon width={16} />
              <span className="pl-2">Edit project</span>
            </div>
          </div>
        </div>
      ) : null;

    if (phaseData) {
      return (
        <>
          {head}
          <div className="absolute w-full min-h-full bg-opacity-50 pb-20 sm:p-12 bg-slate-50">
            <div className="container mx-auto sm:rounded-xl sm:p-0">
              {header}
              {nameMobile}
              {hasSocialLinks ? (
                <div className="flex justify-center mb-8 lg:hidden">{socialLinks}</div>
              ) : null}
              <div className="flex flex-col-reverse h-full mx-auto lg:flex-row">
                <div className="relative p-10 pt-0 md:pr-32 lg:pt-10 basis-3/5">
                  {nameDesktop}
                  {hasSocialLinks ? (
                    <div className="absolute hidden mb-6 top-6 right-8 lg:flex">{socialLinks}</div>
                  ) : null}
                  {content}
                  <div className="mt-6">
                    <ReportPage slug={router.query.project as string} />
                  </div>
                </div>
                <div className="lg:pr-10 lg:basis-2/5">
                  <div
                    ref={phaseComponent}
                    className="px-10 mt-2 lg:px-0 lg:-translate-y-32 xl:-translate-y-20">
                    {phaseData ? <PhaseRegistration phase={phaseData} /> : null}
                    <div className="flex justify-center mt-2 lg:justify-end">{poweredBy}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {settings({ phaseId: phaseData.outerId, hasManyPhases: false })}
        </>
      );
    }

    if (!project.bySlug.data?.phases.length) {
      return (
        <>
          {head}
          <div className="absolute w-full min-h-full bg-opacity-50 pb-20 sm:p-12 bg-slate-50">
            <div className="container mx-auto sm:rounded-xl sm:p-0">
              {header}
              {nameMobile}
              {hasSocialLinks ? (
                <div className="flex justify-center mb-4 lg:hidden">{socialLinks}</div>
              ) : null}
              <div className="flex flex-col-reverse h-full mx-auto lg:flex-row">
                <div className="relative w-full p-10 pt-0 lg:pt-10">
                  {nameDesktop}
                  {hasSocialLinks ? (
                    <div className="absolute hidden mb-6 top-6 right-8 lg:flex">{socialLinks}</div>
                  ) : null}
                  {content}
                  <div className="flex justify-between">
                    <ReportPage slug={router.query.project as string} />
                    {poweredBy}
                  </div>
                </div>
              </div>
            </div>
          </div>
          {settings({})}
        </>
      );
    }

    return (
      <>
        {head}
        <div className="absolute w-full min-h-full bg-opacity-50 pb-20 sm:p-12 bg-slate-50">
          <div className="container mx-auto sm:rounded-xl sm:p-0">
            {header}
            {nameMobile}
            {hasSocialLinks ? (
              <div className="flex justify-center mb-8 lg:hidden">{socialLinks}</div>
            ) : null}
            <div className="flex flex-col-reverse h-full mx-auto lg:flex-row">
              <div className="relative p-10 pt-0 md:pr-32 lg:pt-10 basis-3/5">
                {nameDesktop}
                {hasSocialLinks ? (
                  <div className="absolute hidden mb-6 top-6 right-8 lg:flex">{socialLinks}</div>
                ) : null}
                {content}
                <div className="mt-6">
                  <ReportPage slug={router.query.project as string} />
                </div>
              </div>
              <div className="lg:pr-10 lg:basis-2/5">
                <div
                  ref={phaseComponent}
                  className="px-10 mt-2 lg:px-0 lg:-translate-y-32 xl:-translate-y-20">
                  <PhaseRegistration phase={sortedPhases[0]} />
                  <div className="flex items-center justify-between mt-2">
                    {sortedPhases.length > 1 ? (
                      <div className="text-sm text-center underline cursor-pointer hover:no-underline text-slate-400">
                        {showAllPhases ? (
                          <div onClick={() => setShowAllPhases(false)}>Hide access lists</div>
                        ) : (
                          <div onClick={() => setShowAllPhases(true)}>Show all access lists</div>
                        )}
                      </div>
                    ) : null}
                    {poweredBy}
                  </div>
                  {showAllPhases
                    ? sortedPhases.slice(1).map((phase) => (
                        <div key={phase.outerId} className="my-10">
                          <PhaseRegistration phase={phase} />
                        </div>
                      ))
                    : null}
                </div>
              </div>
            </div>
          </div>
        </div>
        {settings({ hasManyPhases: true })}
      </>
    );
  }

  return null;
};
