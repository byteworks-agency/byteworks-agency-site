import { Metadata } from 'next';
import PrivacyClient from './PrivacyClient';

export const metadata: Metadata = {
  title: 'Privacy Policy — ByteWorks',
  description: 'Privacy practices for ByteWorks website and services.',
};

export default function PrivacyPolicyPage() {
  // Server Component (NO hooks de cliente aquí)
  return (
    <section className="py-12">
      <div className="container max-w-3xl">
        <PrivacyClient />
      </div>
    </section>
  );
}