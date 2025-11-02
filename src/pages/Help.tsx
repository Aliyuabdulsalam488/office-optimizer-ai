import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { BookOpen, Users, FileText, ShoppingCart, BarChart3, Database, Wrench } from "lucide-react";

const Help = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Help & Documentation</h1>
            <p className="text-xl text-muted-foreground">
              Everything you need to know about using Techstora
            </p>
          </div>

          {/* Getting Started Section */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Getting Started
              </CardTitle>
              <CardDescription>Learn the basics of Techstora</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>How do I create an account?</AccordionTrigger>
                  <AccordionContent>
                    <ol className="list-decimal list-inside space-y-2">
                      <li>Click on "Get Started" from the homepage</li>
                      <li>Select the "Sign Up" tab</li>
                      <li>Enter your full name, email, and password (minimum 6 characters)</li>
                      <li>Click "Create Account"</li>
                      <li>You'll be automatically logged in and redirected to your dashboard</li>
                    </ol>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2">
                  <AccordionTrigger>How do I reset my password?</AccordionTrigger>
                  <AccordionContent>
                    <ol className="list-decimal list-inside space-y-2">
                      <li>Go to the login page</li>
                      <li>Click "Forgot your password? Click here to reset"</li>
                      <li>Enter your email address</li>
                      <li>Click "Send Reset Link"</li>
                      <li>Check your email for the password reset link</li>
                    </ol>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3">
                  <AccordionTrigger>What is the Dashboard?</AccordionTrigger>
                  <AccordionContent>
                    The Dashboard is your central hub for accessing all Techstora services. From here, you can:
                    <ul className="list-disc list-inside mt-2 space-y-1">
                      <li>Access AI assistants for different departments</li>
                      <li>Navigate to specific service modules (HR, Finance, Sales, etc.)</li>
                      <li>View your account information</li>
                      <li>Manage your workflows</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>

          {/* Services Guide */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wrench className="h-5 w-5" />
                Services Guide
              </CardTitle>
              <CardDescription>Learn about each service module</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="hr">
                  <AccordionTrigger className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    HR Services
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="mb-2"><strong>Features:</strong></p>
                    <ul className="list-disc list-inside space-y-1">
                      <li><strong>Recruitment Tracking:</strong> Manage job postings and candidate applications</li>
                      <li><strong>AI Recruitment:</strong> Use AI-powered candidate screening and analysis</li>
                      <li><strong>AI Voice Interviews:</strong> Conduct automated voice interviews</li>
                      <li><strong>Employee Management:</strong> Track employee records and information</li>
                      <li><strong>Leave Management:</strong> Process and approve leave requests</li>
                      <li><strong>Performance Reviews:</strong> Conduct and track performance evaluations</li>
                      <li><strong>Onboarding Workflows:</strong> Streamline new employee onboarding</li>
                    </ul>
                    <p className="mt-3"><strong>AI Assistant:</strong> Chat with Hilda for HR-related queries and assistance</p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="finance">
                  <AccordionTrigger className="flex items-center gap-2">
                    <BarChart3 className="h-4 w-4" />
                    Finance Services
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="mb-2"><strong>Features:</strong></p>
                    <ul className="list-disc list-inside space-y-1">
                      <li><strong>Invoice Management:</strong> Create, track, and manage invoices</li>
                      <li><strong>Expense Tracking:</strong> Monitor and categorize business expenses</li>
                      <li><strong>Budget Planning:</strong> Set and track departmental budgets</li>
                      <li><strong>Financial Reports:</strong> Generate comprehensive financial reports</li>
                      <li><strong>Payment Processing:</strong> Handle vendor and supplier payments</li>
                    </ul>
                    <p className="mt-3"><strong>AI Assistant:</strong> Chat with Penny for financial insights and assistance</p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="procurement">
                  <AccordionTrigger className="flex items-center gap-2">
                    <ShoppingCart className="h-4 w-4" />
                    Procurement Services
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="mb-2"><strong>Features:</strong></p>
                    <ul className="list-disc list-inside space-y-1">
                      <li><strong>Purchase Requisitions:</strong> Submit and approve purchase requests</li>
                      <li><strong>Supplier Management:</strong> Maintain supplier database and relationships</li>
                      <li><strong>RFQ Generator:</strong> Create Request for Quotations automatically</li>
                      <li><strong>Contract Management:</strong> Store and manage supplier contracts</li>
                      <li><strong>Spend Analytics:</strong> Analyze spending patterns and optimize costs</li>
                    </ul>
                    <p className="mt-3"><strong>AI Assistant:</strong> Chat with Sally for procurement guidance</p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="sales">
                  <AccordionTrigger className="flex items-center gap-2">
                    <BarChart3 className="h-4 w-4" />
                    Sales Services
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="mb-2"><strong>Features:</strong></p>
                    <ul className="list-disc list-inside space-y-1">
                      <li><strong>CRM Dashboard:</strong> Manage customer relationships and interactions</li>
                      <li><strong>Lead Management:</strong> Track and nurture sales leads</li>
                      <li><strong>Pipeline Tracking:</strong> Monitor deals through sales stages</li>
                      <li><strong>Quote Generator:</strong> Create professional sales quotes</li>
                      <li><strong>Sales Forecasting:</strong> Predict future sales trends</li>
                    </ul>
                    <p className="mt-3"><strong>AI Assistant:</strong> Chat with Freddy for sales strategies and support</p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="executive">
                  <AccordionTrigger className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Executive Services
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="mb-2"><strong>Features:</strong></p>
                    <ul className="list-disc list-inside space-y-1">
                      <li><strong>Calendar Management:</strong> Schedule and organize meetings</li>
                      <li><strong>Task Management:</strong> Track and prioritize executive tasks</li>
                      <li><strong>Meeting Scheduler:</strong> Coordinate meetings with multiple participants</li>
                      <li><strong>Travel Planning:</strong> Organize business travel arrangements</li>
                      <li><strong>Expense Tracking:</strong> Monitor executive-level expenses</li>
                    </ul>
                    <p className="mt-3"><strong>AI Assistant:</strong> Chat with Eva for executive support</p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="data">
                  <AccordionTrigger className="flex items-center gap-2">
                    <Database className="h-4 w-4" />
                    Data Cleaning Services
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="mb-2"><strong>Features:</strong></p>
                    <ul className="list-disc list-inside space-y-1">
                      <li><strong>Data Profiling:</strong> Analyze data quality and structure</li>
                      <li><strong>Quality Assessment:</strong> Evaluate data accuracy and completeness</li>
                      <li><strong>Duplicate Detection:</strong> Identify and merge duplicate records</li>
                      <li><strong>Data Transformation:</strong> Format and standardize data</li>
                      <li><strong>Validation Rules:</strong> Set up automated data validation</li>
                    </ul>
                    <p className="mt-3"><strong>AI Assistant:</strong> Chat with Clara for data management help</p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>

          {/* AI Assistants */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                AI Assistants
              </CardTitle>
              <CardDescription>Meet your AI-powered team</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="ai-1">
                  <AccordionTrigger>How do AI Assistants work?</AccordionTrigger>
                  <AccordionContent>
                    Each department has a dedicated AI assistant trained to help with specific tasks:
                    <ul className="list-disc list-inside mt-2 space-y-1">
                      <li><strong>Hilda (HR):</strong> Recruitment, employee management, policy questions</li>
                      <li><strong>Penny (Finance):</strong> Budgeting, expense tracking, financial analysis</li>
                      <li><strong>Sally (Procurement):</strong> Supplier selection, purchase orders, contracts</li>
                      <li><strong>Freddy (Sales):</strong> Lead qualification, sales strategies, CRM guidance</li>
                      <li><strong>Eva (Executive):</strong> Scheduling, task prioritization, travel planning</li>
                      <li><strong>Clara (Data):</strong> Data quality, cleaning strategies, validation rules</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="ai-2">
                  <AccordionTrigger>How do I chat with an AI Assistant?</AccordionTrigger>
                  <AccordionContent>
                    <ol className="list-decimal list-inside space-y-2">
                      <li>Go to your Dashboard</li>
                      <li>Select the AI Assistant card for your department</li>
                      <li>Type your question in the chat interface</li>
                      <li>The AI will respond with helpful guidance and suggestions</li>
                      <li>You can have ongoing conversations and ask follow-up questions</li>
                    </ol>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>

          {/* Troubleshooting */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Troubleshooting</CardTitle>
              <CardDescription>Common issues and solutions</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="trouble-1">
                  <AccordionTrigger>I can't log in to my account</AccordionTrigger>
                  <AccordionContent>
                    <p className="mb-2">Try these steps:</p>
                    <ol className="list-decimal list-inside space-y-1">
                      <li>Double-check your email and password for typos</li>
                      <li>Use the "Forgot Password" feature to reset your password</li>
                      <li>Clear your browser cache and cookies</li>
                      <li>Try using a different browser or device</li>
                      <li>Contact support if the issue persists</li>
                    </ol>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="trouble-2">
                  <AccordionTrigger>A feature isn't working properly</AccordionTrigger>
                  <AccordionContent>
                    <p className="mb-2">Try these solutions:</p>
                    <ol className="list-decimal list-inside space-y-1">
                      <li>Refresh the page (Ctrl+R or Cmd+R)</li>
                      <li>Clear your browser cache</li>
                      <li>Ensure you're using the latest browser version</li>
                      <li>Check your internet connection</li>
                      <li>Try accessing from a different device or browser</li>
                    </ol>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="trouble-3">
                  <AccordionTrigger>I need help with a specific task</AccordionTrigger>
                  <AccordionContent>
                    <p className="mb-2">Get assistance quickly:</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Use the AI Assistant for your department - they can provide step-by-step guidance</li>
                      <li>Check the relevant service guide in this help section</li>
                      <li>Look for tooltips and help icons (?) throughout the interface</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>

          {/* System Updates */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                System Updates & Roadmap
              </CardTitle>
              <CardDescription>What's new and what's coming</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Current Features</h3>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    <li>Multi-department AI assistants</li>
                    <li>Comprehensive HR, Finance, Sales, Procurement, Executive, and Data services</li>
                    <li>User authentication and account management</li>
                    <li>AI-powered recruitment with voice interviews</li>
                    <li>Template library for common tasks</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Coming Soon</h3>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    <li>Mobile app for iOS and Android</li>
                    <li>Advanced analytics and reporting</li>
                    <li>Custom workflow automation builder</li>
                    <li>Integration with third-party tools</li>
                    <li>Multi-language support</li>
                    <li>Enhanced collaboration features</li>
                  </ul>
                </div>

                <div className="mt-6 p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    <strong>Note:</strong> This documentation is continuously updated as new features are added. 
                    Bookmark this page to stay informed about system updates and new capabilities.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Help;
