import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Header from "../Base/Header";
import Footer from "../Base/Footer";

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
      <section className="text-center mt-16 px-6">
        <h1 className="text-4xl font-bold">Blog</h1>
        <p className="text-white-400 mt-2">
          Explore pro tips, gaming insights, and creator hacks that will level up your content creation.
        </p>
      </section>

      {/* Featured Blog */}
      <section className="mt-10 flex flex-col md:flex-row items-center gap-6 px-6">
        <div className="bg-[#1A1A1C] w-full md:w-2/3 h-64 rounded-lg" />
        <div className="md:w-1/3">
          <span className="text-teal-400 uppercase text-sm">Feature</span>
          <h2 className="text-2xl font-semibold mt-2">
            Crafting Consistency: a thoughtful approach for naming video
          </h2>
          <p className="text-white-400 mt-2">Sep 23, 2024</p>
        </div>
      </section>

      {/* Filters & Sorting */}
      <div className="mt-8 flex flex-col md:flex-row justify-between items-center px-6">
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
          <span className="text-white-400">Sort by:</span>
          <Button
            variant={sortOrder === "Newest" ? "default" : "secondary"}
            onClick={() => setSortOrder("Newest")}
          >
            Newest
          </Button>
          <Button
            variant={sortOrder === "Oldest" ? "default" : "secondary"}
            onClick={() => setSortOrder("Oldest")}
          >
            Oldest
          </Button>
        </div>
      </div>

      {/* Blog Posts Grid */}
      <section className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 px-6">
        {blogPosts.map((post, index) => (
          <Card key={index} className="bg-transparent">
            <div className="bg-[#1A1A1C] h-40 rounded-xl" />
            <CardContent>
              <span className="text-teal-400 uppercase text-sm mt-3 block">{post.category}</span>
              <h3 className="text-lg font-semibold mt-2">{post.title}</h3>
              <p className="text-white-400 mt-1">{post.date}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      {/* Pagination */}
      <div className="mt-8 flex justify-center space-x-3">
        <Button
          variant="secondary"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
        >
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <span className="text-gray-400">
          Page {currentPage} of {totalPages}
        </span>
        <Button
          variant="secondary"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
        >
          <ChevronRight className="w-5 h-5" />
        </Button>
      </div>

      {/* Call-to-Action */}
      <div className="mt-16 text-center px-6 pd-[150px]">
        <h2 className="text-2xl font-semibold">Ready to Create Content That Goes Viral?</h2>
        <Button className="mt-4 px-6 py-3 bg-white text-black font-semibold rounded-full">
          Start creating for free
        </Button>
        <p className="text-gray-400 mt-2">No credit card required</p>
      </div>
      <div className="mt-[150px]">
      <Footer />
      </div>
    </div>
  );
};

export default BlogPage;
