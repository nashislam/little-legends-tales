
import Navbar from "@/components/Navbar";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-display text-3xl md:text-4xl mb-8">Privacy Policy</h1>
          
          <div className="prose max-w-none">
            <p className="mb-4">Last Updated: April 10, 2025</p>
            
            <h2 className="text-2xl font-display mt-8 mb-4">Introduction</h2>
            <p>Welcome to Little Legends ("we," "our," or "us"). We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, and share information about you when you use our website and services.</p>
            
            <h2 className="text-2xl font-display mt-8 mb-4">Information We Collect</h2>
            <p>We collect information you provide directly to us when you:</p>
            <ul className="list-disc ml-6 mb-4">
              <li>Create an account or profile</li>
              <li>Input details for personalized storybooks</li>
              <li>Contact customer support</li>
              <li>Complete forms on our website</li>
            </ul>
            
            <p>This information may include:</p>
            <ul className="list-disc ml-6 mb-4">
              <li>Name and contact information</li>
              <li>Login credentials</li>
              <li>Payment and billing information</li>
              <li>Child's name, age, and preferences (for personalized stories)</li>
              <li>Images you upload</li>
            </ul>
            
            <h2 className="text-2xl font-display mt-8 mb-4">How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul className="list-disc ml-6 mb-4">
              <li>Provide, maintain, and improve our services</li>
              <li>Create personalized storybooks</li>
              <li>Process payments and fulfill orders</li>
              <li>Send you technical notices, updates, and support messages</li>
              <li>Respond to your comments and questions</li>
              <li>Monitor and analyze trends and usage</li>
            </ul>
            
            <h2 className="text-2xl font-display mt-8 mb-4">Data Retention</h2>
            <p>We store your personal information for as long as needed to provide you with our services and for legitimate business purposes, such as maintaining performance of the service, making data-driven business decisions about new features, complying with our legal obligations, and resolving disputes.</p>
            
            <h2 className="text-2xl font-display mt-8 mb-4">Children's Privacy</h2>
            <p>Our services are intended for use by parents and guardians, not directly by children under 13. We do not knowingly collect personal information from children under 13. If you believe we might have collected information from a child under 13, please contact us immediately.</p>
            
            <h2 className="text-2xl font-display mt-8 mb-4">Security</h2>
            <p>We use reasonable security measures designed to protect your information. However, no security measures are 100% foolproof, and we cannot guarantee the security of your personal information.</p>
            
            <h2 className="text-2xl font-display mt-8 mb-4">Changes to This Policy</h2>
            <p>We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.</p>
            
            <h2 className="text-2xl font-display mt-8 mb-4">Contact Us</h2>
            <p>If you have any questions about this Privacy Policy, please contact us at:</p>
            <p className="mb-4">Email: privacy@littlelegends.com</p>
            <p>Little Legends<br />
            123 Story Lane<br />
            Imagination City, IC 12345</p>
          </div>
        </div>
      </div>
      
      <footer className="bg-white py-12 border-t mt-16">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-500 mb-4">© 2025 Little Legends. All rights reserved.</p>
          <p className="text-sm text-gray-400">
            Creating magical personalized stories for children using AI.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default PrivacyPolicy;
