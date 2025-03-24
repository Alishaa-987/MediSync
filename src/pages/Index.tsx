
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BarChart4, Calendar, Clock, Shield, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import FadeIn from '@/components/animations/FadeIn';
import { useAuth } from '@/context/AuthContext';

const Index = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-hms-50/50 to-white">
      {/* Hero Section */}
      <section className="py-12 md:py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center">
            <div className="md:w-1/2 md:pr-12">
              <FadeIn delay={100}>
                <div className="inline-flex items-center rounded-full border px-4 py-1 text-sm font-medium mb-6">
                  <div className="bg-hms-500 rounded-full w-2 h-2 mr-2" />
                  Hospital Management Solution
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
                  Modern Healthcare <br /> Made <span className="text-hms-600">Simple</span>
                </h1>
                <p className="text-lg text-muted-foreground mb-8 max-w-md">
                  Streamline your hospital operations with our comprehensive management system designed for healthcare professionals.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button asChild size="lg" className="bg-hms-600 hover:bg-hms-700">
                    <Link to={isAuthenticated ? "/dashboard" : "/login"}>
                      {isAuthenticated ? "Go to Dashboard" : "Get Started"}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg">
                    <Link to="#">
                      Learn More
                    </Link>
                  </Button>
                </div>
              </FadeIn>
            </div>
            <div className="md:w-1/2 mt-12 md:mt-0">
              <FadeIn delay={300} direction="left">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-hms-200 to-hms-100 rounded-2xl transform rotate-3 scale-95 -z-10" />
                  <img 
                    src="https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                    alt="Hospital Dashboard" 
                    className="rounded-2xl shadow-lg w-full"
                  />
                </div>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <FadeIn>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight mb-4">Comprehensive Features</h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Everything you need to efficiently manage your healthcare facility in one integrated platform
              </p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard 
              icon={<Users className="h-6 w-6 text-hms-600" />}
              title="Patient Management"
              description="Add, edit, and search patient records with ease. Track medical history and streamline patient care."
              delay={100}
            />
            <FeatureCard 
              icon={<Calendar className="h-6 w-6 text-hms-600" />}
              title="Appointment System"
              description="Efficiently manage and schedule appointments. Allow patients to request times and doctors to approve."
              delay={200}
            />
            <FeatureCard 
              icon={<BarChart4 className="h-6 w-6 text-hms-600" />}
              title="Analytics Dashboard"
              description="Gain insights with comprehensive analytics and reporting tools for better decision making."
              delay={300}
            />
            <FeatureCard 
              icon={<Shield className="h-6 w-6 text-hms-600" />}
              title="Security & Privacy"
              description="Role-based access control ensures that sensitive data is only accessible to authorized personnel."
              delay={400}
            />
            <FeatureCard 
              icon={<Clock className="h-6 w-6 text-hms-600" />}
              title="Real-time Updates"
              description="Get instant notifications and updates about appointments, patient status, and more."
              delay={500}
            />
            <FeatureCard 
              icon={<ArrowRight className="h-6 w-6 text-hms-600" />}
              title="And Much More"
              description="Explore all the features designed to make hospital management efficient and effective."
              delay={600}
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <FadeIn>
            <Card className="bg-hms-900 text-white border-none overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-r from-hms-800 to-hms-900 opacity-90" />
              <CardContent className="relative z-10 p-8 md:p-12">
                <div className="max-w-3xl">
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">
                    Ready to transform your healthcare management?
                  </h2>
                  <p className="text-hms-100 mb-8 text-lg">
                    Join thousands of healthcare facilities that have streamlined their operations with our comprehensive system.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button asChild size="lg" className="bg-white text-hms-900 hover:bg-gray-100">
                      <Link to={isAuthenticated ? "/dashboard" : "/login"}>
                        {isAuthenticated ? "Go to Dashboard" : "Get Started"}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                    <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
                      <Link to="#">
                        Contact Sales
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </FadeIn>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-6 md:mb-0">
              <div className="w-8 h-8 rounded-md bg-hms-600 flex items-center justify-center text-white font-bold text-xl mr-2">
                H
              </div>
              <span className="font-semibold text-lg">Hospitalia</span>
            </div>
            <div className="flex space-x-6">
              <FooterLink href="#" text="About" />
              <FooterLink href="#" text="Features" />
              <FooterLink href="#" text="Pricing" />
              <FooterLink href="#" text="Contact" />
            </div>
          </div>
          <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} Hospitalia. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay?: number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, delay = 0 }) => (
  <FadeIn delay={delay}>
    <Card className="border-border/40 hover:shadow-md transition-shadow h-full">
      <CardContent className="p-6">
        <div className="mb-4">{icon}</div>
        <h3 className="text-lg font-medium mb-2">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  </FadeIn>
);

interface FooterLinkProps {
  href: string;
  text: string;
}

const FooterLink: React.FC<FooterLinkProps> = ({ href, text }) => (
  <a href={href} className="text-muted-foreground hover:text-foreground transition-colors">
    {text}
  </a>
);

export default Index;
