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
import { TwitterIcon } from '../../../public/assets/icons';
import { Typography } from '../../../components/Typography';

export const TwitterAccountsRequirement = ({ hasPremium }: { hasPremium: boolean }) => {
  const { values, setFieldValue } = useFormikContext<PhaseType>();
  return (
    <FieldArray
      name="twitterAccounts"
      render={(twitterAccountsHelper) => (
        <Container>
          <div className="grid grid-cols-12 gap-5 mb-8">
            <div className="col-span-12 md:col-span-6 lg:col-span-12 2xl:col-span-6">
              <Typography className="mb-4" variant="h2">
                Twitter follow requirements
              </Typography>
              <Checkbox
                disabled={!values.twitterAccounts.length || !hasPremium}
                onClick={() =>
                  setFieldValue(
                    'twitterAccountsUseType',
                    values.twitterAccountsUseType === 'ALL' ? 'ANY' : 'ALL'
                  )
                }
                enabled={values.twitterAccountsUseType === 'ALL'}>
                All are required
              </Checkbox>
            </div>
            <div className="col-span-12 md:col-span-6 lg:col-span-12 2xl:col-span-6 md:justify-self-end lg:justify-self-start 2xl:justify-self-end">
              <Button
                onClick={() => {
                  twitterAccountsHelper.push({
                    account: '',
                    link: '',
                  });
                }}
                disabled={values.twitterAccounts.length >= 2 || !hasPremium}
                variant="neutral"
                icon={PlusIcon}>
                Add Twitter
              </Button>
            </div>
          </div>
          <PremiumOverlay disabled={hasPremium}>
            <div className="grid grid-cols-12 2xl:gap-x-7 gap-y-10">
              {values.twitterAccounts.map((_, index) => (
                <Container className="relative col-span-12 2xl:col-span-6" key={index}>
                  <RemoveButton
                    className="absolute right-3 top-2"
                    onClick={() => twitterAccountsHelper.remove(index)}
                  />
                  <InputField
                    required
                    type="text"
                    title="Username"
                    icon={TwitterIcon}
                    placeholder="@username"
                    name={`twitterAccounts[${index}].account`}
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
