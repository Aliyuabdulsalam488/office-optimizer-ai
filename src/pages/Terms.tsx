import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Terms = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-center">Terms and Conditions</h1>
          
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>1. Acceptance of Terms</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                By accessing and using Techstora's services, you accept and agree to be bound by these Terms and Conditions. 
                If you do not agree to these terms, please do not use our services.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>2. Use of Services</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                <strong>2.1 Account Registration:</strong> You must provide accurate and complete information when creating an account. 
                You are responsible for maintaining the confidentiality of your account credentials.
              </p>
              <p>
                <strong>2.2 Permitted Use:</strong> You may use our services only for lawful purposes and in accordance with these Terms. 
                You agree not to use the services to transmit any harmful, offensive, or illegal content.
              </p>
              <p>
                <strong>2.3 Service Availability:</strong> We strive to maintain service availability but do not guarantee uninterrupted access. 
                We may modify, suspend, or discontinue services at any time.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>3. Data and Privacy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                <strong>3.1 Data Collection:</strong> We collect and process personal data as described in our Privacy Policy. 
                By using our services, you consent to such processing.
              </p>
              <p>
                <strong>3.2 Data Security:</strong> We implement reasonable security measures to protect your data. 
                However, no system is completely secure, and we cannot guarantee absolute security.
              </p>
              <p>
                <strong>3.3 Data Ownership:</strong> You retain ownership of any data you upload to our platform. 
                We will not sell your data to third parties.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>4. AI Services</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                <strong>4.1 AI Accuracy:</strong> Our AI-powered services provide recommendations and insights, but we do not guarantee 
                100% accuracy. Users should verify important decisions independently.
              </p>
              <p>
                <strong>4.2 AI Training:</strong> We may use anonymized interaction data to improve our AI models, 
                but will not use your confidential business data without explicit consent.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>5. Subscription and Payments</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                <strong>5.1 Fees:</strong> Some services may require payment. All fees are non-refundable unless otherwise stated.
              </p>
              <p>
                <strong>5.2 Billing:</strong> You authorize us to charge your payment method for subscription fees and any additional charges.
              </p>
              <p>
                <strong>5.3 Free Trial:</strong> If you sign up for a free trial, you will be charged at the end of the trial period 
                unless you cancel before the trial ends.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>6. Intellectual Property</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                <strong>6.1 Platform Ownership:</strong> All content, features, and functionality of the Techstora platform are owned by us 
                and protected by copyright, trademark, and other intellectual property laws.
              </p>
              <p>
                <strong>6.2 License:</strong> We grant you a limited, non-exclusive, non-transferable license to use our services 
                for your business operations.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>7. Limitation of Liability</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                To the maximum extent permitted by law, Techstora shall not be liable for any indirect, incidental, special, 
                consequential, or punitive damages resulting from your use of or inability to use the services.
              </p>
              <p>
                Our total liability for any claims arising from these terms shall not exceed the amount you paid us in the 
                twelve months preceding the claim.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>8. Termination</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                <strong>8.1 By You:</strong> You may terminate your account at any time by contacting support or using account settings.
              </p>
              <p>
                <strong>8.2 By Us:</strong> We reserve the right to suspend or terminate accounts that violate these Terms 
                or engage in fraudulent activities.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>9. Changes to Terms</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                We may update these Terms from time to time. Continued use of our services after changes constitutes 
                acceptance of the modified Terms. We will notify users of significant changes via email or platform notifications.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>10. Governing Law</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                These Terms shall be governed by and construed in accordance with the laws of your jurisdiction, 
                without regard to its conflict of law provisions.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>11. Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                If you have any questions about these Terms, please contact us through our support channels.
              </p>
              <p className="text-sm mt-6">
                <strong>Last Updated:</strong> November 2, 2025
              </p>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Terms;
