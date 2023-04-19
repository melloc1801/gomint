import { AtSymbolIcon, UserIcon } from '@heroicons/react/24/solid';
import { Field, FieldProps, Formik } from 'formik';

import { Button } from '../../../components/Button';
import Image from 'next/image';
import { Input } from '../../../components/Input';
import { InputField } from '../../../components/InputField';
import { Label } from '../../../components/Label';
import { PageTitle } from '../../../components/PageTitle';
import { ProfileWallet } from '../components/profile.component.wallet';
import { SUCCESS_MESSAGES } from '../../../lib/handleSuccess';
import { SectionTitle } from '../../../components/SectionTitle';
import { Toggle } from '../../../components/Toggle';
import { profileValidation } from '../utils/profile.utils.validation';
import toast from 'react-hot-toast';
import { useDiscord } from '../hooks/profile.hook.discord';
import { useProfile } from '../hooks/profile.hook.me';
import { useState } from 'react';
import { useTwitter } from '../hooks/profile.hook.twitter';
import { useUser } from '../hooks/profile.hook.user';

export default function Profile() {
  const [resendActive, setResendActive] = useState(true);

  const user = useUser();
  const discord = useDiscord();
  const twitter = useTwitter();
  const profile = useProfile({ redirectTo: '/' });

  const isDiscordAuthorized = profile.data?.discordAuthorized;
  const isTwitterAuthorized = profile.data?.twitterAuthorized;

  const initialEmailValue = profile.data?.email || '';
  const initialUsernameValue = profile.data?.username || '';

  return (
    <>
      <div className="container px-8 mx-auto mb-8 pt-14">
        <PageTitle>Profile</PageTitle>
      </div>
      <div className="container grid gap-8 px-8 pb-12 mx-auto md:gap-x-6 lg:gap-x-24 md:grid-cols-2">
        <Formik
          enableReinitialize
          validationSchema={profileValidation}
          initialValues={{ email: initialEmailValue, username: initialUsernameValue }}
          onSubmit={(values) => {
            const emailChanged = initialEmailValue !== values.email;
            const usernameChanged = initialUsernameValue !== values.username;

            user.update
              .mutateAsync({
                email: emailChanged ? values.email : undefined,
                username: usernameChanged ? values.username : undefined,
              })
              .then(() => {
                toast.success(
                  values.email
                    ? SUCCESS_MESSAGES.USER_UPDATED_VERIFICATION_EMAIL_SENT
                    : SUCCESS_MESSAGES.USER_UPDATED
                );
              });
          }}>
          {(props) => (
            <div className="container">
              <div>
                <div className="mb-8">
                  <Label title="Access type">
                    {profile.data?.premium ? (
                      <span className="px-2 py-1 text-white rounded bg-gomint-orange">Premium</span>
                    ) : (
                      <span className="px-2 py-1 text-white rounded bg-gomint-blue">Basic</span>
                    )}
                  </Label>
                </div>
                <form id="profile-form" className="mt-5 mb-10" onSubmit={props.handleSubmit}>
                  <InputField
                    type="text"
                    name="username"
                    icon={UserIcon}
                    title="Username"
                    placeholder="Enter username"
                  />
                  <Label
                    title="Email"
                    subtitle={
                      !profile.data?.emailAuthorized ? (
                        profile.data?.email ? (
                          <span>
                            Your email is not verified.{' '}
                            {!resendActive ? null : (
                              <span
                                onClick={() => {
                                  setResendActive(false);
                                  user.update
                                    .mutateAsync({ email: profile.data?.email })
                                    .then(() =>
                                      toast.success(SUCCESS_MESSAGES.EMAIL_VERIFICATION_SENT)
                                    );
                                }}
                                className="inline-block text-blue-500 underline cursor-pointer hover:no-underline">
                                Re-send verification email
                              </span>
                            )}
                          </span>
                        ) : null
                      ) : null
                    }>
                    <Field name="email">
                      {({ field, meta }: FieldProps) => {
                        let error: string | undefined;

                        if (meta.error && meta.touched) {
                          error = meta.error;
                        }

                        return (
                          <Input
                            type="email"
                            error={error}
                            icon={AtSymbolIcon}
                            placeholder="Enter your email"
                            {...field}
                          />
                        );
                      }}
                    </Field>
                  </Label>
                </form>

                <SectionTitle subtitle="Some projects will require you to connect social media accounts during the registration process">
                  Social media accounts
                </SectionTitle>

                <div className="mt-6">
                  <div className="bg-[#1D9BF0] text-white px-4 py-3 rounded mb-3 flex justify-between">
                    <div className="flex items-center">
                      <Image width={20} height={20} alt="Twitter" src="/img/Twitter.svg" />
                      <span className="inline-block ml-3">Connect Twitter</span>
                    </div>
                    <Toggle
                      enabled={isTwitterAuthorized}
                      onClick={() =>
                        isTwitterAuthorized ? twitter.disconnect.mutate() : twitter.connect.mutate()
                      }
                      variant="success"
                    />
                  </div>
                  <div className="bg-[#5865F2] text-white px-4 py-3 rounded flex justify-between">
                    <div className="flex items-center">
                      <Image width={20} height={20} alt="Twitter" src="/img/Discord.svg" />
                      <span className="inline-block ml-3">Connect Discord</span>
                    </div>
                    <Toggle
                      enabled={isDiscordAuthorized}
                      onClick={() =>
                        isDiscordAuthorized ? discord.disconnect.mutate() : discord.connect.mutate()
                      }
                      variant="success"
                    />
                  </div>
                </div>

                <div className="container pt-10 mx-auto">
                  <Button href="/projects" variant="neutral">
                    Cancel
                  </Button>
                  <Button type="submit" form="profile-form" className="ml-3">
                    Save changes
                  </Button>
                </div>
              </div>
            </div>
          )}
        </Formik>

        <ProfileWallet />
      </div>
    </>
  );
}
