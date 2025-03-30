import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { SignedIn, SignedOut } from "@clerk/clerk-react";

const Prefooter = () => {
  return (
    <>
      <div className="my-40 flex flex-col gap-4 items-center justify-center text-center">
        <SignedOut>
          <div className="text-5xl lg:text-6xl font-bold max-w-[700px] mb-8">Capture your best plays with 120 minutes free</div>
          <Button className='rounded-full px-8 py-5 text-xl'>
            <Link to='/signup'>Get started for free</Link>
          </Button>
          <div className='text-[#797979]'>No credit card required</div>
        </SignedOut>
        <SignedIn>
          <div className="text-5xl lg:text-6xl font-bold max-w-[700px] mb-8">Get started with posting viral clips</div>
          <Button className='rounded-full px-8 py-5 text-xl'>
            <Link to='/dashboard'>Go to dashboard</Link>
          </Button>
          <div className='text-[#797979]'>Explore your benefits</div>
        </SignedIn>
      </div>
    </>
  );
};

export default Prefooter;
