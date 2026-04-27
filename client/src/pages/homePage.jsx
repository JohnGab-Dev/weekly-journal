import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { TitleRender } from "@/utils/TitleRender";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import  { Zap, ArrowRightFromLine, Handshake    } from 'lucide-react'
import { Badge } from "@/components/ui/badge";

function HomePage() {
  TitleRender("ReportMaker | Home");

  const developers = [
    {
      name: "John Gabriel Completo",
      role: "Full Stack Developer",
      image: "prof-2.jpg",
      description: "Passionate about building scalable web applications and solving real-world problems through clean and efficient code.",
      skills: ["React Js", "Laravel", "MySQL", "Tailwind", "Codeigniter", "Express Js", "Node Js", "Github"],
    },
    {
      name: "Ivan Justin Blas",
      role: "Full Stack Developer",
      image: "ivan-prof.jpg",
      description: "Focused on building efficient, scalable applications that solve real-world problems with clean code.",
      skills: ["React Js", "Laravel", "MySQL", "Tailwind", "Express Js", "Node Js", "Github", "Firebase"],
    },
  ];

  return (
    <div className="bg-muted flex flex-col">
      {/* HERO SECTION */}
      <div className="h-screen flex flex-col items-center justify-center text-center px-4 gap-4">
        <h1 className="text-5xl sm:text-7xl font-bold text-gray-800">
          Report<span className="text-primary">Maker</span>
        </h1>

        <p className="text-gray-600 max-w-xl text-sm sm:text-base">
          Easily record, manage, and export your weekly reports in just a few clicks.
          Simple, fast, and built for productivity.
        </p>

        <div className="flex gap-4 mt-4">
          <Link to="/login">
            <Button className="px-6 cursor-pointer">Login</Button>
          </Link>
          <Link to="/signup">
            <Button variant="outline" className="px-6 cursor-pointer">
              Sign Up
            </Button>
          </Link>
        </div>
      </div>

      {/* FEATURES SECTION */}
      <div className="px-6 py-32 bg-background">
       
        <h2 className="text-2xl font-semibold text-center mb-8">
          Why use ReportMaker?
        </h2>

        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 max-w-5xl mx-auto">
          <Card>
            <CardContent className="p-6">
               <div className="max-w-12 p-3 rounded-xl flex items-center justify-center bg-gray-200 mb-4">
                  <Zap />
                </div>
              <h3 className="font-semibold mb-2">Fast Reporting</h3>
              <p className="text-sm text-gray-600">
                Create weekly reports instantly without repetitive work.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="max-w-12 p-3 rounded-xl flex items-center justify-center bg-gray-200 mb-4">
                  <ArrowRightFromLine />
                </div>
              <h3 className="font-semibold mb-2">Export Ready</h3>
              <p className="text-sm text-gray-600">
                Download reports in clean and professional formats.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="max-w-12 p-3 rounded-xl flex items-center justify-center bg-gray-200 mb-4">
                  <Handshake />
                </div>
              <h3 className="font-semibold mb-2">User Friendly</h3>
              <p className="text-sm text-gray-600">
                Simple UI designed for efficiency and ease of use.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* DEVELOPERS SECTION */}
      <div className="py-10">
        <h1 className="text-center mb-4 font-medium text-2xl">Developers</h1>
          <div className="gap-6 flex flex-col sm:flex-row items-center justify-center px-3 sm:px-20 mx-auto  ">

            {developers.map((dev, index) => (
              <Card
                key={index}
                className="hover:shadow-lg w-full sm:w-80 h-[30rem]"
              >
                <CardContent className="p-6 flex flex-col items-center text-center gap-4">
                  
                  {/* Avatar */}
                  <Avatar className="w-40 h-40">
                    <AvatarImage src={dev.image} alt={dev.name} />
                    <AvatarFallback>
                      {dev.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>

                  {/* Name & Role */}
                  <div>
                    <h3 className="font-semibold text-lg">{dev.name}</h3>
                    <p className="text-sm text-gray-500">{dev.role}</p>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-gray-600">
                    {dev.description}
                  </p>

                  {/* Skills */}
                  <div className="flex flex-wrap justify-center gap-2">
                    {dev.skills.map((skill, i) => (
                      <Badge key={i} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>

                </CardContent>
              </Card>
            ))}
          </div>
      </div>
      

      {/* FOOTER */}
      <footer className="bg-background px-6 py-6 mt-auto">
        <p className="text-center text-sm text-gray-500">
          © {new Date().getFullYear()} ReportMaker. All rights reserved.
        </p>
      </footer>
    </div>
  );
}

export default HomePage;