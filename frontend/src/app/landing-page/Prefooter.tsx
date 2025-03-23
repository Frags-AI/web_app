import { Button } from "@/components/ui/button";

const Prefooter = () => {
  return (
    <>
      <div className="my-40 flex flex-col gap-4 items-center justify-center text-center">
        <div className="text-5xl lg:text-6xl font-bold max-w-[700px] mb-8">Capture your best plays with 120 minutes free</div>
        <Button className='rounded-full px-8 py-5 text-xl'>Get started for free</Button>
        <div className='text-[#797979]'>No credit card required</div>
      </div>
    </>
  );
};

export default Prefooter;
