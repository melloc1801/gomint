import { Descendant } from 'slate';
import { Editor } from '../../../components/Editor/Editor';
import { Label } from '../../../components/Label';
import { useFormikContext } from 'formik';

export const ProjectFieldEditor = ({ initialValue = [] }: { initialValue?: Descendant[] }) => {
  const { setFieldValue } = useFormikContext();

  return (
    <>
      <Label title="Description" />
      <Editor textData={initialValue} onChange={(value) => setFieldValue('description', value)} />
    </>
  );
};
