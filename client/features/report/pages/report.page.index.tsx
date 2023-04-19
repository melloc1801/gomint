import * as React from 'react';

import { Form, Formik } from 'formik';

import { Button } from '../../../components/Button';
import { Dialog } from '../../../components/Dialog';
import { ExclaimationCircleIcon } from '@heroicons/react/24/solid';
import { Report } from '../utils/report.utils.types';
import { ReportFieldName } from '../../report/fields/report.field.message';
import { ReportValidationSchema } from '../../report/utils/report.utils.validation';
import { useReport } from '../hooks/report.hook';

export function ReportPage(props: { slug: string }) {
  const report = useReport(props.slug);

  const reportInitialValues: Partial<Report> = {
    message: '',
  };

  return (
    <Dialog
      title="Report a problem"
      subtitle="Please leave your feedback"
      button={({ open }) => (
        <button
          type="button"
          className="flex items-center col-span-1 text-sm text-red-500 lg:col-span-2 hover:underline"
          onClick={open}>
          <ExclaimationCircleIcon className="w-5 h-5" />
          <span className="pl-1.5 font-medium">Report a problem</span>
        </button>
      )}>
      {({ close }) => (
        <Formik
          onSubmit={async (values) => {
            await report.create.mutateAsync(values);
            close();
          }}
          validationSchema={ReportValidationSchema}
          initialValues={reportInitialValues}>
          <Form className="mt-6">
            <ReportFieldName />
            <Button type="submit" className="w-full">
              Send comment
            </Button>
          </Form>
        </Formik>
      )}
    </Dialog>
  );
}
