import { Field, useFormikContext } from 'formik';

import { Label } from '../../../components/Label';
import { ProfilePicture } from '../../../components/ProfilePicture';
import { ProjectType } from '../utils/project.utils.types';
import { uploadImage } from '../../../lib/upload';

export const ProjectFieldPFP = () => {
  const { values, setFieldValue } = useFormikContext<ProjectType>();

  return (
    <Label title="Profile picture" className="inline-block">
      <>
        <ProfilePicture url={values.pfpURL} onRemove={() => setFieldValue('pfpURL', '')} />
        <Field
          value=""
          type="file"
          name="pfpURL"
          className="hidden"
          onChange={async (e: React.ChangeEvent<HTMLInputElement>) => {
            setFieldValue('pfpURL', await uploadImage(e));
          }}
        />
      </>
    </Label>
  );
};
