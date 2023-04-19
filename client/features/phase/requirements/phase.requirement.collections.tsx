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

export const CollectionsRequirement = ({ hasPremium }: { hasPremium: boolean }) => {
  const { values, setFieldValue } = useFormikContext<PhaseType>();
  return (
    <FieldArray
      name="collections"
      render={(collectionsHelper) => (
        <Container>
          <div className="grid grid-cols-12 gap-5 mb-8">
            <div className="col-span-12 md:col-span-6 lg:col-span-12 2xl:col-span-6">
              <Typography className="mb-4" variant="h2">
                Specific collection NFT requirements
              </Typography>

              <Checkbox
                disabled={!values.collections.length || !hasPremium}
                onClick={() =>
                  setFieldValue(
                    'collectionsUseType',
                    values.collectionsUseType === 'ALL' ? 'ANY' : 'ALL'
                  )
                }
                enabled={values.collectionsUseType === 'ALL'}>
                All are required
              </Checkbox>
            </div>
            <div className="col-span-12 md:col-span-6 lg:col-span-12 2xl:col-span-6 md:justify-self-end lg:justify-self-start 2xl:justify-self-end">
              <Button
                onClick={() => {
                  collectionsHelper.push({
                    collectionAddress: '',
                    collectionName: '',
                    collectionLink: '',
                    amount: 1,
                  });
                }}
                disabled={values.collections.length >= 5 || !hasPremium}
                variant="neutral"
                icon={PlusIcon}>
                Add collection
              </Button>
            </div>
          </div>

          <PremiumOverlay disabled={hasPremium}>
            <div className="grid grid-cols-12 2xl:gap-x-7 gap-y-10">
              {values.collections.map((_, index) => (
                <Container className="relative col-span-12 2xl:col-span-6" key={index}>
                  <RemoveButton
                    className="absolute right-3 top-2"
                    onClick={() => collectionsHelper.remove(index)}
                  />
                  <InputField
                    required
                    type="text"
                    title="Collection Name"
                    placeholder="Enter collection name"
                    name={`collections[${index}].collectionName`}
                  />
                  <InputField
                    required
                    type="text"
                    title="Contract address"
                    placeholder="Enter collection address"
                    name={`collections[${index}].collectionAddress`}
                  />
                  <InputField
                    required
                    type="text"
                    title="Link"
                    placeholder="Enter collection link"
                    name={`collections[${index}].collectionLink`}
                  />
                  <InputField
                    required
                    type="number"
                    title="Required amount"
                    placeholder="Enter required amount"
                    name={`collections[${index}].amount`}
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
