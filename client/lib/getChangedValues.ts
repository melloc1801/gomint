import { differenceWith, isEqual, set } from 'lodash';

export const getChangedValues = (
  values: Record<string, unknown>,
  initialValues: Record<string, unknown>
) => {
  return Object.entries(values).reduce((acc, [key, value]) => {
    let hasChanged = initialValues[key] !== value;

    if (Array.isArray(value)) {
      const initialValue = initialValues[key];
      if (Array.isArray(initialValue)) {
        if (initialValue.length === value.length) {
          hasChanged = Boolean(differenceWith(value, initialValue, isEqual).length);
        } else {
          hasChanged = true;
        }
      }
    }

    if (hasChanged) {
      set(acc, key, value);
    }

    return acc;
  }, {} as any);
};
