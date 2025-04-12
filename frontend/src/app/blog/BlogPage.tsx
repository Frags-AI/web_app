import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Header from "../base/Header";
import Footer from "../base/Footer";
import Prefooter from "../base/Prefooter";
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
    <div className="pt-[100px] min-h-screen">
      <Header />

      {/* Blog Header */}
      <div className="px-4 md:px-16 lg:px-32">
        <section className="text-center mt-16 px-4 md:px-16 ">
          <h1 className="text-4xl font-bold">Blog</h1>
          <p className="mt-2">
            Explore pro tips, gaming insights, and creator hacks that will level up your content creation.
          </p>
        </section>

        {/* Featured Blog */}
        <section className="mt-10 flex flex-col md:flex-row items-center gap-6 ">
          <div className="bg-muted w-full md:w-2/3 h-64 rounded-lg" />
          <div className="md:w-1/3">
            <span className="text-highlight uppercase text-sm">Feature</span>
            <h2 className="text-2xl font-semibold mt-2">
              Crafting Consistency: a thoughtful approach for naming video
            </h2>
            <p className="mt-2">Sep 23, 2024</p>
          </div>
        </section>

        {/* Filters & Sorting */}
        <div className="mt-8 flex flex-col items-start md:gap-4">
          <div className="space-x-2">
            {categories.map((category) => (
              <Button
                key={category}
                className={`px-4 py-2 rounded ${
                  selectedCategory === category ? "bg-primary" : "bg-primary/60"
                }`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
          <div className="flex items-center space-x-2 mt-4 md:mt-0">
            <span className="">Sort by:</span>

            <Button
              className={`px-3 py-2 rounded-[7px] border ${sortOrder === "Newest" ? "bg-primary" : "bg-primary/60"}`}
              onClick={() => setSortOrder("Newest")}
            >
              Newest
            </Button>

            <Button
              className={`px-3 py-2 rounded-[7px] border ${sortOrder === "Oldest" ? "bg-primary" : "bg-primary/60"}`}
              onClick={() => setSortOrder("Oldest")}
            >
              Oldest
            </Button>
          </div>
        </div>

        {/* Blog Posts Grid */}
        <section className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6  ">
          {blogPosts.map((post, index) => (
            <Card key={index} className="bg-transparent transition duration-300 hover:scale-105 cursor-pointer">
              <div className="bg-muted h-80 rounded-xl" />
              <CardContent>
                <span className="text-highlight uppercase text-sm mt-3 block pb-[10px]">{post.category}</span>
                <h3 className="text-lg font-semibold mt-2 pb-[15px]">{post.title}</h3>
                <p className="mt-1">{post.date}</p>
              </CardContent>
            </Card>
          ))}
        </section>

        {/* Pagination using ShadCN */}
        <div className="mt-8 flex justify-center ">
        <Pagination>
          <PaginationContent className="flex items-center space-x-2">
            {/* Previous Button */}
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                className={`w-10 h-10 flex items-center justify-center rounded-full border border-white  ${
                  currentPage === 1 ? "opacity-50 cursor-not-allowed" : "hover:border-highlight"
                }`}
              />
            </PaginationItem>

            {/* Page Numbers */}
            <PaginationItem>
              <PaginationLink
                href="#"
                onClick={() => setCurrentPage(1)}
                className={currentPage === 1 ? "text-highlight font-bold" : ""}
              >
                1
              </PaginationLink>
            </PaginationItem>

            <PaginationItem>
              <PaginationLink
                href="#"
                onClick={() => setCurrentPage(2)}
                className={currentPage === 2 ? "text-highlight font-bold" : ""}
              >
                2
              </PaginationLink>
            </PaginationItem>

            <PaginationItem>
              <PaginationLink
                href="#"
                onClick={() => setCurrentPage(3)}
                className={currentPage === 3 ? "text-highlight font-bold" : ""}
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
                className={`w-10 h-10 flex items-center justify-center rounded-full border border-white  ${
                  currentPage === totalPages ? "opacity-50 cursor-not-allowed " : "hover:border-[#52FFF3]"
                }`}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>

      </div>
      <Prefooter 
        signedInAction="Ready to Create Content That Goes Viral?"
        signedOutAction="Ready to Create Content That Goes Viral?"
      />
      <Footer />
    </div>
  );
};

export default BlogPage;
