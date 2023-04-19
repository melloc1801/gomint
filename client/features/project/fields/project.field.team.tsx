import { Controller, ProjectType } from '../utils/project.utils.types';
import { Field, FieldArray, FormikErrors, useFormikContext } from 'formik';

import { Button } from '../../../components/Button';
import { Input } from '../../../components/Input';
import { PlusIcon } from '@heroicons/react/24/outline';
import { PremiumOverlay } from '../../../components/PremiumOverlay';
import { Typography } from '../../../components/Typography';
import { UserIcon } from '@heroicons/react/24/solid';

export const ProjectFieldTeam = ({
  loading,
  hasPremium,
}: {
  loading?: boolean;
  hasPremium?: boolean;
}) => {
  const { values, setFieldValue, errors } = useFormikContext<ProjectType>();

  return (
    <FieldArray
      name="controllers"
      validateOnChange={false}
      render={(arrayHelpers) => {
        const onAddTeamMemberHandle = (index: number) => {
          arrayHelpers.insert(index, {
            address: '',
          } as Controller);
        };

        const onRemoveTeamMemberHandle = (index: number) => {
          arrayHelpers.remove(index);
        };

        const hasMembers = Boolean(values.controllers?.length);

        return (
          <>
            <div className="flex items-start mt-8 mb-5">
              <div>
                <Typography variant="h2">Team members</Typography>
                <Typography variant="p" className="mt-5 mb-3">
                  Team members would have access to project access lists but wont’t be able to
                  delete the project.
                </Typography>
              </div>
              <Button
                icon={PlusIcon}
                variant="neutral"
                disabled={!hasPremium}
                onClick={() => onAddTeamMemberHandle(values.controllers?.length || 0)}
              />
            </div>

            <PremiumOverlay
              loading={loading}
              disabled={hasPremium}
              title="Team members feature only available for premium users.">
              {hasMembers ? (
                values.controllers.map((member, index) => (
                  <Field key={index} name={`controller.${index}`}>
                    {() => {
                      let error: string | undefined;

                      if (errors?.controllers) {
                        error = (errors.controllers[index] as FormikErrors<Controller>)?.address;
                      }

                      return (
                        <Input
                          type="text"
                          error={error}
                          icon={UserIcon}
                          placeholder="Wallet address"
                          onRemove={() => onRemoveTeamMemberHandle(index)}
                          value={member.address}
                          onChange={(e) => {
                            if (!values.controllers) {
                              return;
                            }
                            const newControllers = [...values.controllers];

                            newControllers[index] = {
                              ...values.controllers[index],
                              address: e.target.value,
                            };
                            setFieldValue('controllers', newControllers);
                          }}
                        />
                      );
                    }}
                  </Field>
                ))
              ) : (
                <div className="text-slate-400">No team members added</div>
              )}
            </PremiumOverlay>
          </>
        );
      }}
    />
  );
};
