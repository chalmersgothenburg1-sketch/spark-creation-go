import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
  {
    question: "How does the emergency button work?",
    answer: "The emergency button instantly connects you to our 24/7 monitoring center. When pressed, it sends your location, medical information, and emergency contacts to our trained operators who coordinate with local emergency services and notify your family members immediately."
  },
  {
    question: "Is the watch waterproof?",
    answer: "Yes, all our watches are water-resistant with an IPX7 rating, meaning they can withstand splashes, rain, and brief submersion. However, we recommend avoiding prolonged water exposure and removing the watch before swimming or showering for optimal longevity."
  },
  {
    question: "How long does the battery last?",
    answer: "Battery life varies by plan: Basic plan offers 7 days, Premium plan offers 5 days due to additional sensors, and Premium+ offers 5-7 days with optimized power management. All watches come with a magnetic charging dock for easy overnight charging."
  },
  {
    question: "Can family members see my health data?",
    answer: "Yes, authorized family members can access your health dashboard through our secure mobile app. You control what information is shared and can add or remove family members at any time. All data is HIPAA-compliant and encrypted for maximum privacy."
  },
  {
    question: "What happens if I fall and can't press the button?",
    answer: "Our Premium and Premium+ plans include automatic fall detection technology. If a fall is detected and you don't respond to the watch's alert within 60 seconds, it automatically triggers an emergency response just like pressing the button manually."
  },
  {
    question: "Do I need a smartphone to use this?",
    answer: "While a smartphone enhances the experience with our mobile app, it's not required. The watch has built-in cellular connectivity and can function independently. However, we recommend having a smartphone or asking a family member to download our app for the best experience."
  },
  {
    question: "How accurate are the health measurements?",
    answer: "Our watches use medical-grade sensors that provide clinically accurate readings for heart rate, blood pressure, and activity tracking. While not a replacement for professional medical devices, they meet FDA standards for consumer health monitoring devices."
  },
  {
    question: "What's included in the 24/7 monitoring service?",
    answer: "Our monitoring center is staffed by trained emergency operators who can access your medical profile, contact your family, and coordinate with local emergency services. Premium+ subscribers also get access to registered nurses for health consultations and medication guidance."
  },
  {
    question: "Is there a monthly fee?",
    answer: "The Basic plan has no monthly fees - just the one-time device cost. Premium and Premium+ plans include 12 months of monitoring services. After the first year, monitoring services are $29/month for Premium and $49/month for Premium+ to maintain 24/7 support."
  },
  {
    question: "What if I'm not satisfied with my purchase?",
    answer: "We offer a 30-day money-back guarantee on all plans. If you're not completely satisfied, return the device in its original condition for a full refund. We also provide a 2-year manufacturer warranty covering defects and normal wear."
  },
  {
    question: "How do medication reminders work?",
    answer: "You or your family can set up medication schedules through our app. The watch will vibrate and display reminders at prescribed times. For Premium+ subscribers, our nurses can help optimize medication timing and provide adherence monitoring."
  },
  {
    question: "Can I use this if I already have a pacemaker or other medical device?",
    answer: "Our watches are safe to use with most medical devices, including pacemakers. However, we always recommend consulting with your cardiologist or healthcare provider before use. We can provide technical specifications to share with your doctor if needed."
  }
];

export function FAQSection() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Frequently Asked <span className="text-primary">Questions</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Get answers to common questions about our health monitoring solutions
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="border border-border rounded-lg px-6 bg-card"
              >
                <AccordionTrigger className="text-left hover:no-underline py-6">
                  <span className="font-semibold text-foreground">{faq.question}</span>
                </AccordionTrigger>
                <AccordionContent className="pb-6 text-muted-foreground leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-4">
            Still have questions? We're here to help!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="tel:1-800-SENIOR-CARE" className="text-primary hover:text-primary/80 font-medium">
              📞 Call us: 1-800-SENIOR-CARE
            </a>
            <a href="mailto:support@seniorcare.com" className="text-primary hover:text-primary/80 font-medium">
              ✉️ Email: support@seniorcare.com
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}