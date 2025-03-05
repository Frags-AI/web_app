import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Header from "../Base/Header";
import Footer from "../Base/Footer";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"


const BlogPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortOrder, setSortOrder] = useState("Newest");
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 32;

  const categories = ["All", "How-To", "Product Updates", "Video Editing"];

  const blogPosts = Array(12).fill({
    title: "Crafting Consistency: a thoughtful approach for naming video",
    date: "Sep 23, 2024",
    category: "HOW-TO",
  });

  return (
    <div className="bg-[#050406] pt-[100px] text-white min-h-screen">
      <Header />

      {/* Blog Header */}
      <section className="text-center mt-16 px-4 md:px-16 lg:px-32">
        <h1 className="text-4xl font-bold">Blog</h1>
        <p className="text-white mt-2">
          Explore pro tips, gaming insights, and creator hacks that will level up your content creation.
        </p>
      </section>

      {/* Featured Blog */}
      <section className="mt-10 flex flex-col md:flex-row items-center gap-6 px-4 md:px-16 lg:px-32">
        <div className="bg-[#1A1A1C] w-full md:w-2/3 h-64 rounded-lg" />
        <div className="md:w-1/3">
          <span className="text-[#52FFF3] uppercase text-sm">Feature</span>
          <h2 className="text-2xl font-semibold mt-2">
            Crafting Consistency: a thoughtful approach for naming video
          </h2>
          <p className="text-white mt-2">Sep 23, 2024</p>
        </div>
      </section>

      {/* Filters & Sorting */}
      <div className="mt-8 flex flex-col md:flex-row justify-between items-center px-4 md:px-16 lg:px-32">
        <div className="space-x-2">
          {categories.map((category) => (
            <button
              key={category}
              className={`px-4 py-2 rounded ${
                selectedCategory === category ? "bg-white text-black" : "bg-[#1A1A1C] text-[#A8A8A8]"
              }`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
        <div className="flex items-center space-x-2 mt-4 md:mt-0">
  <span className="text-white">Sort by:</span>

  <Button
    className={`px-3 py-2 rounded-[7px] border ${
      sortOrder === "Newest"
        ? " bg-transparent text-white border-white"
        : "bg-transparent text-gray-400  hover:border-white hover:text-white"
    }`}
    onClick={() => setSortOrder("Newest")}
  >
    Newest
  </Button>

  <Button
    className={`px-3 py-2 rounded-[7px] border ${
      sortOrder === "Oldest"
        ? "bg-transparent text-white border-white "
        : "bg-transparent text-gray-400  hover:border-white hover:text-white"
    }`}
    onClick={() => setSortOrder("Oldest")}
  >
    Oldest
  </Button>
</div>

      </div>

      {/* Blog Posts Grid */}
      <section className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 px-4 md:px-16 lg:px-32 ">
        {blogPosts.map((post, index) => (
          <Card key={index} className="bg-transparent hover:scale-105">
            <div className="bg-[#1A1A1C] h-80 rounded-xl" />
            <CardContent>
              <span className="text-[#52FFF3] uppercase text-sm mt-3 block pb-[10px]">{post.category}</span>
              <h3 className="text-lg font-semibold mt-2 pb-[15px]">{post.title}</h3>
              <p className="text-white mt-1">{post.date}</p>
            </CardContent>
          </Card>
        ))}
      </section>

       {/* Pagination using ShadCN */}
       <div className="mt-8 flex justify-center px-4 md:px-16 lg:px-32">
      <Pagination>
        <PaginationContent className="flex items-center space-x-2">
          {/* Previous Button */}
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              className={`w-10 h-10 flex items-center justify-center rounded-full border border-white text-white ${
                currentPage === 1 ? "opacity-50 cursor-not-allowed" : "hover:border-[#52FFF3]"
              }`}
            />
          </PaginationItem>

          {/* Page Numbers */}
          <PaginationItem>
            <PaginationLink
              href="#"
              onClick={() => setCurrentPage(1)}
              className={currentPage === 1 ? "text-teal-400 font-bold" : ""}
            >
              1
            </PaginationLink>
          </PaginationItem>

          <PaginationItem>
            <PaginationLink
              href="#"
              onClick={() => setCurrentPage(2)}
              className={currentPage === 2 ? "text-teal-400 font-bold" : ""}
            >
              2
            </PaginationLink>
          </PaginationItem>

          <PaginationItem>
            <PaginationLink
              href="#"
              onClick={() => setCurrentPage(3)}
              className={currentPage === 3 ? "text-teal-400 font-bold" : ""}
            >
              3
            </PaginationLink>
          </PaginationItem>

          {/* Ellipsis for Hidden Pages */}
          {currentPage < totalPages - 2 && (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          )}

          {/* Last Page */}
          <PaginationItem>
            <PaginationLink
              href="#"
              onClick={() => setCurrentPage(totalPages)}
              className={currentPage === totalPages ? "text-[#52FFF3] font-semibold" : ""}
            >
              {totalPages}
            </PaginationLink>
          </PaginationItem>

          {/* Next Button */}
          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              className={`w-10 h-10 flex items-center justify-center rounded-full border border-white text-white ${
                currentPage === totalPages ? "opacity-50 cursor-not-allowed " : "hover:border-[#52FFF3]"
              }`}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
      {/* Call-to-Action with Proper Padding */}
      <div className="mt-16 text-center px-4 md:px-16 lg:px-32 pb-[150px]">
        <h2 className="text-6xl font-bold pb-[30px]">Ready to Create Content That Goes Viral?</h2>
        <Button className="mb-[20px] mt-4 px-6 py-3 bg-white text-black font-semibold rounded-full">
          Start creating for free
        </Button>
        <p className="text-gray-400 mt-2">No credit card required</p>
      </div>

      {/* Footer with 150px gap from content */}
      
        <Footer />
      
    </div>
  );
};

export default BlogPage;
