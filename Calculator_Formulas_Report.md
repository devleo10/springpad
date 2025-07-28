# SpringPad Financial Calculators - Formula Reference Report

## Overview

This report documents all the mathematical formulas and calculations used in the SpringPad financial platform calculators. Each calculator serves a specific financial planning purpose and uses industry-standard formulas to provide accurate projections.

---

## Investment Calculators

### 1. SIP Return Calculator

**Purpose**: Calculate future value of Systematic Investment Plans (SIP)

**Primary Formula**:

```
FV = PMT × [((1 + r)^n - 1) / r] × (1 + r)
```

**Where**:

- FV = Future Value
- PMT = Monthly Investment Amount
- r = Monthly Interest Rate (Annual Rate ÷ 12)
- n = Total Number of Months (Years × 12)

**Additional Calculations**:

- Total Investment = PMT × n
- Total Returns = FV - Total Investment
- Return Percentage = (Total Returns / Total Investment) × 100
- Wealth Multiplier = FV / Total Investment

**Special Case**: When r = 0, FV = PMT × n

**Input Fields** (3 fields):

1. **Monthly Investment Amount (₹)** - Number field
   - Minimum: ₹500, Step: ₹500
   - Accepts: Positive numbers for monthly SIP amount
2. **Expected Annual Return (%)** - Number field
   - Range: 1% to 30%, Step: 0.5%
   - Accepts: Percentage return rate
3. **Investment Period (Years)** - Number field
   - Range: 1 to 50 years
   - Accepts: Investment duration in years

---

### 2. SIP Step-up Calculator

**Purpose**: Calculate future value of SIP with annual increments

**Formula Approach**: Year-by-year calculation with step-up

```
For each year:
SIP Amount = Previous Year SIP × (1 + Step-up Percentage)
```

**Yearly Calculation**:

```
Year FV = SIP Amount × [((1 + r)^12 - 1) / r] × (1 + r)
Total FV = Sum of all yearly FV compounded to final year
```

**Key Variables**:

- Initial SIP Amount
- Step-up Percentage (annual increase)
- Expected Return Rate
- Investment Period

**Input Fields** (4 fields):

1. **Initial SIP Amount (₹)** - Number field
   - Minimum: ₹500, Step: ₹500
   - Accepts: Starting monthly SIP amount
2. **Step-up Percentage (%)** - Number field
   - Range: 1% to 50%, Step: 1%
   - Accepts: Annual increase percentage in SIP
3. **Expected Annual Return (%)** - Number field
   - Range: 1% to 30%, Step: 0.5%
   - Accepts: Expected annual return rate
4. **Investment Period (Years)** - Number field
   - Range: 1 to 50 years
   - Accepts: Total investment duration

---

### 3. Become Crorepati Calculator

**Purpose**: Calculate time required to reach a target amount through SIP

**Time Calculation Formula**:

```
n = log(1 + (Target Amount × r) / PMT) / log(1 + r)
```

**Where**:

- n = Number of months required
- Target Amount = Desired corpus (e.g., 1 Crore)
- r = Monthly interest rate
- PMT = Monthly SIP amount

**Output Calculations**:

- Time in Years = n ÷ 12
- Total Investment = PMT × n
- Total Returns = Target Amount - Total Investment

**Input Fields** (3 fields):

1. **Monthly Investment Amount (₹)** - Number field
   - Minimum: ₹500, Step: ₹500
   - Accepts: Monthly SIP amount
2. **Expected Annual Return (%)** - Number field
   - Range: 1% to 30%, Step: 0.5%
   - Accepts: Expected annual return rate
3. **Target Amount (₹)** - Dropdown field
   - Options: 10 Lakh, 25 Lakh, 50 Lakh, 1 Crore, 2.5 Crore, 5 Crore, 10 Crore
   - Accepts: Predefined target wealth amounts

---

## Loan & EMI Calculators

### 4. EMI Calculator

**Purpose**: Calculate Equated Monthly Installments for loans

**EMI Formula**:

```
EMI = P × r × (1 + r)^n / ((1 + r)^n - 1)
```

**Where**:

- P = Principal loan amount
- r = Monthly interest rate (Annual Rate ÷ 12)
- n = Total number of months (Years × 12)

**Additional Calculations**:

- Total Amount = EMI × n
- Total Interest = Total Amount - Principal
- Interest Percentage = (Total Interest / Principal) × 100

**Special Case**: When r = 0, EMI = P / n

**Input Fields** (3 fields):

1. **Loan Amount (₹)** - Number field
   - Minimum: ₹50,000, Step: ₹50,000
   - Accepts: Principal loan amount
2. **Annual Interest Rate (%)** - Number field
   - Range: 5% to 20%, Step: 0.1%
   - Accepts: Annual interest rate
3. **Loan Tenure (Years)** - Number field
   - Range: 1 to 30 years
   - Accepts: Loan repayment period

---

## Retirement & Goal Planning

### 5. Retirement Planning Calculator

**Purpose**: Calculate corpus required for retirement and monthly SIP needed

**Future Expenses Calculation**:

```
Future Monthly Expenses = Current Expenses × (1 + Inflation Rate)^Years to Retirement
```

**Corpus Required**:

```
Corpus Required = Future Annual Expenses × 25
(Based on 4% withdrawal rule)
```

**Existing Savings Growth**:

```
Future Value = Present Value × (1 + Return Rate)^Years
```

**Monthly SIP Required**:

```
SIP = (Additional Corpus Needed × r) / ((1 + r)^n - 1) × (1 + r)
```

**Input Fields** (6 fields):

1. **Current Age** - Number field
   - Range: 18 to 65 years
   - Accepts: Current age of user
2. **Retirement Age** - Number field
   - Range: 50 to 75 years
   - Accepts: Desired retirement age
3. **Current Monthly Expenses (₹)** - Number field
   - Minimum: ₹10,000, Step: ₹5,000
   - Accepts: Current monthly living expenses
4. **Expected Inflation Rate (%)** - Number field
   - Range: 3% to 10%, Step: 0.5%
   - Accepts: Expected inflation rate
5. **Expected Annual Return (%)** - Number field
   - Range: 8% to 20%, Step: 0.5%
   - Accepts: Expected investment return rate
6. **Existing Retirement Savings (₹)** - Number field
   - Minimum: ₹0, Step: ₹50,000
   - Accepts: Current retirement corpus

---

### 6. PPF Calculator

**Purpose**: Calculate Public Provident Fund maturity amount

**Annual Calculation**:

```
For each year:
Interest = (Opening Balance + Contribution) × Interest Rate
Closing Balance = Opening Balance + Contribution + Interest
```

**Key Features**:

- 15-year mandatory lock-in period
- Maximum contribution: ₹1,50,000 per year
- Current interest rate: 7.1% (as of calculation)
- Tax benefits: EEE (Exempt-Exempt-Exempt)

**Extension Calculation** (if applicable):

```
Extended Balance = Maturity Amount × (1 + Interest Rate)^Extension Years
```

**Input Fields** (5 fields - varies by account type):

1. **Account Type** - Dropdown field
   - Options: "New PPF Account", "Existing PPF Account"
   - Accepts: Account status selection
2. **Current PPF Balance (₹)** - Number field (for existing accounts only)
   - Minimum: ₹0, Step: ₹1,000
   - Accepts: Existing PPF balance
3. **Account Age (Years)** - Number field (for existing accounts only)
   - Range: 0 to 14 years
   - Accepts: Years since account opening
4. **Annual Contribution (₹)** - Number field
   - Range: ₹500 to ₹1,50,000, Step: ₹500
   - Accepts: Annual PPF contribution amount
5. **Current PPF Interest Rate (%)** - Number field
   - Range: 5% to 12%, Step: 0.1%
   - Accepts: Current PPF interest rate
6. **Extension Period (Years)** - Number field
   - Range: 0 to 50 years
   - Accepts: Extension beyond 15 years

---

### 7. EPF Calculator

**Purpose**: Calculate Employee Provident Fund accumulation

**Contribution Structure**:

- Employee Contribution: 12% of basic salary
- Employer EPF Contribution: 3.67% of basic salary
- Employer Pension Contribution: 8.33% of basic salary

**Annual Calculation**:

```
EPF Balance += Employee Contribution + Employer EPF Contribution + Interest
Pension Balance += Employer Pension Contribution + Pension Interest
```

**Salary Ceiling**: Maximum ₹15,000 per month (₹1.8L annually) for EPF calculations

**Interest Rates**: Currently 8.15% for both EPF and EPS

**Input Fields** (7 fields):

1. **Current Annual Salary (₹)** - Number field
   - Minimum: ₹0, Step: ₹10,000
   - Accepts: Basic salary for EPF calculation
2. **Current Age** - Number field
   - Range: 18 to 58 years
   - Accepts: Current age of employee
3. **Retirement Age** - Number field
   - Range: Current Age+1 to 65 years
   - Accepts: Expected retirement age
4. **Annual Salary Increment (%)** - Number field
   - Range: 0% to 20%, Step: 0.5%
   - Accepts: Expected annual salary increase
5. **Employee Contribution (%)** - Number field
   - Fixed: 12% (non-editable)
   - Accepts: Employee's EPF contribution percentage
6. **Current EPF Balance (₹)** - Number field
   - Minimum: ₹0, Step: ₹1,000
   - Accepts: Existing EPF balance
7. **EPF Interest Rate (%)** - Number field
   - Range: 5% to 12%, Step: 0.1%
   - Accepts: Current EPF interest rate

---

## Withdrawal & Distribution

### 8. SWP Calculator (Systematic Withdrawal Plan)

**Purpose**: Calculate sustainability of regular withdrawals from investments

**Monthly Calculation Process**:

```
For each month:
1. Current Balance = Previous Balance × (1 + Monthly Return Rate)
2. New Balance = Current Balance - Monthly Withdrawal
```

**Sustainability Check**:

- Continue until balance reaches zero or target period ends
- Calculate total withdrawals possible
- Determine if plan is sustainable for desired period

**Maximum Withdrawal Formula**:

```
Max Monthly Withdrawal = (PV × r × (1 + r)^n) / ((1 + r)^n - 1)
```

Where PV = Present Value of investment

**Input Fields** (4 fields):

1. **Initial Investment Amount (₹)** - Number field
   - Minimum: ₹1,00,000, Step: ₹50,000
   - Accepts: Starting corpus amount
2. **Monthly Withdrawal Amount (₹)** - Number field
   - Minimum: ₹1,000, Step: ₹1,000
   - Accepts: Regular monthly withdrawal amount
3. **Expected Annual Return (%)** - Number field
   - Range: 6% to 20%, Step: 0.5%
   - Accepts: Expected fund performance rate
4. **Withdrawal Period (Years)** - Number field
   - Range: 1 to 30 years
   - Accepts: Duration of withdrawal requirement

---

## Compounding & Growth

### 9. Compounding Calculator

**Purpose**: Demonstrate compound interest with various frequencies

**Compound Interest Formulas**:

**Monthly Compounding**:

```
A = P(1 + r/12)^(12t) + Monthly Contributions accumulated
```

**Quarterly Compounding**:

```
A = P(1 + r/4)^(4t) + Quarterly accumulated contributions
```

**Annual Compounding**:

```
A = P(1 + r)^t + Annual accumulated contributions
```

**Effective Annual Rate**:

- Monthly: (1 + r/12)^12 - 1
- Quarterly: (1 + r/4)^4 - 1
- Annual: r

**Input Fields** (5 fields):

1. **Initial Investment (₹)** - Number field
   - Minimum: ₹0, Step: ₹1,000
   - Accepts: One-time initial investment amount
2. **Monthly Contribution (₹)** - Number field
   - Minimum: ₹0, Step: ₹500
   - Accepts: Regular monthly contribution
3. **Annual Interest Rate (%)** - Number field
   - Range: 0.1% to 50%, Step: 0.1%
   - Accepts: Expected annual return rate
4. **Time Period (Years)** - Number field
   - Range: 1 to 50 years
   - Accepts: Investment duration
5. **Compounding Frequency** - Dropdown field
   - Options: "Monthly", "Quarterly", "Annually"
   - Accepts: How often interest is compounded

---

## Specialized Calculators

### 10. Asset Allocation Calculator

**Purpose**: Recommend portfolio allocation based on risk profile

**Risk-Return Calculation**:

```
Expected Portfolio Return = Σ(Asset Weight × Asset Expected Return)
Portfolio Risk = √(Σ(Weight² × Variance) + Σ(2 × Weight₁ × Weight₂ × Covariance))
```

**Input Fields** (5+ fields):

1. **Age** - Number field
   - Range: 18 to 80 years
   - Accepts: Current age for risk profiling
2. **Investment Amount (₹)** - Number field
   - Minimum: ₹10,000, Step: ₹10,000
   - Accepts: Total investment corpus
3. **Risk Tolerance** - Dropdown field
   - Options: "Conservative", "Moderate", "Aggressive"
   - Accepts: Risk appetite selection
4. **Investment Time Horizon (Years)** - Number field
   - Range: 1 to 40 years
   - Accepts: Investment duration
5. **Custom Allocation Toggle** - Checkbox field
   - Options: Use recommended vs custom allocation
   - Additional fields for manual asset percentage input (if custom selected)

### 11. Human Life Value Calculator

**Purpose**: Calculate insurance coverage needed

**Basic Formula**:

```
HLV = (Annual Income - Annual Expenses) × Present Value Factor
Present Value Factor = (1 - (1 + g)^n × (1 + d)^(-n)) / (d - g)
```

**Where**:

- g = Income growth rate
- d = Discount rate
- n = Working years remaining

**Input Fields** (7 fields):

1. **Current Age** - Number field
   - Range: 18 to 65 years
   - Accepts: Current age of person
2. **Retirement Age** - Number field
   - Range: Current Age+1 to 75 years
   - Accepts: Expected retirement age
3. **Current Annual Income (₹)** - Number field
   - Minimum: ₹1,00,000, Step: ₹50,000
   - Accepts: Current annual salary/income
4. **Expected Income Growth Rate (% per year)** - Number field
   - Range: 0% to 20%, Step: 0.5%
   - Accepts: Annual income increase rate
5. **Discount Rate (% per year)** - Number field
   - Range: 3% to 15%, Step: 0.5%
   - Accepts: Rate to discount future earnings
6. **Personal Expenses (% of income)** - Number field
   - Range: 10% to 60%
   - Accepts: Expenses that benefit only the person (not family)
7. **Existing Life Insurance Coverage (₹)** - Number field
   - Minimum: ₹0, Step: ₹1,00,000
   - Accepts: Current life insurance amount

### 12. Emergency Fund Calculator

**Purpose**: Calculate recommended emergency fund size

**Calculation**:

```
Emergency Fund = Monthly Expenses × Recommended Months (6-12)
```

**Additional Considerations**:

- Job stability factor
- Number of dependents
- Existing insurance coverage
- Industry volatility

**Input Fields** (3 fields):

1. **Monthly Expenses (₹)** - Number field
   - Minimum: ₹10,000, Step: ₹5,000
   - Accepts: Average monthly household expenses
2. **Recommended Months** - Dropdown/Number field
   - Range: 6 to 12 months
   - Accepts: Number of months to cover
3. **Job Stability Factor** - Dropdown field
   - Options: Stable, Moderate, Variable
   - Accepts: Job security assessment

### 13. Child's Wedding Calculator

**Purpose**: Calculate savings required for child's wedding expenses

**Future Wedding Cost**:

```
Future Wedding Cost = Current Cost × (1 + Inflation Rate)^Years to Wedding
```

**Time Horizon**:

```
Time Horizon = Wedding Age - Child's Current Age
```

**Future Value of Current Savings**:

```
Future Value = Current Savings × (1 + Monthly Rate)^Total Months
```

**Required Monthly SIP**:

```
Monthly SIP = Remaining Amount / Future Value Factor
Future Value Factor = ((1 + r)^n - 1) / r
```

**Input Fields** (6 fields):

1. **Current Wedding Cost (₹)** - Number field
   - Minimum: ₹1,00,000, Step: ₹50,000
   - Accepts: Current estimated wedding cost
2. **Child's Current Age** - Number field
   - Range: 0 to 30 years
   - Accepts: Child's present age
3. **Expected Wedding Age** - Number field
   - Range: 18 to 40 years
   - Accepts: Age when child will get married
4. **Expected Annual Return (%)** - Number field
   - Range: 1% to 30%, Step: 0.5%
   - Accepts: Investment return rate
5. **Inflation Rate (%)** - Number field
   - Range: 1% to 15%, Step: 0.5%
   - Accepts: Wedding cost inflation rate
6. **Current Savings (₹)** - Number field
   - Minimum: ₹0, Step: ₹10,000
   - Accepts: Existing savings for wedding

### 14. Children Education Planner

**Purpose**: Plan for multiple children's education expenses

**Education Stage Ages**:

- Primary: 6 years
- Secondary: 11 years
- Higher Secondary: 16 years
- Undergraduate: 18 years
- Postgraduate: 22 years

**Future Education Cost**:

```
Future Cost = Current Cost × (1 + Education Inflation)^Years to Education
```

**Individual Child Calculation**:

```
Monthly SIP per Child = Target Amount / ((1 + r)^n - 1) / r
```

**Total Planning**:

```
Total Monthly Investment = Sum of all individual child SIPs
```

**Input Fields** (Dynamic fields per child + 3 common fields):

**Per Child:**

1. **Child Name** - Text field
   - Accepts: Name of the child
2. **Current Age** - Number field
   - Range: 1 to 30 years
   - Accepts: Child's present age
3. **Education Stage** - Dropdown field
   - Options: Primary, Secondary, Higher Secondary, Undergraduate, Postgraduate
   - Accepts: Target education level
4. **Estimated Cost (₹)** - Number field
   - Minimum: ₹1,00,000, Step: ₹50,000
   - Accepts: Current education cost estimate

**Common Fields:** 5. **Education Inflation (%)** - Number field

- Range: 6% to 15%, Step: 0.5%
- Accepts: Education cost inflation rate

6. **Expected Return (%)** - Number field
   - Range: 8% to 20%, Step: 0.5%
   - Accepts: Investment return rate
7. **Current Savings (₹)** - Number field
   - Minimum: ₹0, Step: ₹10,000
   - Accepts: Existing education savings

### 15. Dream Home Calculator

**Purpose**: Calculate savings for home down payment

**Down Payment Calculation**:

```
Down Payment Amount = Home Price × (Down Payment % / 100)
```

**Monthly SIP Required**:

```
If Current Savings Future Value >= Down Payment:
    Monthly SIP = 0
Else:
    Remaining Amount = Down Payment - Future Value of Current Savings
    Monthly SIP = Remaining Amount / Future Value Factor
```

**Input Fields** (5 fields):

1. **Home Price (₹)** - Number field
   - Minimum: ₹10,00,000, Step: ₹1,00,000
   - Accepts: Target home price
2. **Down Payment (%)** - Number field
   - Range: 10% to 50%, Step: 5%
   - Accepts: Down payment percentage
3. **Time Horizon (Years)** - Number field
   - Range: 1 to 20 years
   - Accepts: Years to buy home
4. **Expected Return (%)** - Number field
   - Range: 8% to 20%, Step: 0.5%
   - Accepts: Investment return rate
5. **Current Savings (₹)** - Number field
   - Minimum: ₹0, Step: ₹10,000
   - Accepts: Existing savings for home

### 16. Goal Setting Calculator

**Purpose**: General-purpose goal planning calculator

**Core Formula**:

```
Monthly Investment = (Goal Amount - Future Value of Current Savings) / Future Value Factor
```

**Where**:

- Future Value Factor = ((1 + r)^n - 1) / r
- Future Value of Current Savings = Current Amount × (1 + r)^n

**Input Fields** (4 fields):

1. **Goal Amount (₹)** - Number field
   - Minimum: ₹10,000, Step: ₹10,000
   - Accepts: Target financial goal amount
2. **Time Horizon (Years)** - Number field
   - Range: 1 to 30 years
   - Accepts: Years to achieve goal
3. **Expected Return (%)** - Number field
   - Range: 6% to 25%, Step: 0.5%
   - Accepts: Investment return rate
4. **Current Savings (₹)** - Number field
   - Minimum: ₹0, Step: ₹5,000
   - Accepts: Existing savings towards goal

### 17. Networth Calculator

**Purpose**: Calculate personal net worth

**Net Worth Formula**:

```
Net Worth = Total Assets - Total Liabilities
```

**Asset Categories**:

- Real Estate
- Investments (Mutual Funds, Stocks, Bonds)
- Cash & Savings
- Personal Assets (Vehicle, Jewelry)
- Other Assets

**Liability Categories**:

- Home Loan
- Personal Loan
- Credit Card Debt
- Vehicle Loan
- Other Liabilities

**Additional Metrics**:

```
Assets to Liability Ratio = Total Assets / Total Liabilities
Liquid Assets Ratio = Liquid Assets / Total Assets
```

**Input Fields** (Dynamic - Add/Remove items):

**Assets Section:**

1. **Asset Name** - Text field
   - Accepts: Name/description of asset
2. **Asset Value (₹)** - Number field
   - Minimum: ₹0, Step: ₹1,000
   - Accepts: Current market value
3. **Asset Category** - Dropdown field
   - Options: Real Estate, Investments, Cash & Savings, Personal Assets, Other
   - Accepts: Asset classification

**Liabilities Section:** 4. **Liability Name** - Text field

- Accepts: Name/description of liability

5. **Liability Value (₹)** - Number field
   - Minimum: ₹0, Step: ₹1,000
   - Accepts: Outstanding amount
6. **Liability Category** - Dropdown field
   - Options: Home Loan, Personal Loan, Credit Card, Vehicle Loan, Other
   - Accepts: Liability classification

### 18. Spending Less Calculator

**Purpose**: Calculate wealth impact of reducing expenses

**Frequency Conversion to Annual**:

```
Daily: Amount × 365
Weekly: Amount × 52
Monthly: Amount × 12
Yearly: Amount × 1
```

**Annual Savings per Expense**:

```
Annual Savings = (Current Amount - Reduced Amount) × Frequency Factor
```

**Future Value of Savings**:

```
Future Value = Annual Savings × SIP Future Value Factor
```

**Total Impact**:

```
Total Annual Savings = Sum of all expense reductions
Total Future Value = Sum of all individual future values
```

**Input Fields** (Dynamic expenses + 2 common fields):

**Per Expense Item:**

1. **Expense Name** - Text field
   - Accepts: Description of expense
2. **Current Amount (₹)** - Number field
   - Minimum: ₹0, Step: ₹10
   - Accepts: Current spending amount
3. **Reduced Amount (₹)** - Number field
   - Minimum: ₹0, Step: ₹10
   - Accepts: Target reduced amount
4. **Frequency** - Dropdown field
   - Options: Daily, Weekly, Monthly, Yearly
   - Accepts: How often expense occurs
5. **Category** - Dropdown field
   - Options: Food & Dining, Entertainment, Transportation, Shopping, Utilities, Other
   - Accepts: Expense classification

**Common Fields:** 6. **Investment Return (%)** - Number field

- Range: 6% to 20%, Step: 0.5%
- Accepts: Return rate for invested savings

7. **Time Period (Years)** - Number field
   - Range: 1 to 30 years
   - Accepts: Investment duration

### 19. Wealth Creation Calculator

**Purpose**: Comprehensive wealth building calculator

**Future Value Components**:

```
Lump Sum Future Value = Current Investment × (1 + r)^n
SIP Future Value = Monthly Amount × ((1 + r)^n - 1) / r
Total Future Value = Lump Sum FV + SIP FV
```

**Wealth Multiplier**:

```
Wealth Multiplier = Total Future Value / Total Investment
```

**Required Monthly for Target**:

```
Required Monthly = (Target - Lump Sum FV) / ((1 + r)^n - 1) / r
```

**Input Fields** (5 fields):

1. **Target Wealth (₹)** - Number field
   - Minimum: ₹10,00,000, Step: ₹1,00,000
   - Accepts: Desired wealth target
2. **Time Horizon (Years)** - Number field
   - Range: 5 to 40 years
   - Accepts: Investment duration
3. **Expected Return (%)** - Number field
   - Range: 8% to 25%, Step: 0.5%
   - Accepts: Expected annual return
4. **Current Investment (₹)** - Number field
   - Minimum: ₹0, Step: ₹10,000
   - Accepts: One-time lump sum investment
5. **Monthly Investment (₹)** - Number field
   - Minimum: ₹500, Step: ₹500
   - Accepts: Regular monthly SIP amount

### 20. Composite Financial Goal Calculator

**Purpose**: Plan multiple financial goals simultaneously

**Goal Prioritization**:

1. High Priority goals calculated first
2. Medium Priority goals second
3. Low Priority goals last

**Resource Allocation**:

```
For each goal in priority order:
1. Calculate required monthly SIP
2. Allocate available current savings (if any)
3. Remaining amount from SIP calculation
```

**Goal Calculation**:

```
Monthly SIP per Goal = Goal Amount / ((1 + r)^(years × 12) - 1) / r
```

**Total Investment**:

```
Total Monthly Investment = Sum of all individual goal SIPs
```

**Input Fields** (Dynamic goals + 2 common fields):

**Per Goal:**

1. **Goal Name** - Text field
   - Accepts: Description of financial goal
2. **Goal Amount (₹)** - Number field
   - Minimum: ₹10,000, Step: ₹10,000
   - Accepts: Target amount for goal
3. **Time Horizon (Years)** - Number field
   - Range: 1 to 30 years
   - Accepts: Years to achieve goal
4. **Priority** - Dropdown field
   - Options: High, Medium, Low
   - Accepts: Goal importance ranking

**Common Fields:** 5. **Expected Return (%)** - Number field

- Range: 8% to 20%, Step: 0.5%
- Accepts: Investment return rate

6. **Current Savings (₹)** - Number field
   - Minimum: ₹0, Step: ₹10,000
   - Accepts: Total existing savings to allocate

---

## Key Mathematical Constants & Assumptions

### Standard Assumptions Used:

- **Equity Returns**: 10-15% annually
- **Debt Returns**: 6-8% annually
- **Inflation Rate**: 6% annually
- **Retirement Corpus**: 25x annual expenses (4% withdrawal rule)
- **Tax Bracket**: 30% for high earners
- **EPF Interest**: 8.15% currently
- **PPF Interest**: 7.1% currently

### Important Notes:

1. All calculations assume monthly compounding unless specified otherwise
2. Returns are calculated on an annual basis and converted to monthly rates
3. Inflation is considered for long-term calculations
4. Tax implications are simplified and may vary based on individual circumstances
5. Past performance does not guarantee future results

---

## Formula Implementation Standards

### Input Validation:

- Minimum and maximum value constraints
- Step validation for user inputs
- Currency formatting in Indian numbering system

### Output Formatting:

- Currency values in INR with appropriate suffixes (L for Lakhs, Cr for Crores)
- Percentage values rounded to 1-2 decimal places
- Absolute values rounded to nearest rupee

### Error Handling:

- Division by zero scenarios (when interest rate = 0)
- Negative value validations
- Boundary condition checks

---

_This report covers all major calculators available on the SpringPad platform. Each formula has been implemented with appropriate error handling and follows financial industry standards for accuracy and reliability._
