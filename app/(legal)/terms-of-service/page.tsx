import { Metadata } from 'next';
import TermsClient from './TermsClient';

export const metadata: Metadata = {
  title: 'Terms of Service — ByteWorks',
  description: 'Terms for using ByteWorks website and services.',
};

export default function TermsOfServicePage() {
  return (
    <section className="py-12">
      <div className="container max-w-3xl">
        <TermsClient />
      </div>
    </section>
  );
}