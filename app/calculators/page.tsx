import {Footer} from '@/components/Footer';
import { Navbar } from '@/components/Navbar';

export default function CalculatorsPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <section className="bg-transparent relative overflow-hidden">
        {/* Seamless Background Video */}
        <video
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out"
          src="/heroVid.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          style={{
            background: 'black',
            opacity: 0.95,
            zIndex: 0,
          }}
        />
        {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative max-w-7xl mx-auto px-6 py-16 lg:py-24 z-10">
          <h1 className="text-3xl font-bold mb-6 text-white">All Calculators</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {[
              { title: 'Become Crorepati Calculator', description: 'Plan how to become a crorepati.' },
              { title: 'SIP Return Calculator', description: 'Estimate returns on systematic investment plan.' },
              { title: 'Retirement Planning Calculator', description: 'Plan your retirement corpus.' },
              { title: 'Asset Allocation Calculator', description: 'Determine optimal asset allocation.' },
              { title: 'SWP Calculator', description: 'Calculate systematic withdrawal plan.' },
              { title: 'EMI Calculator', description: 'Calculate your equated monthly installment.' },
              { title: 'PPF Calculator', description: 'Estimate returns from PPF investments.' },
              { title: 'EPF Calculator', description: 'Estimate EPF retirement benefits.' },
              { title: 'Goal Setting Calculator', description: 'Set and track your financial goals.' },
              { title: 'Composite Financial Goal Calculator', description: 'Plan multiple financial goals together.' },
              { title: 'Children Education Planner', description: 'Plan for child education expenses.' },
              { title: 'Networth Calculator', description: 'Calculate your net worth.' },
              { title: 'Compounding Calculator', description: 'Calculate compound interest growth.' },
              { title: 'Spending Less Calculator', description: 'Plan for reducing your expenditures.' },
              { title: 'Human Life Value Calculator', description: 'Estimate your human life value.' },
              { title: 'SIP Step-up Calculator', description: 'Calculate step-up SIP returns.' },
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col justify-between bg-transparent backdrop-blur-lg border border-white/20 rounded-xl p-6 shadow-xl aspect-square text-white">
                <div>
                  <h2 className="text-2xl font-bold mb-2">{item.title}</h2>
                  <p>{item.description}</p>
                </div>
                <button className="mt-4 self-start py-2 px-4 bg-yellow-600 hover:bg-yellow-700 rounded text-white font-semibold">
                  Calculate Now
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Footer/>
    </div>
  );
}
