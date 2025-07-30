import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export interface SipResult {
  futureValue: string;
  totalInvestment: string;
  totalReturns: string;
}

export interface SipInputs {
  monthlyInvestment: string;
  expectedReturn: string;
  timePeriod: string;
  investmentType: "SIP" | "Lumpsum";
}

export const exportSipCalculatorToPDF = async (
  element: HTMLElement,
  result: SipResult,
  inputs: SipInputs
) => {
  try {
    // Create canvas from the element
    const canvas = await html2canvas(element, {
      scale: 2,
      backgroundColor: '#ffffff',
      useCORS: true,
      allowTaint: true,
      width: element.scrollWidth,
      height: element.scrollHeight,
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    const imgWidth = 210;
    const pageHeight = 295;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    // Add header
    pdf.setFontSize(24);
    pdf.setTextColor(44, 82, 130); // Brand blue color
    pdf.text('SIP Calculator Report', 20, 25);
    
    // Add branding
    pdf.setFontSize(14);
    pdf.setTextColor(100, 100, 100);
    pdf.text('Springpad Financial Planning', 20, 35);
    
    // Add generation date
    pdf.setFontSize(10);
    pdf.setTextColor(150, 150, 150);
    pdf.text(`Generated on: ${new Date().toLocaleDateString('en-IN')} at ${new Date().toLocaleTimeString('en-IN')}`, 20, 42);
    
    // Add investment summary
    pdf.setFontSize(16);
    pdf.setTextColor(44, 82, 130);
    pdf.text('Investment Summary', 20, 55);
    
    pdf.setFontSize(11);
    pdf.setTextColor(0, 0, 0);
    const summary = [
      `Investment Type: ${inputs.investmentType}`,
      `${inputs.investmentType === 'SIP' ? 'Monthly' : 'Lump Sum'} Investment: ₹${inputs.monthlyInvestment}`,
      `Expected Return Rate: ${inputs.expectedReturn}% per annum`,
      `Investment Period: ${inputs.timePeriod} years`,
      `Total Investment: ₹${parseInt(result.totalInvestment).toLocaleString('en-IN')}`,
      `Expected Returns: ₹${parseInt(result.totalReturns).toLocaleString('en-IN')}`,
      `Future Value: ₹${parseInt(result.futureValue).toLocaleString('en-IN')}`,
      `Return Percentage: ${((parseInt(result.totalReturns) / parseInt(result.totalInvestment)) * 100).toFixed(1)}%`
    ];
    
    let yPosition = 65;
    summary.forEach((line) => {
      pdf.text(line, 20, yPosition);
      yPosition += 6;
    });
    
    // Add chart image
    const chartStartY = yPosition + 10;
    if (chartStartY + imgHeight <= pageHeight - 20) {
      pdf.addImage(imgData, 'PNG', 0, chartStartY, imgWidth, imgHeight);
    } else {
      // If image doesn't fit, add it on a new page
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, 20, imgWidth, imgHeight);
    }
    
    // Add disclaimer on the last page
    pdf.addPage();
    pdf.setFontSize(16);
    pdf.setTextColor(44, 82, 130);
    pdf.text('Important Disclaimer', 20, 30);
    
    pdf.setFontSize(10);
    pdf.setTextColor(0, 0, 0);
    const disclaimer = [
      '• This calculator is for illustrative purposes only and should not be considered as investment advice.',
      '• Past performance does not guarantee future results. Actual returns may vary.',
      '• Market risks are subject to change. Please consult with a financial advisor before making investment decisions.',
      '• The calculations assume a constant rate of return, which may not reflect real market conditions.',
      '• Mutual fund investments are subject to market risks. Please read all scheme-related documents carefully.',
      '• Tax implications are not considered in these calculations.',
      '',
      'For personalized investment advice, please consult with our financial advisors.',
      '',
      'Contact: support@springpad.com',
      'Website: www.springpad.com'
    ];
    
    yPosition = 45;
    disclaimer.forEach((line) => {
      if (line === '') {
        yPosition += 3;
      } else {
        pdf.text(line, 20, yPosition);
        yPosition += 5;
      }
    });
    
    // Save the PDF
    const fileName = `SIP-Calculator-Report-${inputs.investmentType}-${new Date().toISOString().split('T')[0]}.pdf`;
    pdf.save(fileName);
    
    return true;
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Failed to generate PDF report');
  }
};
