import { FieldArray, useFormikContext } from 'formik';

import { Button } from '../../../components/Button';
import { Checkbox } from '../../../components/Checkbox';
import { Container } from '../../../components/Container';
import { InputField } from '../../../components/InputField';
import { PhaseType } from '../utils/phase.utils.types';
import { PlusIcon } from '@heroicons/react/24/outline';
import { PremiumOverlay } from '../../../components/PremiumOverlay';
import React from 'react';
import { RemoveButton } from '../../../components/RemoveButton';
import { Typography } from '../../../components/Typography';
import cx from 'classnames';

export const DiscordRequirement = ({ hasPremium }: { hasPremium: boolean }) => {
  const { values, setFieldValue } = useFormikContext<PhaseType>();

  return (
    <FieldArray
      name="discordServers"
      render={(discordServersHelper) => (
        <Container>
          <div className="grid grid-cols-12 gap-5 mb-8">
            <div className="col-span-12 md:col-span-6 lg:col-span-12 2xl:col-span-6">
              <Typography className="mb-4" variant="h2">
                Discord server & role requirements
              </Typography>

              <Checkbox
                disabled={!values.discordServers.length || !hasPremium}
                onClick={() =>
                  setFieldValue(
                    'discordServersUseType',
                    values.discordServersUseType === 'ALL' ? 'ANY' : 'ALL'
                  )
                }
                enabled={values.discordServersUseType === 'ALL'}>
                All are required
              </Checkbox>
            </div>
            <div className="col-span-12 md:col-span-6 lg:col-span-12 2xl:col-span-6 md:justify-self-end lg:justify-self-start 2xl:justify-self-end">
              <Button
                onClick={() => {
                  discordServersHelper.push({
                    discordServerId: '',
                    discordServerLink: '',
                    discordServerName: '',
                    discordRoles: [],
                    discordRolesUseType: 'ANY',
                  });
                }}
                disabled={values.discordServers.length >= 2 || !hasPremium}
                variant="neutral"
                icon={PlusIcon}>
                Add Discord
              </Button>
            </div>
          </div>
          <PremiumOverlay disabled={hasPremium}>
            <div className="grid grid-cols-12 mb-8 2xl:gap-x-10 gap-y-10">
              {values.discordServers.map((discordServer, index) => (
                <Container className="relative col-span-12" key={index}>
                  <RemoveButton
                    className="absolute right-3 top-2"
                    onClick={() => discordServersHelper.remove(index)}
                  />
                  <FieldArray
                    name={`discordServers[${index}].discordRoles`}
                    render={(discordRolesHelper) => (
                      <div>
                        <div className="grid grid-cols-11 gap-x-4 gap-y-5">
                          <div className="col-span-full md:col-span-5">
                            <InputField
                              required
                              type="text"
                              title="Server ID"
                              name={`discordServers[${index}].discordServerId`}
                              placeholder="Enter server id"
                            />
                          </div>

                          <div className="col-span-full md:col-span-5">
                            <InputField
                              required
                              type="text"
                              title="Name"
                              name={`discordServers[${index}].discordServerName`}
                              placeholder="Enter title"
                            />
                          </div>
                          <div className="col-span-full md:col-span-5">
                            <InputField
                              required
                              type="text"
                              title="Discord invitation code"
                              name={`discordServers[${index}].discordServerLink`}
                              placeholder="Enter code"
                            />
                          </div>
                        </div>
                        <div className="flex items-center justify-between mb-8">
                          <Typography variant="h3">Roles</Typography>
                          <Button
                            variant="neutral"
                            icon={PlusIcon}
                            disabled={values.discordServers[index].discordRoles.length >= 3}
                            onClick={() => {
                              discordRolesHelper.push({ roleId: '', roleName: '' });
                            }}>
                            Add role
                          </Button>
                        </div>
                        {discordServer.discordRoles?.length ? (
                          <div>
                            <div className="mb-6">
                              {discordServer.discordRoles.map((_, roleIndex) => (
                                <div
                                  className={cx(
                                    {
                                      'mb-10 md:mb-2.5':
                                        roleIndex + 1 < discordServer.discordRoles.length,
                                    },
                                    'grid grid-cols-11 gap-x-4 md:gap-y-5'
                                  )}
                                  key={roleIndex}>
                                  <div className="col-span-full md:col-span-5">
                                    <InputField
                                      type="text"
                                      name={`discordServers[${index}].discordRoles[${roleIndex}].roleId`}
                                      placeholder="Enter role id"
                                    />
                                  </div>
                                  <div className="flex col-span-9 sm:col-span-10 md:col-span-5">
                                    <div className="grow">
                                      <InputField
                                        type="text"
                                        name={`discordServers[${index}].discordRoles[${roleIndex}].roleName`}
                                        placeholder="Enter role name"
                                      />
                                    </div>
                                  </div>
                                  <div className="col-span-2 pl-3 sm:col-span-1 justify-self-end md:pl-0">
                                    <RemoveButton
                                      className="mt-3"
                                      onClick={() => discordRolesHelper.remove(roleIndex)}
                                    />
                                  </div>
                                </div>
                              ))}
                            </div>
                            <Checkbox
                              enabled={values.discordServers[index].discordRolesUseType === 'ALL'}
                              onClick={() =>
                                setFieldValue(
                                  `discordServers[${index}].discordRolesUseType`,
                                  values.discordServers[index].discordRolesUseType === 'ALL'
                                    ? 'ANY'
                                    : 'ALL'
                                )
                              }>
                              All roles required
                            </Checkbox>
                          </div>
                        ) : (
                          <div>No roles have been added</div>
                        )}
                      </div>
                    )}
                  />
                </Container>
              ))}
            </div>
          </PremiumOverlay>
        </Container>
      )}
    />
  );
};
