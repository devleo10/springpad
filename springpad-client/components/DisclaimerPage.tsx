"use client";

import React, { useState } from "react";
import { Info } from "lucide-react";
import { Card } from "@/components/ui/Card"; 
import clsx from "clsx";

const BadgeIcon: React.FC = () => (
  <div className="bg-yellow-100 text-yellow-800 p-3 rounded-full inline-flex">
    <Info className="w-6 h-6" />
  </div>
);

interface PillButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "solid" | "outline" | "link";
}

const PillButton: React.FC<PillButtonProps> = ({
  children,
  variant = "solid",
  disabled,
  className,
  ...rest
}) => {
  const base = "font-semibold rounded-md transition flex items-center gap-1 focus:outline-none focus:ring-2 focus:ring-offset-1";
  const variants = {
    solid: clsx(
      "px-4 py-2",
      disabled
        ? "bg-yellow-200 text-yellow-800 cursor-not-allowed"
        : "bg-yellow-400 text-gray-900 hover:bg-yellow-500"
    ),
    outline: clsx(
      "px-4 py-2 border-2",
      disabled
        ? "border-yellow-200 text-yellow-200 cursor-not-allowed"
        : "border-yellow-400 text-yellow-600 hover:bg-yellow-50"
    ),
    link: clsx("px-0 py-0 text-yellow-600 hover:underline"),
  };

  return (
    <button
      disabled={disabled}
      className={clsx(base, variants[variant], className)}
      {...rest}
    >
      {children}
    </button>
  );
};

const DisclaimerPage: React.FC = () => {
  const [expanded, setExpanded] = useState(false);
  const [acknowledged, setAcknowledged] = useState(false);

  return (
    <div className="pt-20 pb-10 p-6">
      <Card className="max-w-4xl mx-auto my-8 rounded-2xl ring-1 ring-yellow-300 border border-yellow-200">
        <Card.Content className="flex flex-col md:flex-row gap-6 p-6 md:p-8">
          <div className="flex-shrink-0">
            <BadgeIcon />
          </div>

          <div className="flex-grow">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex-1 min-w-0">
                <h2 className="text-2xl font-semibold text-yellow-600 leading-tight">
                  Investment Disclaimer
                </h2>
                <p className="mt-1 text-sm text-gray-600 truncate">
                  Please review before proceeding with your investments.
                </p>
              </div>
              <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
                <PillButton
                  variant="outline"
                  onClick={() => setExpanded((e) => !e)}
                  aria-expanded={expanded}
                  aria-label="toggle details"
                >
                  {expanded ? "Show Less" : "Read More"}
                </PillButton>
                <PillButton
                  onClick={() => setAcknowledged(true)}
                  disabled={acknowledged}
                  variant="solid"
                >
                  {acknowledged ? "Acknowledged" : "Acknowledge"}
                </PillButton>
              </div>
            </div>

            <div className="mt-4 text-sm text-gray-700 space-y-3">
              <p>
                Investments in mutual funds and other financial instruments are
                subject to market risks. Past performance does not guarantee
                future results. SpringPad provides personalized recommendations
                driven by AI, but all investment decisions are ultimately made by
                the investor.
              </p>

              {expanded && (
                <div className="space-y-2">
                  <p>
                    The value of your investments may fluctuate based on market
                    conditions, economic events, or other unforeseen factors. You
                    should read the scheme documents carefully and consider your
                    risk tolerance before committing capital.
                  </p>
                  <p>
                    SpringPad aims for transparency and does not guarantee returns.
                    We are not responsible for losses incurred, and the user
                    agrees to accept full responsibility for their investment
                    choices.
                  </p>
                  <p className="text-xs text-gray-500">
                    For full legal terms, see our{" "}
                    <a
                      className="underline font-medium text-yellow-600"
                      href="/legal/investment-disclaimer"
                    >
                      Investment Disclaimer
                    </a>{" "}
                    and{" "}
                    <a
                      className="underline font-medium text-yellow-600"
                      href="/legal/terms-of-use"
                    >
                      Terms of Use
                    </a>
                    .
                  </p>
                </div>
              )}
            </div>

            <div className="mt-6 flex flex-col sm:flex-row sm:justify-between items-start gap-4">
              <div className="text-xs text-gray-500">
                © {new Date().getFullYear()} SpringPad. All rights reserved. SEBI
                Registered • ISO 27001 Certified
              </div>
              <div className="flex flex-wrap gap-3">
                <PillButton
                  onClick={() => {
                    if (typeof window !== "undefined") {
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }
                  }}
                  variant="solid"
                >
                  Go to Top
                </PillButton>
                <PillButton
                  variant="link"
                  onClick={() => {
                    if (typeof window !== "undefined") {
                      window.open("/support/help-center", "_blank", "noopener");
                    }
                  }}
                >
                  Help Center
                </PillButton>
              </div>
            </div>
          </div>
        </Card.Content>

        {!acknowledged && (
          <div className="border-t border-yellow-200 px-6 py-3 bg-white flex flex-col sm:flex-row justify-between items-center gap-3">
            <div className="text-sm text-gray-600">
              By continuing, you acknowledge that you have read and understood
              this disclaimer.
            </div>
            <div>
              <PillButton onClick={() => setAcknowledged(true)} variant="solid">
                I Understand
              </PillButton>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default DisclaimerPage;
