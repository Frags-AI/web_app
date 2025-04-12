import { useState } from 'react';
import { Button } from "@/components/ui/button";

interface FeatureProps {
  title: string
  description: string
  src: string
}

const features: FeatureProps[] = [
  { 
    title: "Virality Ranking", 
    description: "Our AI analyzes trending content across platforms to predict your clip's viral potential. Get instant feedback on which moments are likely to resonate with your audience.", 
    src: "assets/virality_ranking.jpg" 
  },
  { 
    title: "Stream Clipping", 
    description: "Automatically detect and extract the most exciting moments from your streams, making it easier to create engaging clips for your audience.", 
    src: "assets/stream_clipping.jpg" 
  },
  { 
    title: "Aspect Ratio", 
    description: "Resize and optimize your video for different social media platforms, ensuring the best viewing experience across all devices.", 
    src: "assets/aspect_ratio.jpg" 
  },
  { 
    title: "AI Subtitles", 
    description: "Generate accurate AI-powered subtitles for your videos, improving accessibility and engagement for a wider audience.", 
    src: "assets/ai_subtitles.jpg" 
  },
  { 
    title: "Video Assets", 
    description: "Access a library of high-quality video assets to enhance your content and create visually appealing videos.", 
    src: "assets/video_assets.jpg" 
  },
  { 
    title: "Content Analysis", 
    description: "Analyze your video's performance and receive AI-driven insights on how to improve engagement and reach.", 
    src: "assets/content_analysis.jpg" 
  },
  { 
    title: "In-Built Editor", 
    description: "Edit your videos seamlessly with our intuitive, built-in editor that simplifies the post-production process.", 
    src: "assets/in_built_editor.jpg" 
  },
  { 
    title: "AI Backgrounds", 
    description: "Enhance your videos with AI-generated backgrounds that adapt to your content and improve visual appeal.", 
    src: "assets/ai_backgrounds.jpg" 
  },
  { 
    title: "AI Voiceover", 
    description: "Generate high-quality AI voiceovers for your videos, offering a variety of tones and styles to suit your content.", 
    src: "assets/ai_voiceover.jpg" 
  },
  { 
    title: "Script Generator", 
    description: "Use AI to generate compelling scripts for your videos, ensuring engaging and well-structured storytelling.", 
    src: "assets/script_generator.jpg" 
  }
]

const selectedStyling = "outline-highlight text-highlight";

const Features = () => {

  const [selectedFeature, setSelectedFeature] = useState<FeatureProps>(features[0]);
  const [featureIndex, setFeatureIndex] = useState<number>(0);

  const handleFeatureSelect = (idx: number) => {
    setFeatureIndex(idx);
    setSelectedFeature(features[idx])
  }


  return (
    <>
      <div className="flex justify-center text-center items-center mt-40 mb-32 font-bold text-6xl">
        <div>Power your content more efficiently than ever</div>
      </div>

      <div className='flex flex-col justify-center items-center gap-20 w-4/5 mx-auto'>
        <div className="flex flex-col items-center gap-5">
          <div className='text-3xl'>Get the tools you need to succeed.</div>
          <div className="flex whitespace-pre text-lg">Focus on what matters most: <div className='font-bold'>Your Creativity</div></div>
        </div>
        <div className='flex flex-col items-between gap-10 w-full'>
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-y-10 place-items-center">
            {features.map((feature, index) => {
              return (
                <div 
                  className={`outline outline-2 rounded-lg w-[160px] h-[80px] flex flex-col items-center justify-center cursor-pointer transition duration-300 hover:bg-primary-invert ${featureIndex === index ? selectedStyling : ''}`}
                  onClick={() => handleFeatureSelect(index)}
                >
                  {feature.title.split(' ').map((word) => {
                    return (
                      <div className="text-center">{word}</div>
                    )
                  })}
                </div>
              )
            })}
          </div>
          <div className="flex flex-col lg:flex-row justify-between mt-16 gap-16 lg:gap-0">
            <div className='flex flex-col items-start justify-center gap-5 lg:w-2/5'>
              <div className="text-3xl font-bold">{selectedFeature.title}</div>
              <div className="text-xl">{selectedFeature.description}</div>
              <Button className="text-xl rounded-full mt-8 px-8 py-6">
                Try For Free
              </Button>
            </div>
            <div className="bg-muted lg:w-2/5 h-[600px] rounded-lg"></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Features;
