import { AtSymbolIcon, CheckBadgeIcon, TicketIcon, UserIcon } from '@heroicons/react/24/solid';
import {
  DiscordIcon,
  EthereumIcon,
  LoadingButtonIcon,
  TwitterIcon,
} from '../../../public/assets/icons';
import Router, { useRouter } from 'next/router';

import { Button } from '../../../components/Button';
import { ButtonConnectSmall } from '../../../components/ButtonConnectSmall';
import { Formik } from 'formik';
import { PhaseType } from '../utils/phase.utils.types';
import { Requirement } from '../../../components/Requirement';
import { RequirementButton } from '../../../components/RequirementButton';
import { RequirementLink } from '../../../components/RequirementLink';
import { SelectField } from '../../../components/SelectField';
import { TWITTER_PREFIX_URL } from '../utils/phase.utils.constants';
import cx from 'classnames';
import { formatAddress } from '../utils/phase.utils.helpers';
import { getPhaseActivityStatus } from '../../project/utils/project.utils.helpers';
import { useDiscord } from '../../profile/hooks/profile.hook.discord';
import { useProfile } from '../../profile/hooks/profile.hook.me';
import { useRegistration } from '../hooks/phase.registration.hook';
import { useRegistrationTime } from '../../../hooks/useRegistrationTime';
import { useTwitter } from '../../profile/hooks/profile.hook.twitter';

type PhaseRequirementsProps = {
  phase: PhaseType;
};
export const PhaseRegistration: React.FC<PhaseRequirementsProps> = ({ phase }) => {
  const router = useRouter();
  const profile = useProfile();
  const discord = useDiscord();
  const twitter = useTwitter();

  const status = getPhaseActivityStatus(
    phase.registrationStart ? new Date(phase.registrationStart) : null,
    phase.registrationEnd ? new Date(phase.registrationEnd) : null
  );

  const registrationActive = status === 'active';

  const isDiscordAuthorized = profile.data?.discordAuthorized;
  const isTwitterAuthorized = profile.data?.twitterAuthorized;
  const registration = useRegistration(router.query.project as string, phase?.outerId, {
    checkStatusEnabled: registrationActive,
  });

  const registrationTime = useRegistrationTime(phase.registrationStart, phase.registrationEnd);

  if (phase) {
    return (
      <Formik
        enableReinitialize
        initialValues={{
          registrationAddress: profile.data?.address || '',
        }}
        onSubmit={({ registrationAddress }) => {
          registration.register.mutateAsync({
            id: phase.outerId,
            slug: router.query.project as string,
            registrationAddress,
          });
        }}>
        {({ handleSubmit }) => (
          <form id="registration" onSubmit={handleSubmit}>
            <div className="overflow-y-visible bg-white rounded-lg shadow-lg">
              <div
                className={cx('px-8 py-5 bg-gomint-blue rounded-t-lg', {
                  'bg-gomint-dark-grey': !registrationActive,
                })}>
                <div className="flex items-center justify-between">
                  <div className="grid pr-6 gap">
                    <span className="mb-1 text-xl font-bold text-white">{phase.name}</span>
                    <span className="text-sm text-white">{registrationTime.status}</span>
                  </div>
                  <div className="flex items-center text-white">
                    <TicketIcon className="w-7 h-7" />
                    <span className="pl-2 text-xl font-bold">{phase.numberOfWinners}</span>
                  </div>
                </div>
              </div>
              <div className="grid gap-6 p-8 pt-6">
                <div className="grid gap-5">
                  <div className="text-sm font-medium text-gomint-light-grey">
                    General requirements:
                  </div>
                  <Requirement title={{ text: 'Wallet', icon: UserIcon }} variant="common">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold">Have a wallet connected</span>
                      {!profile.isSuccess ? <ButtonConnectSmall>Connect</ButtonConnectSmall> : null}
                    </div>
                  </Requirement>

                  {phase.emailRequired ? (
                    <Requirement title={{ text: 'Email', icon: AtSymbolIcon }} variant="common">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold">Have a verified email address</span>
                        {!profile.data?.emailAuthorized && profile.isSuccess ? (
                          <RequirementButton
                            onclick={() => Router.push('/profile')}
                            variant="email">
                            verify
                          </RequirementButton>
                        ) : null}
                      </div>
                    </Requirement>
                  ) : null}

                  {phase.minEth ? (
                    <Requirement title={{ text: 'Funds', icon: EthereumIcon }} variant="common">
                      <div className="flex items-center">
                        <span className="text-sm font-semibold">
                          Have {phase.minEth} ETH in your wallet
                        </span>
                      </div>
                    </Requirement>
                  ) : null}
                </div>

                {phase.collections.length ? (
                  <div className="grid gap-5">
                    <div className="text-sm font-medium text-gomint-light-grey">
                      {phase.collections.length > 1
                        ? phase.collectionsUseType === 'ANY'
                          ? 'NFTs: Should have one of requirements met'
                          : 'NFTs: Should have all requirements met'
                        : 'NFTs requirement: '}
                    </div>
                    {phase.collections.map((collection, index) => {
                      const { collectionLink, collectionName, amount } = collection;
                      return (
                        <div key={index}>
                          <Requirement
                            title={{ text: `NFT #${index + 1}`, icon: CheckBadgeIcon }}
                            variant="collection">
                            <span className="text-sm font-semibold">
                              Have {amount}{' '}
                              <RequirementLink variant="collection" href={collectionLink}>
                                {collectionName}
                              </RequirementLink>
                            </span>
                          </Requirement>
                        </div>
                      );
                    })}
                  </div>
                ) : null}

                {phase.discordServers.length ? (
                  <div className="grid gap-5">
                    <div className="text-sm font-medium text-gomint-light-grey">
                      {phase.discordServers.length > 1
                        ? phase.discordServersUseType === 'ANY'
                          ? 'Discord: Should have one of requirements met'
                          : 'Discord: Should have all requirements met'
                        : 'Discord requirement: '}
                    </div>
                    {phase.discordServers.map((discordServer, index) => {
                      const { discordRoles, discordServerLink, discordServerName } = discordServer;
                      return (
                        <div key={index}>
                          <Requirement
                            title={{ text: `Discord #${index + 1}`, icon: DiscordIcon }}
                            variant="discord">
                            {discordRoles.length ? (
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-semibold">
                                  {discordServer.discordRoles.length > 1
                                    ? discordServer.discordRolesUseType === 'ANY'
                                      ? 'Have one of roles: '
                                      : 'Have all roles: '
                                    : 'Have '}
                                  {discordRoles.map((role, index) => (
                                    <span key={index}>
                                      <RequirementLink variant="discord" href={discordServerLink}>
                                        {role.roleName}
                                      </RequirementLink>
                                      {discordRoles.length !== index + 1 ? ', ' : null}
                                    </span>
                                  ))}
                                  {` on `}
                                  <RequirementLink variant="discord" href={discordServerLink}>
                                    {discordServerName}
                                  </RequirementLink>
                                </span>
                                {index === 0 && !isDiscordAuthorized && profile.isSuccess ? (
                                  <RequirementButton
                                    variant="discord"
                                    onclick={() => discord.connect.mutate()}>
                                    connect
                                  </RequirementButton>
                                ) : null}
                              </div>
                            ) : (
                              <div className="flex justify-between">
                                <span className="text-sm font-semibold">
                                  {'Be member of '}
                                  <span key={index}>
                                    <RequirementLink variant="discord" href={discordServerLink}>
                                      {discordServer.discordServerName}
                                    </RequirementLink>
                                  </span>
                                </span>
                                {index === 0 && !isDiscordAuthorized && profile.isSuccess ? (
                                  <RequirementButton
                                    variant="discord"
                                    onclick={() => discord.connect.mutate()}>
                                    connect
                                  </RequirementButton>
                                ) : null}
                              </div>
                            )}
                          </Requirement>
                        </div>
                      );
                    })}
                  </div>
                ) : null}

                {phase.twitterAccounts.length ? (
                  <div className="grid gap-5">
                    <div className="text-sm font-medium text-gomint-light-grey">
                      Twitter follow requirement:
                    </div>
                    <Requirement title={{ text: `Follow`, icon: TwitterIcon }} variant="twitter">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold">
                          {phase.twitterAccounts.length > 1
                            ? phase.twitterAccountsUseType === 'ANY'
                              ? 'Follow any: '
                              : 'Follow all: '
                            : 'Follow '}
                          {phase.twitterAccounts.map((twitterAccount, index) => (
                            <span key={index}>
                              <RequirementLink
                                variant="twitter"
                                href={TWITTER_PREFIX_URL + twitterAccount.account}>
                                {`@${twitterAccount.account}`}
                              </RequirementLink>
                              {phase.twitterAccounts.length !== index + 1 ? ', ' : null}
                            </span>
                          ))}
                        </span>
                        {!isTwitterAuthorized && profile.isSuccess ? (
                          <RequirementButton
                            variant="twitter"
                            onclick={() => twitter.connect.mutate()}>
                            connect
                          </RequirementButton>
                        ) : null}
                      </div>
                    </Requirement>
                  </div>
                ) : null}

                {phase.tweets.length ? (
                  <div className="grid gap-5">
                    <div className="text-sm font-medium text-gomint-light-grey">
                      {phase.tweets.length > 1
                        ? phase.tweetsUseType === 'ANY'
                          ? 'Tweet: Should have one of requirements met'
                          : 'Tweet: Should have all requirements met'
                        : 'Tweet requirement:'}
                    </div>
                    {phase.tweets.map((tweet, index) => {
                      const { like, retweet, tagAmount, link } = tweet;

                      const likeText = like ? 'like' : null;
                      const retweetText = retweet ? 'retweet' : null;
                      const tagAmountText = tagAmount ? `tag ${tagAmount} friends` : null;
                      const rawContent =
                        [likeText, retweetText, tagAmountText]
                          .filter((e) => Boolean(e))
                          .join(', ') + ' ';
                      const tweetContent = (
                        rawContent.charAt(0).toUpperCase() + rawContent.slice(1)
                      ).replace(/,*$/, '');

                      return (
                        <div key={index}>
                          <Requirement
                            title={{ text: `Tweet #${index + 1}`, icon: TwitterIcon }}
                            variant="twitter">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-semibold">
                                {tweetContent}
                                <RequirementLink variant="twitter" href={link}>
                                  this tweet
                                </RequirementLink>
                              </span>
                              {index === 0 &&
                              !isTwitterAuthorized &&
                              !phase.twitterAccounts.length &&
                              profile.isSuccess ? (
                                <RequirementButton
                                  variant="twitter"
                                  onclick={() => twitter.connect.mutate()}>
                                  connect
                                </RequirementButton>
                              ) : null}
                            </div>
                          </Requirement>
                        </div>
                      );
                    })}
                  </div>
                ) : null}

                {profile.data?.wallets.length ? (
                  <SelectField
                    name="registrationAddress"
                    options={[
                      {
                        label: `Account wallet - ${formatAddress(profile.data.address)}`,
                        value: profile.data.address,
                      },
                      ...profile.data.wallets.map((wallet) => ({
                        label: wallet.label
                          ? `${wallet.label} - ${formatAddress(wallet.address)}`
                          : formatAddress(wallet.address),
                        value: wallet.address,
                      })),
                    ]}
                  />
                ) : null}

                {profile.isSuccess && registration.status.data ? (
                  <Button
                    variant="neutral"
                    className="w-full font-bold text-center"
                    onClick={() => {
                      if (window.confirm('Are you sure you want to cancel the registration?')) {
                        registration.cancel.mutateAsync({
                          id: phase.outerId,
                          slug: router.query.project as string,
                        });
                      }
                    }}
                    disabled={registration.cancel.isLoading}>
                    Cancel registration
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    form="registration"
                    variant="success"
                    className="w-full !py-4 font-bold text-center"
                    disabled={
                      profile.isError || !registrationActive || registration.register.isLoading
                    }>
                    {registration.register.isLoading ? <LoadingButtonIcon /> : null}
                    Click to register
                  </Button>
                )}
              </div>
            </div>
          </form>
        )}
      </Formik>
    );
  }
  return null;
};
