import React, { useState } from 'react';

interface FaqItem {
  question: string,
  answer: string
}

const Faq: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  
  const faqData: FaqItem[] = [
    {
      question: "Is Frags free to use?",
      answer: "You bet your shorts! New users can enjoy Frags Shorts maker for free with a &-day trial on the Pro Plan, Providing 90 minutes of video processing time. No Credit card is required. After the trial, you can continue using our free plan with 60 minutes of processing time monthly.",
    },
    {
      question: "What makes Frags short clip maker unique?",
      answer: "",
    },
    {
      question: "Can I customize my shorts with Frags?",
      answer: "",
    },
    {
      question: "How does Frags support creator platforms?",
      answer: "",
    },
    {
      question: "What happens to my clips after the Frags free trial?",
      answer: "",
    },
    {
      question: "Can Frags handle multiple video formats?",
      answer: "",
    },
    {
      question: "Is there a limit to the number of shorts I can create with Frags?",
      answer: "",
    },
    {
      question: "Does Frags offer support for beginners?",
      answer: "",
    },
  ];
  
  const toggleAnswer = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };
  
  return (
    <div className="max-w-[600px] mx-auto p-5">
      <h1 className="text-[3.5rem] font-normal text-center mb-[70px] text-white">
        Ask Away...
      </h1>
      <div className="flex flex-col mb-[100px]">
        {faqData.map((item, index) => (
          <div key={index} className="border-t border-[#909298] overflow-hidden transition-all duration-300 ease-in-out">
            <div
              className="bg-[#050406] py-[15px] px-[15px] flex justify-between items-center cursor-pointer text-white ml-[20px] mr-[20px] mt-[5px] hover:text-[#DE2F2A]"
              onClick={() => toggleAnswer(index)}
            >
              {item.question}
              <span
                className={`text-[1.5rem] transition-transform duration-300 ease-in-out ${
                  activeIndex === index ? 'transform rotate-90' : ''
                }`}
              >
                &gt;
              </span>
            </div>
            <div
              className={`ml-[20px] overflow-hidden text-[#9BA2B2] ${
                activeIndex === index ? 'max-h-[200px] pb-[25px]' : 'max-h-0'
              } transition-[max-height,padding] duration-300 ease-in-out`}
            >
              <p className="m-0">{item.answer}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Faq;