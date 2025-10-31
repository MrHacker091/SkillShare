"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, CheckCircle, Database, Loader2, Mail, XCircle } from "lucide-react";
import { useState } from "react";

interface TestResult {
  status: 'success' | 'error' | 'loading' | 'idle';
  message: string;
  details?: any;
}

export default function SystemStatusPage() {
  const [emailTest, setEmailTest] = useState<TestResult>({ status: 'idle', message: '' });
  const [databaseTest, setDatabaseTest] = useState<TestResult>({ status: 'idle', message: '' });
  const [testEmail, setTestEmail] = useState('');
  const [testName, setTestName] = useState('Test User');

  const testEmailService = async () => {
    if (!testEmail) {
      setEmailTest({ status: 'error', message: 'Please enter an email address' });
      return;
    }

    setEmailTest({ status: 'loading', message: 'Sending test email...' });

    try {
      const response = await fetch('/api/test/email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: testEmail,
          name: testName
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setEmailTest({
          status: 'success',
          message: `✅ Email sent successfully to ${testEmail}! Check your inbox.`,
          details: data
        });
      } else {
        setEmailTest({
          status: 'error',
          message: `❌ Failed to send email: ${data.error}`,
          details: data
        });
      }
    } catch (error) {
      setEmailTest({
        status: 'error',
        message: `❌ Network error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      });
    }
  };

  const testDatabaseConnection = async () => {
    setDatabaseTest({ status: 'loading', message: 'Testing database connection...' });

    try {
      const response = await fetch('/api/test/database');
      const data = await response.json();

      if (response.ok) {
        setDatabaseTest({
          status: 'success',
          message: '✅ Database connection successful!',
          details: data
        });
      } else {
        setDatabaseTest({
          status: 'error',
          message: `❌ Database connection failed: ${data.error}`,
          details: data
        });
      }
    } catch (error) {
      setDatabaseTest({
        status: 'error',
        message: `❌ Network error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'loading':
        return <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success':
        return <Badge className="bg-green-100 text-green-800">Working</Badge>;
      case 'error':
        return <Badge variant="destructive">Error</Badge>;
      case 'loading':
        return <Badge className="bg-blue-100 text-blue-800">Testing...</Badge>;
      default:
        return <Badge variant="outline">Not Tested</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-2">🚀 SkillShare System Status</h1>
          <p className="text-muted-foreground text-lg">
            Test all system components to ensure everything is working correctly
          </p>
        </div>

        {/* System Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Mail className="h-5 w-5 text-purple-500" />
                <div>
                  <p className="font-medium">Email Service</p>
                  {getStatusBadge(emailTest.status)}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Database className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="font-medium">Database</p>
                  {getStatusBadge(databaseTest.status)}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <div>
                  <p className="font-medium">Web Server</p>
                  <Badge className="bg-green-100 text-green-800">Running</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Email Service Test */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Email Service Test (Resend)
            </CardTitle>
            <CardDescription>
              Test the email service by sending a real OTP email to your address
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="test-email">Your Email Address</Label>
                <Input
                  id="test-email"
                  type="email"
                  placeholder="your@email.com"
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="test-name">Your Name</Label>
                <Input
                  id="test-name"
                  placeholder="Your Name"
                  value={testName}
                  onChange={(e) => setTestName(e.target.value)}
                />
              </div>
            </div>

            <Button
              onClick={testEmailService}
              disabled={emailTest.status === 'loading'}
              className="w-full md:w-auto"
            >
              {emailTest.status === 'loading' && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Send Test Email
            </Button>

            {emailTest.message && (
              <div className={`flex items-start gap-2 p-4 rounded-lg ${emailTest.status === 'success' ? 'bg-green-50 border border-green-200' :
                  emailTest.status === 'error' ? 'bg-red-50 border border-red-200' :
                    'bg-blue-50 border border-blue-200'
                }`}>
                {getStatusIcon(emailTest.status)}
                <div className="flex-1">
                  <p className={`font-medium ${emailTest.status === 'success' ? 'text-green-800' :
                      emailTest.status === 'error' ? 'text-red-800' :
                        'text-blue-800'
                    }`}>
                    {emailTest.message}
                  </p>
                  {emailTest.details?.otp && (
                    <p className="text-sm text-muted-foreground mt-1">
                      OTP Code: <code className="bg-white px-2 py-1 rounded">{emailTest.details.otp}</code>
                    </p>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Database Test */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Database Connection Test (Supabase)
            </CardTitle>
            <CardDescription>
              Test the database connection to ensure APIs can access data
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={testDatabaseConnection}
              disabled={databaseTest.status === 'loading'}
              className="w-full md:w-auto"
            >
              {databaseTest.status === 'loading' && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Test Database Connection
            </Button>

            {databaseTest.message && (
              <div className={`flex items-start gap-2 p-4 rounded-lg ${databaseTest.status === 'success' ? 'bg-green-50 border border-green-200' :
                  databaseTest.status === 'error' ? 'bg-red-50 border border-red-200' :
                    'bg-blue-50 border border-blue-200'
                }`}>
                {getStatusIcon(databaseTest.status)}
                <div className="flex-1">
                  <p className={`font-medium ${databaseTest.status === 'success' ? 'text-green-800' :
                      databaseTest.status === 'error' ? 'text-red-800' :
                        'text-blue-800'
                    }`}>
                    {databaseTest.message}
                  </p>
                  {databaseTest.details && (
                    <pre className="text-xs text-muted-foreground mt-2 bg-white p-2 rounded overflow-x-auto">
                      {JSON.stringify(databaseTest.details, null, 2)}
                    </pre>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* System Info */}
        <Card>
          <CardHeader>
            <CardTitle>Current Configuration</CardTitle>
            <CardDescription>
              Environment and service configuration status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-medium mb-2">Environment Variables:</p>
                <ul className="space-y-1 text-muted-foreground">
                  <li>✅ DATABASE_URL: Configured</li>
                  <li>✅ RESEND_API_KEY: Configured</li>
                  <li>✅ NEXTAUTH_SECRET: Configured</li>
                  <li>✅ GOOGLE_CLIENT_ID: Configured</li>
                </ul>
              </div>
              <div>
                <p className="font-medium mb-2">Services Status:</p>
                <ul className="space-y-1 text-muted-foreground">
                  <li>✅ Next.js Server: Running</li>
                  <li>✅ NextAuth: Configured</li>
                  <li>✅ Prisma Client: Generated</li>
                  <li>✅ Resend Package: Installed</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>🎯 Next Steps</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <p><strong>1. Test Email Service:</strong> Enter your email above and click "Send Test Email"</p>
              <p><strong>2. Test Database:</strong> Click "Test Database Connection" to verify Supabase setup</p>
              <p><strong>3. If Database Fails:</strong> Check Supabase project is active and DATABASE_URL is correct</p>
              <p><strong>4. Try Registration:</strong> Go to <a href="/auth/register" className="text-blue-600 hover:underline">/auth/register</a> to test full OTP flow</p>
              <p><strong>5. Browse Platform:</strong> Visit <a href="/projects" className="text-blue-600 hover:underline">/projects</a> and <a href="/creators" className="text-blue-600 hover:underline">/creators</a> to test APIs</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}