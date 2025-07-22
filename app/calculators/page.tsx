import {
  BecomeCrorepatiCalculator,
  SipReturnCalculator,
  RetirementPlanningCalculator,
  AssetAllocationCalculator,
  SwpCalculator,
  EmiCalculator,
  PpfCalculator,
  EpfCalculator,
  GoalSettingCalculator,
  CompositeFinancialGoalCalculator,
  ChildrenEducationPlanner,
  NetworthCalculator,
  CompoundingCalculator,
  SpendingLessCalculator,
  HumanLifeValueCalculator,
  SipStepUpCalculator,
} from './components';
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <BecomeCrorepatiCalculator />
            <SipReturnCalculator />
            <RetirementPlanningCalculator />
            <AssetAllocationCalculator />
            <SwpCalculator />
            <EmiCalculator />
            <PpfCalculator />
            <EpfCalculator />
            <GoalSettingCalculator />
            <CompositeFinancialGoalCalculator />
            <ChildrenEducationPlanner />
            <NetworthCalculator />
            <CompoundingCalculator />
            <SpendingLessCalculator />
            <HumanLifeValueCalculator />
            <SipStepUpCalculator />
          </div>
        </div>
      </section>
    </div>
  );
}
