import { Column, Order } from '../../phase/utils/phase.utils.types';
import { Field, FieldProps, Formik } from 'formik';
import { BoltIcon, LinkIcon, PlusIcon, StarIcon, UserIcon } from '@heroicons/react/24/solid';
import { useParticipant, useParticipants } from '../../phase/hooks/phase.participants.hook';

import { AddParticipantsValidationSchema } from '../../phase/utils/phase.utils.validation';
import { Button } from '../../../components/Button';
import { Circle } from '../../../components/Circle';
import { ModifyPhasePage } from '../../phase/pages/phase.page.modify';
import { ParticipantTable } from '../../phase/components/phase.component.table';
import { PhaseItem } from '../../phase/components/phase.component.item';
import React from 'react';
import { Tabs } from '../../../components/Tabs';
import { Textarea } from '../../../components/Textarea';
import { Typography } from '../../../components/Typography';
import { isNumber } from 'lodash';
import { useProfile } from '../../profile/hooks/profile.hook.me';
import { useProject } from '../hooks/project.hook';
import { useRegistration } from '../../phase/hooks/phase.registration.hook';
import { useRegistrationTime } from '../../../hooks/useRegistrationTime';
import { useRouter } from 'next/router';

type TableState = {
  page: number;
  order: Order;
  column: Column;
};

const initTableState: TableState = {
  page: 0,
  order: 'desc',
  column: 'createdAt',
};

export const ProjectDashboard = () => {
  useProfile({ redirectTo: '/' });

  const router = useRouter();
  const { slug, phaseId } = router.query as { slug: string; phaseId: string };
  const project = useProject(slug);
  const registration = useRegistration(slug);
  const [tabIndex, setTabIndex] = React.useState(phaseId && Number(phaseId) >= 0 ? 1 : 0);

  const [phaseURI, setPhaseURI] = React.useState('');
  const [selectedPhaseId, selectPhaseId] = React.useState<number>();

  const { add, update, del } = useParticipant(slug as string, selectedPhaseId);

  const [table, setTable] = React.useState<TableState>(initTableState);
  const setPage = (page: number) => setTable((state) => ({ ...state, page }));
  const sort = (params: { order: Order; column: Column }) =>
    setTable((state) => ({
      ...state,
      order: params.order,
      column: params.column,
    }));

  const participants = useParticipants({
    page: table.page,
    order: table.order,
    id: selectedPhaseId,
    column: table.column,
    slug: slug as string,
  });

  React.useEffect(() => {
    if (selectedPhaseId) setPage(0);
  }, [selectedPhaseId]);

  React.useEffect(() => {
    if (phaseId) {
      selectPhaseId(Number(phaseId) >= 0 ? Number(phaseId) : 0);
    }
  }, [phaseId]);

  const [firstAccessList] = project.bySlug.data ? project.bySlug.data.phases : [];
  React.useEffect(() => {
    if (project.bySlug.isSuccess && !phaseId) {
      if (firstAccessList) selectPhaseId(firstAccessList.outerId);
    }
  }, [firstAccessList, project.bySlug.isSuccess, project.bySlug.data?.phases.length, phaseId]);

  const activePhase = project.bySlug.data?.phases.find(
    (phase) => phase.outerId === selectedPhaseId
  );

  React.useEffect(() => {
    if (typeof window !== 'undefined' && activePhase) {
      setPhaseURI(`${window.location.origin}/${slug}?list=${activePhase.name}`);
    }
  }, [activePhase, slug]);

  const dateInfo = useRegistrationTime(
    activePhase?.registrationStart,
    activePhase?.registrationEnd
  );

  if (project.bySlug.isError) {
    return <div className="px-8 pt-16">Error when fetching project data</div>;
  }

  if (project.bySlug.isSuccess) {
    const phases = project.bySlug.data.phases;

    return (
      <div className="px-8 pt-16 pb-20">
        <div className="grid gap-10 lg:grid-cols-sidebar">
          <div className="rounded shadow">
            <div className="px-8 py-6 pr-5 rounded-t bg-gomint-blue">
              <h2 className="text-xl font-medium text-white">Your access lists</h2>
            </div>
            {phases.map((phase) => (
              <PhaseItem
                phase={phase}
                key={phase.outerId}
                onClick={() => selectPhaseId(phase.outerId)}
                active={isNumber(selectedPhaseId) ? phase.outerId === selectedPhaseId : false}
              />
            ))}
            <div className="px-8 py-10">
              <Button
                icon={PlusIcon}
                variant="neutral"
                className="w-full"
                href={`/projects/${router.query.slug as string}/lists/create`}>
                Add access list
              </Button>
            </div>
          </div>
          {phases.length ? (
            <div className="max-w-full overflow-hidden">
              <div className="block xl:flex xl:justify-between xl:items-start">
                <div className="xl:mr-6">
                  <div className="flex items-center pl-1 mb-4">
                    <Circle active={dateInfo.isActive} className="!w-3.5 !h-3.5 mt-0.5" />
                    <Typography className="ml-1" variant="h1">
                      {activePhase?.name}
                    </Typography>
                  </div>
                  <div className="flex items-center mb-8">
                    <LinkIcon className="w-5 h-5 mr-3 text-slate-400" />
                    <a target="_blank" rel="noreferrer" href={phaseURI}>
                      {phaseURI}
                    </a>
                  </div>
                </div>
                <div className="shrink-0">
                  {dateInfo.isActive ? (
                    <Button
                      variant="danger"
                      className="w-full mb-8 xl:mb-0"
                      onClick={() => registration.stop.mutateAsync(selectedPhaseId)}>
                      Stop registration
                    </Button>
                  ) : null}
                  {!dateInfo.isActive && !activePhase?.registrationStart ? (
                    <Button
                      variant="success"
                      className="w-full mb-8 xl:mb-0"
                      onClick={() => registration.start.mutateAsync(selectedPhaseId)}>
                      Start registration
                    </Button>
                  ) : null}
                  {activePhase?.registrationEnd &&
                  new Date(activePhase?.registrationEnd) < new Date() ? (
                    <Button
                      icon={BoltIcon}
                      className="w-full mb-8 xl:mb-0"
                      onClick={() => {
                        if (window.confirm('Are you sure you want to draw winners?')) {
                          registration.draw.mutateAsync(selectedPhaseId).then(() => setPage(0));
                        }
                      }}>
                      Draw winners
                    </Button>
                  ) : null}
                </div>
              </div>
              <Tabs
                tabIndex={tabIndex}
                setTabIndex={(index) => setTabIndex(index)}
                tabs={[{ title: 'Dashboard' }, { title: 'Settings' }]}>
                <div className="mt-8">
                  <div className="mb-8">
                    <Button
                      icon={StarIcon}
                      variant="secondary"
                      className="w-full mb-4 mr-0 lg:w-auto lg:mb-0 lg:mr-4"
                      onClick={() =>
                        registration.downloadWinners.mutateAsync({
                          id: selectedPhaseId,
                          name: activePhase?.name,
                        })
                      }>
                      Download winners
                    </Button>
                    <Button
                      icon={UserIcon}
                      className="w-full lg:w-auto"
                      onClick={() =>
                        registration.downloadParticipants.mutateAsync({
                          id: selectedPhaseId,
                          name: activePhase?.name,
                        })
                      }>
                      Download participants
                    </Button>
                  </div>
                  <Typography className="mb-6 text-3xl" variant="h2">
                    Participants
                  </Typography>
                  <ParticipantTable
                    order={table.order}
                    onChangeSort={sort}
                    currentPage={table.page}
                    sortingColumn={table.column}
                    onPrevPageClick={table.page > 0 ? () => setPage(--table.page) : undefined}
                    onNextPageClick={
                      participants.data?.nextCursor ? () => setPage(++table.page) : undefined
                    }
                    participants={participants.data?.participants}
                    hasNextPage={Boolean(participants.data?.nextCursor)}
                    onWinnerClick={({ address, value }) =>
                      update.mutateAsync({ address, winner: value, page: table.page })
                    }
                    onDeleteRowClick={(address) => {
                      if (window.confirm('Are you sure you want to delete the participant?')) {
                        del.mutateAsync({ address, page: table.page });
                      }
                    }}
                  />

                  <Typography className="mt-8 mb-4" variant="h3">
                    Add participants manually
                  </Typography>

                  <Typography className="mb-8">
                    Add wallets addresses separated by a comma
                  </Typography>
                  <Formik
                    initialValues={{ participants: '' }}
                    validationSchema={AddParticipantsValidationSchema}
                    onSubmit={async (values, actions) => {
                      const rawAddresses = values.participants.split(',');
                      const addresses = rawAddresses.map((address) => address.trim());

                      if (!addresses.length) return;

                      const result = await add.mutateAsync(addresses);
                      if (result.addresses) {
                        setPage(0);
                        actions.setValues((prev) => ({
                          ...prev,
                          participants: result.addresses.join(', '),
                        }));
                        return;
                      }
                      setPage(0);
                      actions.resetForm();
                    }}>
                    {(props) => (
                      <form onSubmit={props.handleSubmit} id="participants-manuall">
                        <Field name="participants">
                          {({ field, meta }: FieldProps) => {
                            let error: string | undefined;
                            if (meta.error && meta.touched) {
                              error = meta.error;
                            }

                            return (
                              <Textarea
                                error={error}
                                className="mb-4"
                                placeholder="0x04b...c6bf, 0x05c...c2bv"
                                {...field}
                              />
                            );
                          }}
                        </Field>
                        <Button type="submit" variant="primary">
                          Save participants
                        </Button>
                      </form>
                    )}
                  </Formik>
                </div>
                <div className="mt-8">
                  <ModifyPhasePage settings={activePhase} onUpdate={() => setTabIndex(0)} />
                </div>
              </Tabs>
            </div>
          ) : (
            <div>Create your first access list</div>
          )}
        </div>
      </div>
    );
  }

  return null;
};
