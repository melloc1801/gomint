import * as React from 'react';

import { Form, Formik, FormikProps } from 'formik';
import { discordURLPrefix, twitterURLPrefix } from '../utils/project.utils.constants';

import { Button } from '../../../components/Button';
import { PageTitle } from '../../../components/PageTitle';
import { ProjectFieldEditor } from '../fields/project.field.editor';
import { ProjectFieldHeader } from '../fields/project.field.header';
import { ProjectFieldName } from '../fields/project.field.name';
import { ProjectFieldPFP } from '../fields/project.field.pfp';
import { ProjectFieldSlug } from '../fields/project.field.slug';
import { ProjectFieldTeam } from '../fields/project.field.team';
import { ProjectFieldTwitter } from '../fields/project.field.twitter';
import { ProjectFieldWebsite } from '../fields/project.field.website';
import { ProjectType } from '../utils/project.utils.types';
import { ProjectValidationSchema } from '../utils/project.utils.validation';
import { ToggleField } from '../../../components/ToggleField';
import { Typography } from '../../../components/Typography';
import { getChangedValues } from '../../../lib/getChangedValues';
import { useProfile } from '../../profile/hooks/profile.hook.me';
import { useProject } from '../hooks/project.hook';
import { useRouter } from 'next/router';
import { InputField } from '../../../components/InputField';
import { DiscordIcon } from '../../../public/assets/icons';

// TODO:
// - Discord URL rename to code on the API/DB side
// - Twitter URL rename to twitter username, also server should get username with @ and then cut it when writing it into DB

const projectInitialValues: Partial<ProjectType> = {
  name: '',
  slug: '',
  pfpURL: '',
  headerURL: '',
  twitterURL: '',
  discordURL: '',
  websiteURL: '',
  headerColor: '',
  description: '',
  phasesPublished: false,
};

export const ModifyProjectPage = () => {
  const router = useRouter();
  const project = useProject(router.query.slug as string);
  const profile = useProfile({ redirectTo: '/' });

  const isUpdate = Boolean(router.query.slug);

  const form = React.useRef<FormikProps<typeof projectInitialValues>>(null);

  React.useEffect(() => {
    if (isUpdate) {
      if (project.bySlug.isSuccess) {
        form.current?.validateForm();
      }
    } else {
      form.current?.validateForm();
    }
  }, [isUpdate, project.bySlug.isSuccess]);

  const [isManualSlug, setIsManualSlug] = React.useState(isUpdate);

  return (
    <Formik
      innerRef={form}
      enableReinitialize
      initialValues={
        isUpdate && project.bySlug.isSuccess
          ? {
              ...project.bySlug.data,
              discordURL: project.bySlug.data?.discordURL?.startsWith(discordURLPrefix)
                ? project.bySlug.data?.discordURL?.replace(discordURLPrefix, '')
                : project.bySlug.data?.discordURL,
              twitterURL: project.bySlug.data?.twitterURL?.startsWith(twitterURLPrefix)
                ? project.bySlug.data?.twitterURL?.replace(twitterURLPrefix, '@')
                : project.bySlug.data?.twitterURL,
            }
          : projectInitialValues
      }
      validationSchema={ProjectValidationSchema}
      onSubmit={async (values) => {
        isUpdate
          ? project.update.mutateAsync({
              slug: project.bySlug.data!.slug!,
              data: getChangedValues(values, project.bySlug.data as Record<string, unknown>),
            })
          : project.create.mutateAsync(values);
      }}>
      <Form id="project" autoComplete="off">
        <div className="container px-8 mx-auto py-14">
          <PageTitle>{isUpdate ? 'Update project' : 'Create project'}</PageTitle>

          <div className="my-10">
            <div className="grid grid-cols-12 gap-y-12 lg:gap-12">
              <div className="col-span-12 lg:col-span-5">
                <div className="mb-6">
                  <ProjectFieldPFP />
                </div>
                <ProjectFieldName isManualSlug={isManualSlug} />
                <ProjectFieldSlug becomeManual={() => setIsManualSlug(true)} />
                <ToggleField name="phasesPublished" text="Show access lists on the project page" />
                <Typography variant="h2" className="mt-8 mb-5">
                  Social media accounts
                </Typography>

                <InputField
                  type="text"
                  name="discordURL"
                  icon={DiscordIcon}
                  placeholder="bVehGt6n"
                  title="Discord invitation code"
                />
                <ProjectFieldTwitter />
                <ProjectFieldWebsite />

                {(project.bySlug.data ? project.bySlug.data.isOwner : profile.data?.premium) ? (
                  <ProjectFieldTeam
                    loading={profile.isLoading}
                    hasPremium={profile.data?.premium}
                  />
                ) : null}
              </div>
              <div className="col-span-12 lg:col-span-7">
                <ProjectFieldHeader />
                {isUpdate ? (
                  project.bySlug.isSuccess ? (
                    <ProjectFieldEditor
                      initialValue={JSON.parse(project.bySlug.data?.description)}
                    />
                  ) : null
                ) : (
                  <ProjectFieldEditor />
                )}
              </div>
            </div>
          </div>
          <div className="flex flex-col-reverse md:block">
            <Button className="w-full my-2 md:w-auto" href="/projects" variant="neutral">
              Cancel
            </Button>
            <Button type="submit" form="project" className="w-full my-2 md:w-auto md:ml-3">
              {isUpdate ? 'Update project' : 'Create project'}
            </Button>
          </div>
        </div>
      </Form>
    </Formik>
  );
};
