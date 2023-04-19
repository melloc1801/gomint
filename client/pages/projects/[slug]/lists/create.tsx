import { ModifyPhasePage } from '../../../../features/phase/pages/phase.page.modify';
import { PageTitle } from '../../../../components/PageTitle';

const CreatePhasePage = () => (
  <div className="container px-8 mx-auto py-14">
    <PageTitle subtitle="Enter the access list information and requirements">
      Add access list
    </PageTitle>
    <div className="my-10">
      <ModifyPhasePage />
    </div>
  </div>
);

export default CreatePhasePage;
