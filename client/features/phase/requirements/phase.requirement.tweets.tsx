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
import { ToggleField } from '../../../components/ToggleField';
import { Typography } from '../../../components/Typography';

export const TweetsRequirement = ({ hasPremium }: { hasPremium: boolean }) => {
  const { values, setFieldValue } = useFormikContext<PhaseType>();
  return (
    <FieldArray
      name="tweets"
      render={(tweetsHelper) => (
        <Container>
          <div className="grid grid-cols-12 gap-5 mb-8">
            <div className="col-span-12 md:col-span-6 lg:col-span-12 2xl:col-span-6">
              <Typography className="mb-4" variant="h2">
                Tweets requirement
              </Typography>

              <Checkbox
                disabled={!values.tweets.length || !hasPremium}
                onClick={() =>
                  setFieldValue('tweetsUseType', values.tweetsUseType === 'ALL' ? 'ANY' : 'ALL')
                }
                enabled={values.tweetsUseType === 'ALL'}>
                All are required
              </Checkbox>
            </div>
            <div className="col-span-12 md:col-span-6 lg:col-span-12 2xl:col-span-6 md:justify-self-end lg:justify-self-start 2xl:justify-self-end">
              <Button
                onClick={() => {
                  tweetsHelper.push({
                    link: '',
                    like: false,
                    retweet: false,
                    tagAmount: '',
                  });
                }}
                disabled={values.tweets.length >= 2 || !hasPremium}
                variant="neutral"
                icon={PlusIcon}>
                Add tweet
              </Button>
            </div>
          </div>
          <PremiumOverlay disabled={hasPremium}>
            <div className="grid grid-cols-12 2xl:gap-x-7 gap-y-10">
              {values.tweets.map((_, index) => (
                <Container className="relative col-span-12 2xl:col-span-6" key={index}>
                  <RemoveButton
                    className="absolute right-3 top-2"
                    onClick={() => tweetsHelper.remove(index)}
                  />

                  <div className="grid gap-3">
                    <InputField
                      required
                      type="text"
                      title="Link"
                      name={`tweets[${index}].link`}
                      placeholder="https://twitter.com/gomintnft/status/1509789272123056128"
                    />
                    <InputField
                      type="number"
                      title="Tag amount"
                      name={`tweets[${index}].tagAmount`}
                      placeholder="Enter tag amount"
                    />
                    <ToggleField text="Like" name={`tweets[${index}].like`} />
                    <ToggleField text="Retweet" name={`tweets[${index}].retweet`} />
                  </div>
                </Container>
              ))}
            </div>
          </PremiumOverlay>
        </Container>
      )}
    />
  );
};
