import React from "react";

function RefundPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 pt-28 sm:px-6 lg:px-8">
      <div className="prose prose-lg max-w-none">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Refund, Subscription, and Workshop Policy
        </h1>
        <p className="text-sm text-gray-600 mb-8">
          Last Updated on May 8th, 2025
        </p>

        <div className="space-y-6 text-gray-700 leading-relaxed">
          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
            1. Money-Back Guarantee & Subscription Policy
          </h2>

          <p className="mb-4">
            To qualify for a Money-Back Guarantee, you must meet the following
            conditions:
          </p>

          <div className="space-y-4">
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Active Enrollment & Commitment
              </h3>
              <p>
                Enroll in the course and commit to completing all study modules,
                attending live sessions, and engaging in assignments and
                projects.
              </p>
            </div>

            <div className="bg-green-50 border-l-4 border-green-400 p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Course Completion
              </h3>
              <p>
                Successfully complete all required modules, evaluations, and
                practical work/projects, including passing the internal
                evaluation.
              </p>
            </div>

            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Career Engagement
              </h3>
              <p>
                Demonstrate efforts to apply the course learnings, such as job
                applications or networking.
              </p>
            </div>

            <div className="bg-red-50 border-l-4 border-red-400 p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No Interruptions
              </h3>
              <p>
                Avoid suspending or dropping out midway. Extended breaks without
                prior consultation will disqualify you from the guarantee.
              </p>
            </div>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Refund Eligibility
            </h3>
            <p>
              If you meet all these conditions but still do not experience
              tangible career benefits, you may request a refund.
            </p>
          </div>

          <div className="bg-orange-50 border-l-4 border-orange-400 p-4 mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Subscription Payments
            </h3>
            <p>
              <strong>
                Once a subscription payment is processed, it is final and
                non-refundable.
              </strong>
              This policy applies to all subscription-based payments made for
              the use of our tools or services.
            </p>
          </div>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
            2. Workshop & Batch Change Policy
          </h2>

          <div className="space-y-4">
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Batch Change
              </h3>
              <p className="mb-3">
                Request a batch change at least{" "}
                <strong>48 hours before the course starts</strong>.
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>
                  If the new batch has a higher fee, you will need to pay the
                  difference
                </li>
                <li>
                  If it has a lower fee, a credit note will be issued for future
                  use
                </li>
              </ul>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Candidate Transfer
              </h3>
              <p className="mb-3">
                Transfer your enrollment to another person at least{" "}
                <strong>48 hours before the course starts</strong>.
              </p>
              <p>
                <strong>Important:</strong> The completion certificate will be
                issued only to the attending candidate.
              </p>
            </div>
          </div>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
            Important Notes
          </h2>

          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <ul className="space-y-3">
              <li className="flex items-start">
                <span className="text-red-500 font-bold mr-2">•</span>
                <span>
                  All refund eligibility requires meeting the above conditions.
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-red-500 font-bold mr-2">•</span>
                <span>
                  Batch changes and transfers must be requested 48 hours before
                  the course start date.
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-red-500 font-bold mr-2">•</span>
                <span>
                  <strong>Subscription payments are non-refundable.</strong>
                </span>
              </li>
            </ul>
          </div>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
            How to Request Changes or Refunds
          </h2>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Process
            </h3>
            <ol className="list-decimal list-inside space-y-2">
              <li>Review the eligibility criteria above</li>
              <li>Ensure you meet all required conditions</li>
              <li>Contact our support team with your request</li>
              <li>Provide necessary documentation and proof of completion</li>
              <li>Allow 5-7 business days for review and processing</li>
            </ol>
          </div>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
            Contact Information
          </h2>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
            <p className="mb-4">
              For inquiries or assistance regarding refunds, batch changes, or
              transfers, please contact:
            </p>
            <div className="space-y-2">
              <p className="font-semibold">
                Email:{" "}
                <a
                  href="mailto:support@springpad.in"
                  className="text-blue-600 hover:underline"
                >
                  support@springpad.in
                </a>
              </p>
              <p className="text-sm text-gray-600">
                Response time: Within 24 hours during business days
              </p>
            </div>
          </div>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
            Policy Updates
          </h2>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <p>
              This policy may be updated from time to time. Any changes will be
              communicated via email and updated on this page. The &quot;Last
              Updated&quot; date at the top of this page indicates when the most
              recent changes were made.
            </p>
          </div>

          <div className="mt-8 text-center">
            <p className="text-lg font-semibold text-gray-900">
              SpringPad E-Learning LLP
            </p>
            <p className="text-gray-600">
              Committed to your learning journey and career success
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RefundPolicyPage;
