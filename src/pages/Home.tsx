import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, Calendar, Clipboard, Users } from 'lucide-react';

export default function Home() {
  return (
    <div className="space-y-16">
      <section className="text-center space-y-8">
        <h1 className="text-5xl font-bold text-gray-900">
          Transform Your Fitness Journey
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Track your workouts, monitor nutrition, and achieve your fitness goals with Gym Tracker Pro.
        </p>
        <div>
          <Link
            to="/auth"
            className="inline-block bg-indigo-600 text-white px-8 py-3 rounded-md text-lg font-semibold hover:bg-indigo-700"
          >
            Get Started
          </Link>
        </div>
      </section>

      <section className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          {
            icon: <Activity className="h-8 w-8 text-indigo-600" />,
            title: "Personalised Workouts",
            description: "Get custom workout plans tailored to your fitness goals"
          },
          {
            icon: <Clipboard className="h-8 w-8 text-indigo-600" />,
            title: "Nutrition Tracking",
            description: "Monitor your daily calories and macronutrients"
          },
          {
            icon: <Calendar className="h-8 w-8 text-indigo-600" />,
            title: "Class Booking",
            description: "Book and manage your fitness class schedule"
          },
          {
            icon: <Users className="h-8 w-8 text-indigo-600" />,
            title: "Expert Guidance",
            description: "Access to professional trainers and workout programs"
          }
        ].map((feature, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-lg shadow-md text-center space-y-4"
          >
            <div className="flex justify-center">{feature.icon}</div>
            <h3 className="text-xl font-semibold text-gray-900">{feature.title}</h3>
            <p className="text-gray-600">{feature.description}</p>
          </div>
        ))}
      </section>

      <section className="bg-white rounded-lg shadow-md p-8 space-y-8">
        <h2 className="text-3xl font-bold text-center text-gray-900">
          Start Your Fitness Journey Today
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: "Track Progress",
              description: "Monitor your fitness journey with detailed analytics and progress tracking"
            },
            {
              title: "Join Classes",
              description: "Access a variety of fitness classes led by expert instructors"
            },
            {
              title: "Stay Motivated",
              description: "Set goals, track achievements, and stay motivated throughout your journey"
            }
          ].map((item, index) => (
            <div key={index} className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900">{item.title}</h3>
              <p className="text-gray-600">{item.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}