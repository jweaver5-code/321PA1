import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center py-16">
          <h2 className="text-4xl font-bold text-gray-900 sm:text-6xl">
            Find the Perfect Tutor
          </h2>
          <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto">
            Connect with qualified tutors in your area for personalized academic assistance. 
            Get help with any subject, anytime, anywhere.
          </p>
          <div className="mt-10">
            <Link href="/find-tutors" className="bg-blue-600 text-white px-8 py-3 rounded-md text-lg font-semibold hover:bg-blue-700">
              Get Started
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="py-16">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="text-center">
              <div className="bg-blue-100 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900">Verified Tutors</h3>
                <p className="mt-2 text-gray-600">
                  All tutors are verified students and professionals with proven academic records.
                </p>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-green-100 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900">Instant Booking</h3>
                <p className="mt-2 text-gray-600">
                  Book tutoring sessions instantly or schedule for later. Flexible timing to fit your schedule.
                </p>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900">All Subjects</h3>
                <p className="mt-2 text-gray-600">
                  From math and science to languages and humanities. Find help for any subject or course.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
