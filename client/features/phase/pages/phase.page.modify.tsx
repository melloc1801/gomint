import * as React from 'react';

import { DocumentTextIcon, TicketIcon, UsersIcon } from '@heroicons/react/24/outline';
import { Field, Form, Formik, FormikProps } from 'formik';

import { Button } from '../../../components/Button';
import { CollectionsRequirement } from '../requirements/phase.requirement.collections';
import { Container } from '../../../components/Container';
import { DiscordRequirement } from '../requirements/phase.requirement.discord';
import { EthereumIcon } from '../../../public/assets/icons';
import { InputField } from '../../../components/InputField';
import { PhaseFieldRegistrationEnd } from '../fields/phase.field.registrationEnd';
import { PhaseFieldRegistrationStart } from '../fields/phase.field.registrationStart';
import { PhaseType } from '../utils/phase.utils.types';
import { PhaseValidationSchema } from '../utils/phase.utils.validation';
import { PremiumOverlay } from '../../../components/PremiumOverlay';
import { SelectField } from '../../../components/SelectField';
import { Toggle } from '../../../components/Toggle';
import { TweetsRequirement } from '../requirements/phase.requirement.tweets';
import { TwitterAccountsRequirement } from '../requirements/phase.requirement.twitterAccounts';
import { Typography } from '../../../components/Typography';
import { omit } from 'lodash';
import { revertFormatTimestamp } from '../../../lib/formatTimestamp';
import { usePhase } from '../hooks/phase.hook';
import { useProfile } from '../../profile/hooks/profile.hook.me';
import { useProject } from '../../project/hooks/project.hook';
import { useRouter } from 'next/router';
import { discordURLPrefix } from '../../project/utils/project.utils.constants';

const settingsInitialValues: Partial<PhaseType> = {
  name: '',
  type: 'LIMIT',

  minEth: '',
  mintPrice: '',
  mintsPerWinner: '',
  numberOfWinners: '',

  registrationEnd: '',
  registrationStart: '',

  emailRequired: false,
  collections: [],
  discordServers: [],
  twitterAccounts: [],
  tweets: [],
};

const dropPremiumFields = (values: Partial<PhaseType>): Partial<PhaseType> => {
  return omit(values, [
    'tweets',
    'collections',
    'tweetsUseType',
    'emailRequired',
    'discordServers',
    'twitterAccounts',
    'collectionsUseType',
    'discordServersUseType',
    'twitterAccountsUseType',
  ]);
};

export const ModifyPhasePage = ({
  settings,
  onUpdate,
}: {
  settings?: PhaseType;
  hasPremium?: boolean;
  onUpdate?: () => void;
}) => {
  useProfile({ redirectTo: '/' });

  let hasPremium = false;
  const router = useRouter();
  const { slug } = router.query;
  const phase = usePhase(router.query.slug as string);
  const project = useProject(slug as string);
  if (project.bySlug.isSuccess) {
    hasPremium =
      project.bySlug.data.premium &&
      (project.bySlug.data.isOwner || project.bySlug.data.isController);
  }
  const form = React.useRef<FormikProps<typeof settingsInitialValues>>(null);

  React.useEffect(() => {
    form.current?.validateForm();
  }, []);

  return (
    <Formik
      innerRef={form}
      enableReinitialize
      validationSchema={PhaseValidationSchema}
      initialValues={
        settings
          ? ({
              ...settings,
              registrationEnd: settings.registrationEnd
                ? revertFormatTimestamp(settings.registrationEnd)
                : null,
              registrationStart: settings.registrationStart
                ? revertFormatTimestamp(settings.registrationStart)
                : null,
              mintPrice: settings.mintPrice ? settings.mintPrice : '',
              mintsPerWinner: settings.mintsPerWinner ? settings.mintsPerWinner : '',
              numberOfWinners: settings.numberOfWinners ? settings.numberOfWinners : '',
              tweets: settings.tweets?.map((tweet) => ({
                ...tweet,
                tagAmount: tweet.tagAmount ? tweet.tagAmount : '',
              })),
              discordServers: settings.discordServers?.map((server) => ({
                ...server,
                discordServerLink: server.discordServerLink.replace(discordURLPrefix, ''),
              })),
            } as PhaseType)
          : settingsInitialValues
      }
      onSubmit={async (values) => {
        values.mintPrice = values.mintPrice ? values.mintPrice : null;
        values.mintsPerWinner = values.mintsPerWinner ? values.mintsPerWinner : null;
        values.numberOfWinners = values.numberOfWinners ? values.numberOfWinners : null;
        values.tweets = values.tweets?.map((tweet) => ({
          ...tweet,
          tagAmount: tweet.tagAmount ? tweet.tagAmount : null,
        }));

        const valuesBasedOnTier = hasPremium ? values : dropPremiumFields(values);
        settings
          ? phase.update.mutateAsync(valuesBasedOnTier).then(() => (onUpdate ? onUpdate() : null))
          : phase.create.mutateAsync(valuesBasedOnTier);
      }}>
      {({ values, setFieldValue }) => (
        <Form id="phase" autoComplete="off">
          <Container className="mb-12">
            <Typography className="mb-4" variant="h2">
              General information
            </Typography>
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-12 md:col-span-6">
                <InputField
                  required
                  type="text"
                  name="name"
                  title="Title"
                  icon={DocumentTextIcon}
                  placeholder="Enter title"
                />
              </div>
              <div className="col-span-12 md:col-span-6">
                <SelectField
                  title="Type"
                  name="type"
                  options={[
                    { label: 'FCFS (guaranteed)', value: 'LIMIT' },
                    { label: 'Raffle', value: 'RAFFLE' },
                  ]}
                />
              </div>
            </div>
          </Container>

          <Container className="mb-12">
            <Typography className="mb-4" variant="h2">
              Mint details
            </Typography>
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-12 md:col-span-6">
                <InputField
                  required
                  type="number"
                  icon={UsersIcon}
                  name="numberOfWinners"
                  title="Number of access list winners"
                  placeholder="Enter number of winners"
                />
              </div>
              <div className="col-span-12 md:col-span-6">
                <InputField
                  type="number"
                  icon={TicketIcon}
                  name="mintsPerWinner"
                  title="Max mints per winner"
                  placeholder="Enter mints per winner"
                />
              </div>
              <div className="col-span-12 md:col-span-6">
                <InputField
                  type="number"
                  name="mintPrice"
                  icon={EthereumIcon}
                  title="Price per NFT"
                  inputProps={{ step: 0.000001 }}
                  placeholder="Enter price per NFT"
                />
              </div>
            </div>
          </Container>

          <Container className="mb-12">
            <Typography className="mb-4" variant="h2">
              Registration Date & Time
            </Typography>
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-12 md:col-span-6">
                <PhaseFieldRegistrationStart />
              </div>
              <div className="col-span-12 md:col-span-6">
                <PhaseFieldRegistrationEnd />
              </div>
            </div>
          </Container>

          <Container className="mb-12">
            <Typography className="mb-4" variant="h2">
              Email address requirement
            </Typography>

            <Typography className="mb-8">
              The registrant must provide and verify their e-mail address.
            </Typography>

            <Field
              name="emailRequired"
              component={() => (
                <PremiumOverlay disabled={hasPremium}>
                  <Toggle
                    variant="success"
                    enabled={values.emailRequired}
                    onClick={() => setFieldValue('emailRequired', !values.emailRequired)}
                  />
                </PremiumOverlay>
              )}
            />
          </Container>

          <Container className="mb-12">
            <Typography className="mb-4" variant="h2">
              Wallet requirement
            </Typography>

            <Typography className="mb-8">
              The registrant must have a minimum wallet balance.
            </Typography>
            <PremiumOverlay disabled={hasPremium}>
              <InputField
                name="minEth"
                type="number"
                icon={EthereumIcon}
                title="Minimum wallet balance (ETH)"
                placeholder="Enter minimum balance"
              />
            </PremiumOverlay>
          </Container>

          <div className="mb-12">
            <CollectionsRequirement hasPremium={hasPremium} />
          </div>

          <div className="mb-12">
            <TwitterAccountsRequirement hasPremium={hasPremium} />
          </div>

          <div className="mb-12">
            <DiscordRequirement hasPremium={hasPremium} />
          </div>

          <div>
            <TweetsRequirement hasPremium={hasPremium} />
          </div>

          <div className="flex flex-col-reverse mt-10 md:block">
            <Button
              variant="neutral"
              className="w-full my-2 md:w-auto"
              href={`/projects/${router.query.slug}/dashboard`}>
              Cancel
            </Button>
            <Button type="submit" form="phase" className="w-full my-2 md:w-auto md:ml-3">
              {settings ? 'Update access list' : 'Create access list'}
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
};
