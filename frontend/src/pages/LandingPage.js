import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Users, CreditCard, Video, CheckCircle, Star } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="heading-1 mb-6">
            Where Teachers Build Their Future
          </h1>
          <p className="body-large mb-8" style={{ color: 'var(--text-secondary)' }}>
            The teacher-first platform helping individual educators go online, reach students, and earn sustainably — without becoming a marketing expert.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup" className="btn-primary">
              Start Teaching Online
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
            <Link to="/teachers" className="btn-secondary">
              Find a Teacher
            </Link>
          </div>
        </div>
      </section>

      {/* The Problem Section */}
      <section className="py-20" style={{ background: 'var(--bg-section)' }}>
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="heading-2 mb-6">The Challenge Every Teacher Faces</h2>
            <p className="body-large mb-8">
              Millions of talented teachers want to teach online, but:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="product-card text-center">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ background: 'var(--accent-wash)' }}>
                  <Users className="w-6 h-6" style={{ color: 'var(--accent-text)' }} />
                </div>
                <h3 className="heading-3 mb-2">Don't know where to start</h3>
                <p className="body-small">Going online feels overwhelming without technical expertise</p>
              </div>
              <div className="product-card text-center">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ background: 'var(--accent-wash)' }}>
                  <CreditCard className="w-6 h-6" style={{ color: 'var(--accent-text)' }} />
                </div>
                <h3 className="heading-3 mb-2">Tools, not growth</h3>
                <p className="body-small">Platforms give software but not students or revenue</p>
              </div>
              <div className="product-card text-center">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ background: 'var(--accent-wash)' }}>
                  <Video className="w-6 h-6" style={{ color: 'var(--accent-text)' }} />
                </div>
                <h3 className="heading-3 mb-2">Uncertain income</h3>
                <p className="body-small">Great teachers stay invisible with inconsistent earnings</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="heading-2 text-center mb-6">You Teach. We Support Everything Around It.</h2>
            <p className="body-large text-center mb-12" style={{ color: 'var(--text-secondary)' }}>
              Aumryx Teach gives teachers a simple, professional way to teach online — while we handle the platform, structure, and trust.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex gap-4">
                <CheckCircle className="w-6 h-6 flex-shrink-0" style={{ color: 'var(--accent-strong)' }} />
                <div>
                  <h3 className="heading-3 mb-2">Verified Professional Profile</h3>
                  <p className="body-small">Build credibility with a verified profile showcasing your expertise and experience</p>
                </div>
              </div>
              <div className="flex gap-4">
                <CheckCircle className="w-6 h-6 flex-shrink-0" style={{ color: 'var(--accent-strong)' }} />
                <div>
                  <h3 className="heading-3 mb-2">Transparent Pricing</h3>
                  <p className="body-small">Set your own rates and keep earnings clear and predictable</p>
                </div>
              </div>
              <div className="flex gap-4">
                <CheckCircle className="w-6 h-6 flex-shrink-0" style={{ color: 'var(--accent-strong)' }} />
                <div>
                  <h3 className="heading-3 mb-2">Seamless Online Classes</h3>
                  <p className="body-small">Conduct classes using Zoom or Google Meet with easy scheduling</p>
                </div>
              </div>
              <div className="flex gap-4">
                <CheckCircle className="w-6 h-6 flex-shrink-0" style={{ color: 'var(--accent-strong)' }} />
                <div>
                  <h3 className="heading-3 mb-2">Secure Payments</h3>
                  <p className="body-small">Receive payments directly with trusted, secure processing</p>
                </div>
              </div>
              <div className="flex gap-4">
                <CheckCircle className="w-6 h-6 flex-shrink-0" style={{ color: 'var(--accent-strong)' }} />
                <div>
                  <h3 className="heading-3 mb-2">Student Discovery</h3>
                  <p className="body-small">Students find you based on subject, experience, and authentic reviews</p>
                </div>
              </div>
              <div className="flex gap-4">
                <CheckCircle className="w-6 h-6 flex-shrink-0" style={{ color: 'var(--accent-strong)' }} />
                <div>
                  <h3 className="heading-3 mb-2">Long-term Growth</h3>
                  <p className="body-small">Build sustainable income with recurring students and reputation</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20" style={{ background: 'var(--bg-section)' }}>
        <div className="container mx-auto px-4">
          <h2 className="heading-2 text-center mb-12">How It Works</h2>
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '1', title: 'Create Profile', desc: 'Sign up and create your verified teacher profile with subjects and experience' },
              { step: '2', title: 'List Classes', desc: 'Set your pricing, availability, and class details. Students can discover you' },
              { step: '3', title: 'Teach & Earn', desc: 'Conduct online classes and receive secure payments directly' }
            ].map((item, idx) => (
              <div key={idx} className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center text-2xl font-bold" style={{ background: 'var(--gradient-button)', color: 'white' }}>
                  {item.step}
                </div>
                <h3 className="heading-3 mb-2">{item.title}</h3>
                <p className="body-small">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="heading-2 text-center mb-12">Trusted by Educators</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              { name: 'Dr. Priya Sharma', role: 'Mathematics Teacher', quote: 'Finally, a platform that respects teachers as professionals. My earnings have tripled since joining.' },
              { name: 'Rahul Verma', role: 'English Educator', quote: 'No more chasing students or worrying about payments. I can focus on what I do best - teaching.' },
              { name: 'Anjali Desai', role: 'Science Coach', quote: 'The verification system helps students trust me instantly. My class bookings have never been better.' }
            ].map((testimonial, idx) => (
              <div key={idx} className="product-card">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" style={{ color: 'var(--accent-strong)' }} />
                  ))}
                </div>
                <p className="body-small mb-4" style={{ fontStyle: 'italic' }}>"{testimonial.quote}"</p>
                <div>
                  <p className="font-semibold body-small" style={{ color: 'var(--text-primary)' }}>{testimonial.name}</p>
                  <p className="caption">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20" style={{ background: 'var(--gradient-hero)' }}>
        <div className="container mx-auto px-4 text-center">
          <h2 className="heading-2 mb-6">Ready to Build Your Teaching Future?</h2>
          <p className="body-large mb-8" style={{ color: 'var(--text-secondary)' }}>
            Join Aumryx Teach today and start earning from your expertise
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup" className="btn-primary">
              Get Started as Teacher
            </Link>
            <Link to="/teachers" className="btn-secondary">
              Browse Teachers
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;