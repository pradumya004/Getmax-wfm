import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { 
  ArrowRight, 
  Shield, 
  Zap, 
  BarChart3, 
  Users, 
  CheckCircle, 
  Star,
  Award,
  Clock,
  Target,
  TrendingUp,
  Workflow,
  Trophy
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';

const modules = [
  {
    icon: Workflow,
    title: 'Workflow Management',
    description: 'Streamline your RCM processes with intelligent automation and real-time tracking.',
    color: 'from-[#39ff14] to-[#00ff88]'
  },
  {
    icon: CheckCircle,
    title: 'Quality Management',
    description: 'Ensure accuracy with AI-powered QA audits and comprehensive scoring systems.',
    color: 'from-[#00ff88] to-[#39ff14]'
  },
  {
    icon: Clock,
    title: 'SLA & Timer Engine',
    description: 'Monitor compliance with real-time SLA tracking and automated escalations.',
    color: 'from-[#39ff14] to-[#00ff88]'
  },
  {
    icon: Target,
    title: 'Claim Allocation',
    description: 'Smart claim distribution based on priority, aging, and team capacity.',
    color: 'from-[#00ff88] to-[#39ff14]'
  },
  {
    icon: Trophy,
    title: 'Gamification Engine',
    description: 'Boost engagement with XP tracking, badges, and competitive leaderboards.',
    color: 'from-[#39ff14] to-[#00ff88]'
  },
  {
    icon: TrendingUp,
    title: 'Revenue Dashboard',
    description: 'Real-time insights into productivity, revenue, and performance metrics.',
    color: 'from-[#00ff88] to-[#39ff14]'
  }
];

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'RCM Director',
    company: 'MedCare Solutions',
    content: 'GetMax transformed our revenue cycle. 40% increase in productivity and 99.2% SLA compliance.',
    rating: 5
  },
  {
    name: 'Dr. Michael Chen',
    role: 'Practice Manager',
    company: 'Elite Healthcare',
    content: 'The gamification features boosted our team morale while maintaining exceptional quality scores.',
    rating: 5
  },
  {
    name: 'Lisa Rodriguez',
    role: 'Operations VP',
    company: 'BillPro Services',
    content: 'Real-time analytics and automated workflows reduced our claim processing time by 60%.',
    rating: 5
  }
];

const complianceBadges = [
  { name: 'HIPAA', icon: Shield },
  { name: 'SOC2', icon: Award },
  { name: 'ISO 27001', icon: CheckCircle }
];

export default function Homepage() {
  const { toast } = useToast();

  const handleDemo = () => {
    toast({
      title: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀"
    });
  };

  const handleTrial = () => {
    toast({
      title: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀"
    });
  };

  return (
    <>
      <Helmet>
        <title>GetMax RCM - AI-Powered Revenue Cycle Management Platform</title>
        <meta name="description" content="Automate Your RCM Operations with Confidence – Workforce, Quality & Revenue Management, All in One Platform. HIPAA compliant, SOC2 certified." />
      </Helmet>

      <div className="min-h-screen">
        {/* Navigation */}
        <nav className="fixed top-0 w-full z-50 bg-glass-dark border-b border-[#39ff14]/20">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-gradient-to-r from-[#39ff14] to-[#00ff88] rounded-lg flex items-center justify-center">
                  <span className="text-black font-bold">GM</span>
                </div>
                <span className="text-2xl font-bold gradient-text">GetMax RCM</span>
              </div>
              
              <div className="hidden md:flex items-center space-x-8">
                <a href="#features" className="text-gray-300 hover:text-[#39ff14] transition-colors">Features</a>
                <a href="#testimonials" className="text-gray-300 hover:text-[#39ff14] transition-colors">Testimonials</a>
                <a href="#compliance" className="text-gray-300 hover:text-[#39ff14] transition-colors">Compliance</a>
                <Link to="/login">
                  <Button variant="outline" className="border-[#39ff14] text-[#39ff14] hover:bg-[#39ff14] hover:text-black">
                    Login
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="pt-32 pb-20 px-6">
          <div className="max-w-7xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl md:text-7xl font-bold mb-6">
                <span className="gradient-text">Automate Your RCM Ops</span>
                <br />
                <span className="text-white">with Confidence</span>
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-4xl mx-auto">
                Workforce, Quality & Revenue Management, All in One Platform. 
                Built for RCM vendors, billing companies, and healthcare providers.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <Button 
                  size="lg" 
                  className="bg-[#39ff14] text-black hover:bg-[#00ff88] glow-green-intense text-lg px-8 py-6"
                  onClick={handleDemo}
                >
                  Book a Demo
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-[#39ff14] text-[#39ff14] hover:bg-[#39ff14] hover:text-black text-lg px-8 py-6"
                  onClick={handleTrial}
                >
                  Start Free Trial
                </Button>
              </div>

              {/* Hero Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
                {[
                  { label: 'SLA Compliance', value: '99.2%' },
                  { label: 'Productivity Boost', value: '40%' },
                  { label: 'Processing Speed', value: '60%' },
                  { label: 'Client Satisfaction', value: '98%' }
                ].map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="text-center"
                  >
                    <div className="text-3xl font-bold text-[#39ff14] text-glow">{stat.value}</div>
                    <div className="text-gray-400 text-sm">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 px-6">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                <span className="gradient-text">Powerful Modules</span>
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Comprehensive suite of tools designed to optimize every aspect of your revenue cycle management
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {modules.map((module, index) => (
                <motion.div
                  key={module.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="bg-glass-dark border-[#39ff14]/20 hover-glow h-full">
                    <CardHeader>
                      <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${module.color} flex items-center justify-center mb-4`}>
                        <module.icon className="h-6 w-6 text-black" />
                      </div>
                      <CardTitle className="text-xl text-white">{module.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-gray-300">
                        {module.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="py-20 px-6 bg-black/20">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                <span className="gradient-text">Trusted by Industry Leaders</span>
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                See how GetMax RCM is transforming revenue cycle operations across healthcare organizations
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="bg-glass-dark border-[#39ff14]/20 hover-glow h-full">
                    <CardHeader>
                      <div className="flex items-center space-x-1 mb-4">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="h-5 w-5 fill-[#39ff14] text-[#39ff14]" />
                        ))}
                      </div>
                      <CardDescription className="text-gray-300 text-base italic">
                        "{testimonial.content}"
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div>
                        <p className="font-semibold text-white">{testimonial.name}</p>
                        <p className="text-sm text-[#39ff14]">{testimonial.role}</p>
                        <p className="text-sm text-gray-400">{testimonial.company}</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Compliance Section */}
        <section id="compliance" className="py-20 px-6">
          <div className="max-w-7xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                <span className="gradient-text">Enterprise-Grade Security</span>
              </h2>
              <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto">
                Your data is protected with industry-leading security standards and compliance certifications
              </p>

              <div className="flex flex-wrap justify-center gap-8">
                {complianceBadges.map((badge, index) => (
                  <motion.div
                    key={badge.name}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="flex flex-col items-center space-y-3"
                  >
                    <div className="w-20 h-20 bg-glass-dark border-2 border-[#39ff14]/30 rounded-full flex items-center justify-center glow-green">
                      <badge.icon className="h-10 w-10 text-[#39ff14]" />
                    </div>
                    <Badge variant="outline" className="border-[#39ff14] text-[#39ff14]">
                      {badge.name}
                    </Badge>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-6 bg-gradient-to-r from-[#39ff14]/10 to-[#00ff88]/10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                <span className="gradient-text">Ready to Transform Your RCM?</span>
              </h2>
              <p className="text-xl text-gray-300 mb-8">
                Join hundreds of healthcare organizations already using GetMax RCM to optimize their revenue cycle
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  className="bg-[#39ff14] text-black hover:bg-[#00ff88] glow-green-intense text-lg px-8 py-6"
                  onClick={handleDemo}
                >
                  Schedule Demo
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-[#39ff14] text-[#39ff14] hover:bg-[#39ff14] hover:text-black text-lg px-8 py-6"
                  onClick={handleTrial}
                >
                  Start Free Trial
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 px-6 border-t border-[#39ff14]/20">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-[#39ff14] to-[#00ff88] rounded-lg flex items-center justify-center">
                    <span className="text-black font-bold text-sm">GM</span>
                  </div>
                  <span className="text-xl font-bold gradient-text">GetMax RCM</span>
                </div>
                <p className="text-gray-400">
                  AI-powered revenue cycle management platform for healthcare organizations.
                </p>
              </div>
              
              <div>
                <span className="text-white font-semibold mb-4 block">Product</span>
                <div className="space-y-2">
                  <p className="text-gray-400">Features</p>
                  <p className="text-gray-400">Pricing</p>
                  <p className="text-gray-400">Integrations</p>
                  <p className="text-gray-400">API</p>
                </div>
              </div>
              
              <div>
                <span className="text-white font-semibold mb-4 block">Company</span>
                <div className="space-y-2">
                  <p className="text-gray-400">About</p>
                  <p className="text-gray-400">Careers</p>
                  <p className="text-gray-400">Blog</p>
                  <p className="text-gray-400">Press</p>
                </div>
              </div>
              
              <div>
                <span className="text-white font-semibold mb-4 block">Support</span>
                <div className="space-y-2">
                  <p className="text-gray-400">Help Center</p>
                  <p className="text-gray-400">Contact</p>
                  <p className="text-gray-400">Terms</p>
                  <p className="text-gray-400">Privacy</p>
                </div>
              </div>
            </div>
            
            <div className="border-t border-[#39ff14]/20 mt-8 pt-8 text-center">
              <p className="text-gray-400">
                © 2024 GetMax RCM. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}