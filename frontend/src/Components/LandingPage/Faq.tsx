import React, { useState } from 'react';
import { 
  Accordion, 
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";


interface FaqItemProps {
  question: string,
  answer: string,
  value: string
}

const faqItems: FaqItemProps[] = [
  {
    question: "Can I cancel my plan?",
    answer: "Yes, you can cancel your plan at any time. However, cancellations take effect at the end of your current billing cycle, and we do not offer prorated refunds for unused portions of the subscription.",
    value: "cancel_plan",
  },
  {
    question: "Can I change my plan after I subscribe?",
    answer: "Yes, you can upgrade or downgrade your plan at any time. Upgrades take effect immediately, while downgrades apply at the start of the next billing cycle.",
    value: "change_plan",
  },
  {
    question: "Do you have a refund policy?",
    answer: "We offer refunds only under specific circumstances, such as accidental charges or service issues. Please review our refund policy or contact support if you have concerns.",
    value: "refund_policy",
  },
  {
    question: "Can I monetize videos created with Frags?",
    answer: "Yes, you can monetize videos created with Frags, provided that you adhere to our terms of service and any relevant platform guidelines (such as YouTube’s monetization policies).",
    value: "monetization",
  },
  {
    question: "Can I generate videos made for other languages?",
    answer: "Yes, Frags supports multiple languages for video generation. We are continuously expanding our language options to ensure better accessibility for global users.",
    value: "multi_language_support",
  },
  {
    question: "Do you offer a free trial?",
    answer: "Yes, we offer a free trial so you can explore our features before committing to a paid plan. No credit card is required to start.",
    value: "free_trial",
  },
  {
    question: "What happens if my payment fails?",
    answer: "If a payment fails, we will notify you and retry the charge. If the issue persists, your account may be downgraded or suspended until payment is resolved.",
    value: "payment_failure",
  },
  {
    question: "Can I use Frags for commercial purposes?",
    answer: "Yes, our platform supports commercial use. However, please ensure that your content complies with our terms of service and any third-party licensing requirements.",
    value: "commercial_use",
  },
  {
    question: "Do you offer customer support?",
    answer: "Yes, we provide customer support via email and live chat. Our team is available during business hours to assist with any issues or questions.",
    value: "customer_support",
  },
  {
    question: "Is my data secure with Frags?",
    answer: "Yes, we prioritize data security and privacy. Our platform uses encryption and other industry-standard security measures to protect your information.",
    value: "data_security",
  },
];


const Faq: React.FC = () => {

  return (
    <>
      <div className="mt-40 flex flex-col items-center justify-center gap-16">
        <div className='text-5xl lg:text-6xl'>Got Questions?</div>
      </div>

      <div className="w-4/5 lg:w-3/5 mx-auto mt-12">
        <Accordion type="single" collapsible>
          {faqItems.map((item, index) => {
            return (
              <AccordionItem key={index} value={item.value}>
                <AccordionTrigger className="my-4">{item.question}</AccordionTrigger>
                <AccordionContent>{item.answer}</AccordionContent>  
              </AccordionItem>
            )
          })}
        </Accordion>
      </div>
    </>
  )
  
};

export default Faq;